using MediatR;
using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Exceptions;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Application.DefectActs.Commands;
using Tnsu.Inventory.Application.Workflow;
using Tnsu.Inventory.Domain.Entities;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.PurchaseRequests.Commands;

public sealed record CreatePurchaseRequestCommand(CreatePurchaseRequestRequest Request)
    : IRequest<PurchaseRequestDto>;

public sealed class CreatePurchaseRequestHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<CreatePurchaseRequestCommand, PurchaseRequestDto>
{
    public async Task<PurchaseRequestDto> Handle(CreatePurchaseRequestCommand cmd, CancellationToken ct)
    {
        var userId = currentUser.UserId ?? throw new UnauthorizedException();
        if (currentUser.Role != MechanizationRole.SiteMechanic)
            throw new ForbiddenException("Создавать заявку может только механик участка.");

        var req = cmd.Request;
        var number = await NextNumberAsync(db, ct);

        var request = new PurchaseRequest
        {
            Number = number,
            CreatedByUserId = userId,
            DefectActId = req.DefectActId,
            ProjectId = req.ProjectId,
            ProjectCode = req.ProjectCode.Trim(),
            ProjectName = req.ProjectName.Trim(),
            VehicleId = req.VehicleId,
            VehicleName = req.VehicleName.Trim(),
            StateNumber = req.StateNumber.Trim(),
            VinCode = req.VinCode.Trim(),
            VehicleYear = req.VehicleYear,
            Description = req.Description.Trim()
        };

        request.Lines = req.Lines.Select(l => MapLine(request.Id, l)).ToList();
        request.EstimatedAmount = request.Lines.Sum(l => l.EstimatedAmount ?? 0);

        db.PurchaseRequests.Add(request);
        await db.SaveChangesAsync(ct);

        return await PurchaseRequestMapper.ToDtoAsync(db, request.Id, currentUser, ct);
    }

    private static async Task<string> NextNumberAsync(IInventoryDbContext db, CancellationToken ct)
    {
        var year = DateTime.UtcNow.Year;
        var count = await db.PurchaseRequests.CountAsync(r => r.CreatedAt.Year == year, ct);
        return $"PR-{year}-{(count + 1):D5}";
    }

    private static PurchaseRequestLine MapLine(Guid requestId, PurchaseRequestLineInput l)
    {
        var amount = l.EstimatedUnitPrice.HasValue ? l.EstimatedUnitPrice.Value * l.Quantity : (decimal?)null;
        return new PurchaseRequestLine
        {
            PurchaseRequestId = requestId,
            LineNo = l.LineNo,
            Name = l.Name.Trim(),
            CatalogNumber = l.CatalogNumber?.Trim(),
            Quantity = l.Quantity,
            Unit = l.Unit?.Trim(),
            EstimatedUnitPrice = l.EstimatedUnitPrice,
            EstimatedAmount = amount,
            Notes = l.Notes?.Trim()
        };
    }
}

public sealed record UpdatePurchaseRequestCommand(Guid Id, UpdatePurchaseRequestRequest Request)
    : IRequest<PurchaseRequestDto>;

public sealed class UpdatePurchaseRequestHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<UpdatePurchaseRequestCommand, PurchaseRequestDto>
{
    public async Task<PurchaseRequestDto> Handle(UpdatePurchaseRequestCommand cmd, CancellationToken ct)
    {
        var request = await db.PurchaseRequests
            .Include(r => r.Lines)
            .FirstOrDefaultAsync(r => r.Id == cmd.Id, ct)
            ?? throw new NotFoundException("PurchaseRequest", cmd.Id);

        EnsureEditable(request, currentUser);

        request.Description = cmd.Request.Description.Trim();
        request.UpdatedAt = DateTimeOffset.UtcNow;
        db.PurchaseRequestLines.RemoveRange(request.Lines);
        request.Lines = cmd.Request.Lines.Select(l =>
        {
            var line = new PurchaseRequestLine
            {
                PurchaseRequestId = request.Id,
                LineNo = l.LineNo,
                Name = l.Name.Trim(),
                CatalogNumber = l.CatalogNumber?.Trim(),
                Quantity = l.Quantity,
                Unit = l.Unit?.Trim(),
                EstimatedUnitPrice = l.EstimatedUnitPrice,
                EstimatedAmount = l.EstimatedUnitPrice.HasValue
                    ? l.EstimatedUnitPrice.Value * l.Quantity
                    : null,
                Notes = l.Notes?.Trim()
            };
            return line;
        }).ToList();
        request.EstimatedAmount = request.Lines.Sum(x => x.EstimatedAmount ?? 0);

        await db.SaveChangesAsync(ct);
        return await PurchaseRequestMapper.ToDtoAsync(db, request.Id, currentUser, ct);
    }

    internal static void EnsureEditable(PurchaseRequest request, ICurrentUser currentUser)
    {
        if (request.Status is not WorkflowStatus.Draft and not WorkflowStatus.Returned)
            throw new ConflictException("not_editable",
                "Изменение шапки заявки после старта согласования запрещено (только через возврат на доработку).");

        if (currentUser.UserId != request.CreatedByUserId)
            throw new ForbiddenException("Редактировать может только автор.");
    }
}

public sealed record SubmitPurchaseRequestCommand(Guid Id) : IRequest<PurchaseRequestDto>;

public sealed class SubmitPurchaseRequestHandler(
    IInventoryDbContext db,
    ICurrentUser currentUser,
    INotificationService notifications)
    : IRequestHandler<SubmitPurchaseRequestCommand, PurchaseRequestDto>
{
    public async Task<PurchaseRequestDto> Handle(SubmitPurchaseRequestCommand cmd, CancellationToken ct)
    {
        var request = await db.PurchaseRequests
            .Include(r => r.Lines)
            .FirstOrDefaultAsync(r => r.Id == cmd.Id, ct)
            ?? throw new NotFoundException("PurchaseRequest", cmd.Id);

        UpdatePurchaseRequestHandler.EnsureEditable(request, currentUser);

        if (request.Lines.Count == 0)
            throw new ValidationFailedException("Добавьте хотя бы одну позицию.");

        var hasPending = await db.ApprovalSteps.AnyAsync(
            s => s.PurchaseRequestId == request.Id && s.Status == ApprovalStepStatus.Pending, ct);
        if (hasPending)
            throw new ConflictException("approval_in_progress", "Заявка уже на согласовании.");

        IReadOnlySet<string> skipRoles = new HashSet<string>();
        if (request.DefectActId is Guid defectActId)
        {
            var defectSteps = await db.ApprovalSteps
                .Where(s => s.DefectActId == defectActId)
                .ToListAsync(ct);
            var latestRound = ApprovalWorkflowBuilder.LatestRoundSteps(defectSteps);
            var approvedRoles = ApprovalWorkflowBuilder.CollectApprovedRoles(latestRound).ToHashSet();
            approvedRoles.Remove(MechanizationRole.ProjectStorekeeper);
            approvedRoles.Remove(MechanizationRole.ChiefMechanic);
            skipRoles = approvedRoles;
        }

        var startFrom = request.Status == WorkflowStatus.Returned && request.ResumeFromReturnStep
            ? request.ResubmitFromStepOrder
            : 1;

        var roundId = Guid.NewGuid();
        var overrides = await db.DocumentApprovalAssignees
            .Where(x => x.PurchaseRequestId == request.Id)
            .ToDictionaryAsync(x => x.Role, x => x.UserId, ct);
        var steps = await ApprovalWorkflowBuilder.BuildPurchaseRequestStepsAsync(
            db, request, roundId, skipRoles, overrides, startFrom, ct);

        if (!steps.Any(s => s.Status == ApprovalStepStatus.Pending))
        {
            request.Status = WorkflowStatus.Approved;
        }
        else
        {
            request.Status = ApprovalWorkflowBuilder.ResolveDocumentStatus(steps, request.Status);
        }
        request.UpdatedAt = DateTimeOffset.UtcNow;
        db.ApprovalSteps.AddRange(steps);
        await db.SaveChangesAsync(ct);

        var firstPendingStep = steps.FirstOrDefault(s => s.Status == ApprovalStepStatus.Pending);
        if (firstPendingStep is not null)
        {
            var assignedNotification = await Approvals.Commands.WorkflowNotificationFactory
                .BuildAssignedAsync(db, firstPendingStep, ct);
            await notifications.SendAssignedForApprovalAsync(assignedNotification, ct);
        }

        return await PurchaseRequestMapper.ToDtoAsync(db, request.Id, currentUser, ct);
    }
}

public sealed record CancelPurchaseRequestCommand(Guid Id, string Comment) : IRequest<PurchaseRequestDto>;

public sealed class CancelPurchaseRequestHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<CancelPurchaseRequestCommand, PurchaseRequestDto>
{
    public async Task<PurchaseRequestDto> Handle(CancelPurchaseRequestCommand cmd, CancellationToken ct)
    {
        var request = await db.PurchaseRequests.FirstOrDefaultAsync(r => r.Id == cmd.Id, ct)
            ?? throw new NotFoundException("PurchaseRequest", cmd.Id);

        if (currentUser.UserId != request.CreatedByUserId)
            throw new ForbiddenException("Отменить может только инициатор.");

        request.Status = WorkflowStatus.Cancelled;
        request.CancelComment = cmd.Comment.Trim();
        request.UpdatedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);

        return await PurchaseRequestMapper.ToDtoAsync(db, request.Id, currentUser, ct);
    }
}

public sealed record AssignExecutorCommand(Guid Id, AssignExecutorRequest Request) : IRequest<PurchaseRequestDto>;

public sealed class AssignExecutorHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<AssignExecutorCommand, PurchaseRequestDto>
{
    public async Task<PurchaseRequestDto> Handle(AssignExecutorCommand cmd, CancellationToken ct)
    {
        if (currentUser.Role != MechanizationRole.OmtsHead)
            throw new ForbiddenException("Назначать исполнителя может только руководитель ОМТС.");

        var request = await db.PurchaseRequests.FirstOrDefaultAsync(r => r.Id == cmd.Id, ct)
            ?? throw new NotFoundException("PurchaseRequest", cmd.Id);

        if (request.Status != WorkflowStatus.Approved)
            throw new ConflictException("not_approved", "Заявка должна быть утверждена.");

        var executor = await db.Users.FirstOrDefaultAsync(
            u => u.Id == cmd.Request.ExecutorUserId && u.IsActive, ct)
            ?? throw new NotFoundException("AppUser", cmd.Request.ExecutorUserId);

        if (executor.Role != MechanizationRole.OmtsSpecialist)
            throw new ValidationFailedException("Исполнителем может быть только специалист ОМТС.");

        request.AssignedExecutorUserId = executor.Id;
        request.Status = WorkflowStatus.ExecutorAssigned;
        request.UpdatedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);

        return await PurchaseRequestMapper.ToDtoAsync(db, request.Id, currentUser, ct);
    }
}

public sealed record StartPurchaseExecutionCommand(Guid Id) : IRequest<PurchaseRequestDto>;

public sealed class StartPurchaseExecutionHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<StartPurchaseExecutionCommand, PurchaseRequestDto>
{
    public async Task<PurchaseRequestDto> Handle(StartPurchaseExecutionCommand cmd, CancellationToken ct)
    {
        var request = await db.PurchaseRequests.FirstOrDefaultAsync(r => r.Id == cmd.Id, ct)
            ?? throw new NotFoundException("PurchaseRequest", cmd.Id);

        if (currentUser.UserId != request.AssignedExecutorUserId)
            throw new ForbiddenException("В работу может взять только назначенный исполнитель.");

        if (request.Status != WorkflowStatus.ExecutorAssigned)
            throw new ConflictException("invalid_status", "Заявка должна иметь назначенного исполнителя.");

        request.Status = WorkflowStatus.InProgress;
        request.UpdatedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);

        return await PurchaseRequestMapper.ToDtoAsync(db, request.Id, currentUser, ct);
    }
}

public sealed record ClosePurchaseRequestCommand(Guid Id) : IRequest<PurchaseRequestDto>;

public sealed class ClosePurchaseRequestHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<ClosePurchaseRequestCommand, PurchaseRequestDto>
{
    public async Task<PurchaseRequestDto> Handle(ClosePurchaseRequestCommand cmd, CancellationToken ct)
    {
        var request = await db.PurchaseRequests.FirstOrDefaultAsync(r => r.Id == cmd.Id, ct)
            ?? throw new NotFoundException("PurchaseRequest", cmd.Id);

        if (currentUser.UserId != request.AssignedExecutorUserId &&
            currentUser.Role != MechanizationRole.OmtsHead)
            throw new ForbiddenException("Закрыть заявку может исполнитель или руководитель ОМТС.");

        if (request.Status != WorkflowStatus.InProgress)
            throw new ConflictException("invalid_status", "Заявка должна быть в работе.");

        request.Status = WorkflowStatus.Closed;
        request.UpdatedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);

        return await PurchaseRequestMapper.ToDtoAsync(db, request.Id, currentUser, ct);
    }
}
