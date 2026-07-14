using MediatR;
using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Exceptions;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Application.DefectActs;
using Tnsu.Inventory.Application.Workflow;
using Tnsu.Inventory.Domain;
using Tnsu.Inventory.Domain.Entities;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.Approvals.Commands;

public sealed record ApproveStepCommand(Guid StepId, string? Comment, string? DigitalSignatureRef)
    : IRequest<Unit>;

public sealed class ApproveStepHandler(
    IInventoryDbContext db,
    ICurrentUser currentUser,
    INotificationService notifications)
    : IRequestHandler<ApproveStepCommand, Unit>
{
    public async Task<Unit> Handle(ApproveStepCommand cmd, CancellationToken ct)
    {
        var (step, _) = await ApprovalStepLoader.LoadPendingStepAsync(db, cmd.StepId, currentUser, ct);
        var actedByAdmin = currentUser.Role is MechanizationRole.ChiefMechanic
            or MechanizationRole.OmtsHead
            or MechanizationRole.CommercialDirector;

        var now = DateTimeOffset.UtcNow;
        step.Status = ApprovalStepStatus.Approved;
        step.Action = ApprovalAction.Approved;
        step.Comment = ApprovalDecisionCommentHelper.Build(
            cmd.Comment, actedByAdmin, currentUser, step.ApproverRole);
        step.DigitalSignatureRef = cmd.DigitalSignatureRef?.Trim();
        step.DecidedAt = now;

        var roundSteps = await db.ApprovalSteps
            .Where(s => s.RoundId == step.RoundId)
            .ToListAsync(ct);

        await ApprovalWorkflowBuilder.ActivateNextStepAsync(db, roundSteps, ct);

        string? documentStatus = null;
        if (step.DefectActId is Guid defectActId)
            documentStatus = await UpdateDefectActStatusAsync(db, defectActId, roundSteps, ct);
        else if (step.PurchaseRequestId is Guid purchaseId)
            documentStatus = await UpdatePurchaseRequestStatusAsync(db, purchaseId, roundSteps, ct);

        await db.SaveChangesAsync(ct);

        var nextPendingStep = roundSteps
            .FirstOrDefault(s => s.Status == ApprovalStepStatus.Pending && s.AssignedAt.HasValue && s.DecidedAt == null);
        if (nextPendingStep is not null)
        {
            var assignedNotification = await WorkflowNotificationFactory.BuildAssignedAsync(db, nextPendingStep, ct);
            await notifications.SendAssignedForApprovalAsync(assignedNotification, ct);
        }
        else if (documentStatus is WorkflowStatus.Approved or WorkflowStatus.Signed)
        {
            var approvedNotification = await WorkflowNotificationFactory.BuildInitiatorAsync(db, step, ct);
            await notifications.SendApprovedAsync(approvedNotification, ct);

            if (step.PurchaseRequestId is Guid approvedPurchaseId)
                await NotifyExecutionAssignersAsync(db, notifications, approvedPurchaseId, ct);
        }

        return Unit.Value;
    }

    private static async Task NotifyExecutionAssignersAsync(
        IInventoryDbContext db,
        INotificationService notifications,
        Guid purchaseRequestId,
        CancellationToken ct)
    {
        var directors = await db.Users.AsNoTracking()
            .Where(u => u.IsActive && (
                u.Role == MechanizationRole.CommercialDirector ||
                u.Role == MechanizationRole.OmtsHead))
            .ToListAsync(ct);
        if (directors.Count == 0) return;

        var request = await db.PurchaseRequests.AsNoTracking()
            .Include(r => r.CreatedBy)
            .FirstAsync(r => r.Id == purchaseRequestId, ct);

        foreach (var director in directors)
        {
            var n = new WorkflowNotification(
                DocumentTypes.PurchaseRequest,
                request.Id,
                request.Number,
                director.Email,
                director.FullName,
                request.CreatedBy?.Email ?? "",
                request.CreatedBy?.FullName ?? "—",
                null,
                $"/purchase-requests/{request.Id:D}");
            await notifications.SendAwaitingExecutionAsync(n, ct);
        }
    }

    private static async Task<string> UpdateDefectActStatusAsync(
        IInventoryDbContext db, Guid actId, List<ApprovalStep> roundSteps, CancellationToken ct)
    {
        var act = await db.DefectActs.FirstAsync(a => a.Id == actId, ct);
        act.Status = ApprovalWorkflowBuilder.ResolveDocumentStatus(roundSteps, act.Status);
        act.UpdatedAt = DateTimeOffset.UtcNow;

        if (act.Status == WorkflowStatus.Approved)
        {
            act.SignedAt = DateTimeOffset.UtcNow;
            act.Status = WorkflowStatus.Signed;
        }

        return act.Status;
    }

    private static async Task<string> UpdatePurchaseRequestStatusAsync(
        IInventoryDbContext db, Guid requestId, List<ApprovalStep> roundSteps, CancellationToken ct)
    {
        var request = await db.PurchaseRequests.FirstAsync(r => r.Id == requestId, ct);
        request.Status = ApprovalWorkflowBuilder.ResolveDocumentStatus(roundSteps, request.Status);
        request.UpdatedAt = DateTimeOffset.UtcNow;
        return request.Status;
    }
}

public sealed record ReturnStepCommand(Guid StepId, string Comment) : IRequest<Unit>;

public sealed class ReturnStepHandler(
    IInventoryDbContext db,
    ICurrentUser currentUser,
    INotificationService notifications)
    : IRequestHandler<ReturnStepCommand, Unit>
{
    public async Task<Unit> Handle(ReturnStepCommand cmd, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(cmd.Comment))
            throw new ValidationFailedException("Комментарий обязателен при возврате на доработку.");

        var (step, _) = await ApprovalStepLoader.LoadPendingStepAsync(db, cmd.StepId, currentUser, ct);
        var actedByAdmin = currentUser.Role is MechanizationRole.ChiefMechanic
            or MechanizationRole.OmtsHead
            or MechanizationRole.CommercialDirector;
        var now = DateTimeOffset.UtcNow;

        step.Status = ApprovalStepStatus.Returned;
        step.Action = ApprovalAction.Returned;
        step.Comment = ApprovalDecisionCommentHelper.Build(
            cmd.Comment, actedByAdmin, currentUser, step.ApproverRole);
        step.DecidedAt = now;

        if (step.DefectActId is Guid defectActId)
        {
            var act = await db.DefectActs.FirstAsync(a => a.Id == defectActId, ct);
            act.Status = WorkflowStatus.Returned;
            act.ResubmitFromStepOrder = step.OrderNo;
            act.UpdatedAt = now;
        }
        else if (step.PurchaseRequestId is Guid purchaseId)
        {
            var request = await db.PurchaseRequests.FirstAsync(r => r.Id == purchaseId, ct);
            request.Status = WorkflowStatus.Returned;
            request.ResubmitFromStepOrder = step.OrderNo;
            request.UpdatedAt = now;
        }

        await db.SaveChangesAsync(ct);

        var returnedNotification = await WorkflowNotificationFactory.BuildInitiatorAsync(db, step, ct, cmd.Comment.Trim());
        await notifications.SendReturnedAsync(returnedNotification, ct);
        return Unit.Value;
    }
}

public sealed record RejectStepCommand(Guid StepId, string Comment) : IRequest<Unit>;

public sealed class RejectStepHandler(
    IInventoryDbContext db,
    ICurrentUser currentUser,
    INotificationService notifications)
    : IRequestHandler<RejectStepCommand, Unit>
{
    public async Task<Unit> Handle(RejectStepCommand cmd, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(cmd.Comment))
            throw new ValidationFailedException("Комментарий обязателен при отклонении.");

        var (step, _) = await ApprovalStepLoader.LoadPendingStepAsync(db, cmd.StepId, currentUser, ct);
        var actedByAdmin = currentUser.Role is MechanizationRole.ChiefMechanic
            or MechanizationRole.OmtsHead
            or MechanizationRole.CommercialDirector;
        var now = DateTimeOffset.UtcNow;

        step.Status = ApprovalStepStatus.Rejected;
        step.Action = ApprovalAction.Rejected;
        step.Comment = ApprovalDecisionCommentHelper.Build(
            cmd.Comment, actedByAdmin, currentUser, step.ApproverRole);
        step.DecidedAt = now;

        if (step.DefectActId is Guid defectActId)
        {
            var act = await db.DefectActs.FirstAsync(a => a.Id == defectActId, ct);
            act.Status = WorkflowStatus.Rejected;
            act.UpdatedAt = now;
        }
        else if (step.PurchaseRequestId is Guid purchaseId)
        {
            var request = await db.PurchaseRequests.FirstAsync(r => r.Id == purchaseId, ct);
            request.Status = WorkflowStatus.Rejected;
            request.UpdatedAt = now;
        }

        await db.SaveChangesAsync(ct);

        var rejectedNotification = await WorkflowNotificationFactory.BuildInitiatorAsync(db, step, ct, cmd.Comment.Trim());
        await notifications.SendRejectedAsync(rejectedNotification, ct);
        return Unit.Value;
    }
}

public sealed record GetApprovalInboxQuery() : IRequest<IReadOnlyList<InboxItemDto>>;

public sealed class GetApprovalInboxHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<GetApprovalInboxQuery, IReadOnlyList<InboxItemDto>>
{
    public async Task<IReadOnlyList<InboxItemDto>> Handle(GetApprovalInboxQuery q, CancellationToken ct)
    {
        var userId = currentUser.UserId ?? throw new UnauthorizedException();
        var isAdmin = currentUser.Role is MechanizationRole.ChiefMechanic
            or MechanizationRole.OmtsHead
            or MechanizationRole.CommercialDirector;

        var stepsQuery = db.ApprovalSteps.AsNoTracking()
            .Include(s => s.DefectAct)
            .Include(s => s.PurchaseRequest)
            .Where(s => s.Status == ApprovalStepStatus.Pending);
        if (!isAdmin)
            stepsQuery = stepsQuery.Where(s => s.ApproverUserId == userId);

        var steps = await stepsQuery.OrderBy(s => s.AssignedAt).ToListAsync(ct);

        var result = new List<InboxItemDto>();
        foreach (var step in steps)
        {
            var earlierPending = await db.ApprovalSteps.AnyAsync(s =>
                s.RoundId == step.RoundId &&
                s.Status == ApprovalStepStatus.Pending &&
                s.OrderNo < step.OrderNo, ct);
            if (earlierPending) continue;

            var (docType, docId, number, title) = step.DocumentType switch
            {
                DocumentTypes.DefectAct => (
                    DocumentTypes.DefectAct,
                    step.DefectActId!.Value,
                    step.DefectAct!.Number,
                    step.DefectAct.VehicleName),
                _ => (
                    DocumentTypes.PurchaseRequest,
                    step.PurchaseRequestId!.Value,
                    step.PurchaseRequest!.Number,
                    step.PurchaseRequest.VehicleName)
            };

            var pendingDays = step.AssignedAt.HasValue
                ? WorkingDayCalculator.CountWorkingDays(step.AssignedAt.Value, DateTimeOffset.UtcNow)
                : 0;

            result.Add(new InboxItemDto(
                step.Id, docType, docId, number, title,
                step.ApproverRole, MechanizationRole.Label(step.ApproverRole),
                step.OrderNo, step.AssignedAt, pendingDays));
        }

        return result;
    }
}

internal static class WorkingDayCalculator
{
    public static int CountWorkingDays(DateTimeOffset from, DateTimeOffset to)
    {
        var days = 0;
        var date = from.Date;
        while (date < to.Date)
        {
            date = date.AddDays(1);
            if (date.DayOfWeek is not DayOfWeek.Saturday and not DayOfWeek.Sunday)
                days++;
        }
        return days;
    }
}

internal static class ApprovalDecisionCommentHelper
{
    public static string? Build(
        string? userComment,
        bool actedByAdmin,
        ICurrentUser currentUser,
        string approverRole)
    {
        var baseComment = string.IsNullOrWhiteSpace(userComment) ? null : userComment.Trim();
        if (!actedByAdmin) return baseComment;

        var adminName = string.IsNullOrWhiteSpace(currentUser.Email) ? "Администратор" : currentUser.Email.Trim();
        var adminMark = $"[от имени: {MechanizationRole.Label(approverRole)}, {adminName}]";
        return string.IsNullOrWhiteSpace(baseComment) ? adminMark : $"{baseComment} {adminMark}";
    }
}

internal static class WorkflowNotificationFactory
{
    public static async Task<WorkflowNotification> BuildAssignedAsync(
        IInventoryDbContext db,
        ApprovalStep step,
        CancellationToken ct)
    {
        var recipient = await db.Users
            .AsNoTracking()
            .FirstAsync(u => u.Id == step.ApproverUserId, ct);
        var (documentType, documentId, documentNumber, initiator) = await LoadDocumentAsync(db, step, ct);

        return new WorkflowNotification(
            documentType,
            documentId,
            documentNumber,
            recipient.Email,
            recipient.FullName,
            initiator.Email,
            initiator.FullName,
            null,
            BuildLink(documentType, documentId));
    }

    public static async Task<WorkflowNotification> BuildInitiatorAsync(
        IInventoryDbContext db,
        ApprovalStep step,
        CancellationToken ct,
        string? comment = null)
    {
        var (documentType, documentId, documentNumber, initiator) = await LoadDocumentAsync(db, step, ct);
        return new WorkflowNotification(
            documentType,
            documentId,
            documentNumber,
            initiator.Email,
            initiator.FullName,
            initiator.Email,
            initiator.FullName,
            comment,
            BuildLink(documentType, documentId));
    }

    private static async Task<(string DocumentType, Guid DocumentId, string DocumentNumber, AppUser Initiator)> LoadDocumentAsync(
        IInventoryDbContext db,
        ApprovalStep step,
        CancellationToken ct)
    {
        if (step.DefectActId is Guid defectActId)
        {
            var act = await db.DefectActs.AsNoTracking().FirstAsync(a => a.Id == defectActId, ct);
            var initiator = await db.Users.AsNoTracking().FirstAsync(u => u.Id == act.CreatedByUserId, ct);
            return (DocumentTypes.DefectAct, act.Id, act.Number, initiator);
        }

        var request = await db.PurchaseRequests.AsNoTracking().FirstAsync(r => r.Id == step.PurchaseRequestId!.Value, ct);
        var creator = await db.Users.AsNoTracking().FirstAsync(u => u.Id == request.CreatedByUserId, ct);
        return (DocumentTypes.PurchaseRequest, request.Id, request.Number, creator);
    }

    private static string BuildLink(string documentType, Guid documentId) =>
        documentType == DocumentTypes.DefectAct
            ? $"/defect-acts/{documentId:D}"
            : $"/purchase-requests/{documentId:D}";
}
