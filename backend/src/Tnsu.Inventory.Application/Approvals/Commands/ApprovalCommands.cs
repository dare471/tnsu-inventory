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

public sealed class ApproveStepHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<ApproveStepCommand, Unit>
{
    public async Task<Unit> Handle(ApproveStepCommand cmd, CancellationToken ct)
    {
        var (step, _) = await ApprovalStepLoader.LoadPendingStepAsync(db, cmd.StepId, currentUser, ct);

        if (step.RequiresDigitalSignature && string.IsNullOrWhiteSpace(cmd.DigitalSignatureRef))
            throw new ValidationFailedException("Для утверждения главным механиком требуется ЭЦП.");

        var now = DateTimeOffset.UtcNow;
        step.Status = ApprovalStepStatus.Approved;
        step.Action = ApprovalAction.Approved;
        step.Comment = cmd.Comment?.Trim();
        step.DigitalSignatureRef = cmd.DigitalSignatureRef?.Trim();
        step.DecidedAt = now;

        var roundSteps = await db.ApprovalSteps
            .Where(s => s.RoundId == step.RoundId)
            .ToListAsync(ct);

        await ApprovalWorkflowBuilder.ActivateNextStepAsync(db, roundSteps, ct);

        if (step.DefectActId is Guid defectActId)
            await UpdateDefectActStatusAsync(db, defectActId, roundSteps, ct);
        else if (step.PurchaseRequestId is Guid purchaseId)
            await UpdatePurchaseRequestStatusAsync(db, purchaseId, roundSteps, ct);

        await db.SaveChangesAsync(ct);
        return Unit.Value;
    }

    private static async Task UpdateDefectActStatusAsync(
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
    }

    private static async Task UpdatePurchaseRequestStatusAsync(
        IInventoryDbContext db, Guid requestId, List<ApprovalStep> roundSteps, CancellationToken ct)
    {
        var request = await db.PurchaseRequests.FirstAsync(r => r.Id == requestId, ct);
        request.Status = ApprovalWorkflowBuilder.ResolveDocumentStatus(roundSteps, request.Status);
        request.UpdatedAt = DateTimeOffset.UtcNow;
    }
}

public sealed record ReturnStepCommand(Guid StepId, string Comment) : IRequest<Unit>;

public sealed class ReturnStepHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<ReturnStepCommand, Unit>
{
    public async Task<Unit> Handle(ReturnStepCommand cmd, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(cmd.Comment))
            throw new ValidationFailedException("Комментарий обязателен при возврате на доработку.");

        var (step, _) = await ApprovalStepLoader.LoadPendingStepAsync(db, cmd.StepId, currentUser, ct);
        var now = DateTimeOffset.UtcNow;

        step.Status = ApprovalStepStatus.Returned;
        step.Action = ApprovalAction.Returned;
        step.Comment = cmd.Comment.Trim();
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
        return Unit.Value;
    }
}

public sealed record RejectStepCommand(Guid StepId, string Comment) : IRequest<Unit>;

public sealed class RejectStepHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<RejectStepCommand, Unit>
{
    public async Task<Unit> Handle(RejectStepCommand cmd, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(cmd.Comment))
            throw new ValidationFailedException("Комментарий обязателен при отклонении.");

        var (step, _) = await ApprovalStepLoader.LoadPendingStepAsync(db, cmd.StepId, currentUser, ct);
        var now = DateTimeOffset.UtcNow;

        step.Status = ApprovalStepStatus.Rejected;
        step.Action = ApprovalAction.Rejected;
        step.Comment = cmd.Comment.Trim();
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

        var steps = await db.ApprovalSteps.AsNoTracking()
            .Include(s => s.DefectAct)
            .Include(s => s.PurchaseRequest)
            .Where(s => s.ApproverUserId == userId && s.Status == ApprovalStepStatus.Pending)
            .OrderBy(s => s.AssignedAt)
            .ToListAsync(ct);

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
