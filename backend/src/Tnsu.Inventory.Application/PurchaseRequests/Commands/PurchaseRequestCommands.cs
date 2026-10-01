using MediatR;
using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common;
using Tnsu.Inventory.Application.Common.Exceptions;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Application.DefectActs.Commands;
using Tnsu.Inventory.Application.Workflow;
using Tnsu.Inventory.Domain;
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
        if (req.DefectActId is Guid defectActId)
        {
            var exists = await db.PurchaseRequests.AnyAsync(
                r => r.DefectActId == defectActId && r.Status != WorkflowStatus.Cancelled, ct);
            if (exists)
                throw new ConflictException("purchase_exists", "По этому дефектному акту уже есть заявка на закуп.");
        }

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
            VehicleGroupName = req.VehicleGroupName.Trim(),
            StateNumber = req.StateNumber.Trim(),
            VinCode = req.VinCode.Trim(),
            VehicleYear = req.VehicleYear,
            RepairType = RepairType.Normalize(req.RepairType),
            RepairCategory = RepairCategory.Normalize(req.RepairCategory),
            Odometer = req.Odometer,
            EngineHours = req.EngineHours,
            Description = req.Description.Trim(),
            DeliveryDate = req.DeliveryDate ?? DefaultDeliveryDate()
        };

        request.Lines = req.Lines.Where(l => !l.IsRemoved).Select(l => MapLine(number, request.Id, l)).ToList();
        request.EstimatedAmount = request.Lines.Where(l => !l.IsRemoved).Sum(l => l.EstimatedAmount ?? 0);

        db.PurchaseRequests.Add(request);
        await DocumentChangeWriter.AddAsync(
            db, currentUser, DocumentTypes.PurchaseRequest, request.Id,
            "created", "Заявка создана", ct);
        await db.SaveChangesAsync(ct);

        return await PurchaseRequestMapper.ToDtoAsync(db, request.Id, currentUser, ct);
    }

    internal static DateOnly DefaultDeliveryDate() =>
        DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30));

    private static async Task<string> NextNumberAsync(IInventoryDbContext db, CancellationToken ct)
    {
        var year = DateTime.UtcNow.Year;
        var count = await db.PurchaseRequests.CountAsync(r => r.CreatedAt.Year == year, ct);
        return $"PR-{year}-{(count + 1):D5}";
    }

    internal static PurchaseRequestLine MapLine(string requestNumber, Guid requestId, PurchaseRequestLineInput l)
    {
        var amount = l.EstimatedUnitPrice.HasValue ? l.EstimatedUnitPrice.Value * l.Quantity : (decimal?)null;
        return new PurchaseRequestLine
        {
            PurchaseRequestId = requestId,
            LineNo = l.LineNo,
            Code = $"{requestNumber}-{l.LineNo:D2}",
            Name = l.Name.Trim(),
            CatalogNumber = PartFieldRules.CatalogNumber(l.CatalogNumber),
            Quantity = l.Quantity,
            Unit = PartFieldRules.Unit(l.Unit),
            EstimatedUnitPrice = l.EstimatedUnitPrice,
            EstimatedAmount = amount,
            Notes = l.Notes?.Trim(),
            SourceDefectActPartId = l.SourceDefectActPartId,
            MaxQuantity = l.SourceDefectActPartId is null ? null : l.Quantity,
            IsRemoved = l.IsRemoved
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

        if (request.DefectActId is not null)
            ApplyDefectLinkedUpdate(request, cmd.Request);
        else
            ApplyFreeUpdate(db, request, cmd.Request);

        request.UpdatedAt = DateTimeOffset.UtcNow;
        await DocumentChangeWriter.AddAsync(
            db, currentUser, DocumentTypes.PurchaseRequest, request.Id,
            "updated", BuildUpdateSummary(request), ct);
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

    private static void ApplyDefectLinkedUpdate(PurchaseRequest request, UpdatePurchaseRequestRequest body)
    {
        var incoming = body.Lines ?? [];
        if (incoming.Any(l => l.Id is null && l.SourceDefectActPartId is null))
            throw new ValidationFailedException("В заявке из дефектного акта нельзя добавлять новые позиции.");

        foreach (var line in request.Lines)
        {
            var input = incoming.FirstOrDefault(l =>
                (l.Id is not null && l.Id == line.Id)
                || (l.SourceDefectActPartId is not null && l.SourceDefectActPartId == line.SourceDefectActPartId)
                || (l.Id is null && l.SourceDefectActPartId is null && l.LineNo == line.LineNo));

            line.MaxQuantity ??= line.Quantity;
            if (input is null || input.IsRemoved)
            {
                if (!line.IsRemoved)
                {
                    line.IsRemoved = true;
                    line.RemovedAt = DateTimeOffset.UtcNow;
                }
                continue;
            }

            var incomingCatalog = PartFieldRules.CatalogNumber(input.CatalogNumber);
            var storedCatalog = string.IsNullOrWhiteSpace(line.CatalogNumber) ? null : line.CatalogNumber.Trim();
            if (!string.Equals(input.Name.Trim(), line.Name.Trim(), StringComparison.Ordinal)
                || !string.Equals(incomingCatalog, storedCatalog, StringComparison.Ordinal)
                || !string.Equals(PartFieldRules.Unit(input.Unit), MeasurementUnits.Normalize(line.Unit), StringComparison.Ordinal))
                throw new ValidationFailedException($"В заявке из дефектного акта можно менять только количество («{line.Name}»).");

            if (input.Quantity <= 0)
                throw new ValidationFailedException($"Количество «{line.Name}» должно быть больше нуля. Чтобы убрать позицию, удалите её.");

            if (input.Quantity > line.MaxQuantity)
                throw new ValidationFailedException(
                    $"Количество «{line.Name}» нельзя увеличить выше {line.MaxQuantity} из дефектного акта.");

            line.IsRemoved = false;
            line.RemovedAt = null;
            line.Quantity = input.Quantity;
            line.EstimatedAmount = line.EstimatedUnitPrice.HasValue
                ? line.EstimatedUnitPrice.Value * input.Quantity
                : null;
        }

        if (!request.Lines.Any(l => !l.IsRemoved))
            throw new ValidationFailedException("В заявке должна остаться хотя бы одна позиция.");

        request.EstimatedAmount = request.Lines.Where(l => !l.IsRemoved).Sum(x => x.EstimatedAmount ?? 0);
    }

    private static void ApplyFreeUpdate(
        IInventoryDbContext db, PurchaseRequest request, UpdatePurchaseRequestRequest body)
    {
        request.RepairType = RepairType.Normalize(body.RepairType);
        request.RepairCategory = RepairCategory.Normalize(body.RepairCategory);
        request.Odometer = body.Odometer;
        request.EngineHours = body.EngineHours;
        request.Description = body.Description.Trim();
        request.DeliveryDate = body.DeliveryDate ?? request.DeliveryDate ?? CreatePurchaseRequestHandler.DefaultDeliveryDate();

        foreach (var existing in request.Lines.ToList())
            db.PurchaseRequestLines.Remove(existing);
        request.Lines.Clear();
        var lineNo = 1;
        foreach (var l in body.Lines.Where(x => !x.IsRemoved))
        {
            request.Lines.Add(CreatePurchaseRequestHandler.MapLine(request.Number, request.Id, l with { LineNo = lineNo++ }));
        }
        request.EstimatedAmount = request.Lines.Sum(x => x.EstimatedAmount ?? 0);
    }

    private static string BuildUpdateSummary(PurchaseRequest request)
    {
        var active = request.Lines.Count(l => !l.IsRemoved);
        var removed = request.Lines.Count(l => l.IsRemoved);
        return removed > 0
            ? $"Сохранены изменения: позиций {active}, исключено {removed}."
            : $"Сохранены изменения: позиций {active}.";
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

        if (!request.Lines.Any(l => !l.IsRemoved))
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
        var launches = await db.ApprovalSteps.AsNoTracking()
            .Where(s => s.PurchaseRequestId == request.Id)
            .Select(s => s.RoundId)
            .Distinct()
            .CountAsync(ct);
        await DocumentChangeWriter.AddAsync(
            db, currentUser, DocumentTypes.PurchaseRequest, request.Id,
            "submitted", $"Отправлена на согласование, запуск {launches + 1}", ct);
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

        var isInitiator = currentUser.UserId == request.CreatedByUserId;
        var isPlanner = currentUser.Role == MechanizationRole.MaintenancePlanner;
        if (!isInitiator && !isPlanner)
            throw new ForbiddenException("Аннулировать может инициатор или инженер по планированию ТОиР.");

        if (request.Status is WorkflowStatus.Cancelled or WorkflowStatus.Closed)
            throw new ConflictException("not_cancellable", "Заявку в этом статусе аннулировать нельзя.");

        request.Status = WorkflowStatus.Cancelled;
        request.CancelComment = cmd.Comment.Trim();
        request.UpdatedAt = DateTimeOffset.UtcNow;
        await DocumentChangeWriter.AddAsync(
            db, currentUser, DocumentTypes.PurchaseRequest, request.Id,
            "cancelled", $"Аннулирована. {request.CancelComment}", ct);
        await db.SaveChangesAsync(ct);

        return await PurchaseRequestMapper.ToDtoAsync(db, request.Id, currentUser, ct);
    }
}

public sealed record DeleteDraftPurchaseRequestCommand(Guid Id) : IRequest;

public sealed class DeleteDraftPurchaseRequestHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<DeleteDraftPurchaseRequestCommand>
{
    public async Task Handle(DeleteDraftPurchaseRequestCommand cmd, CancellationToken ct)
    {
        var request = await db.PurchaseRequests
            .Include(r => r.Lines)
            .Include(r => r.Attachments)
            .Include(r => r.ApprovalSteps)
            .FirstOrDefaultAsync(r => r.Id == cmd.Id, ct)
            ?? throw new NotFoundException("PurchaseRequest", cmd.Id);

        if (currentUser.UserId != request.CreatedByUserId)
            throw new ForbiddenException("Удалить черновик может только инициатор.");

        if (request.Status != WorkflowStatus.Draft)
            throw new ConflictException("not_draft", "Удалять можно только черновики.");

        var docAssignees = await db.DocumentApprovalAssignees
            .Where(x => x.PurchaseRequestId == request.Id)
            .ToListAsync(ct);
        var orders = await db.SupplierOrders
            .Where(o => o.PurchaseRequestId == request.Id)
            .ToListAsync(ct);

        db.DocumentApprovalAssignees.RemoveRange(docAssignees);
        db.SupplierOrders.RemoveRange(orders);
        db.ApprovalSteps.RemoveRange(request.ApprovalSteps);
        db.Attachments.RemoveRange(request.Attachments);
        db.PurchaseRequestLines.RemoveRange(request.Lines);
        db.PurchaseRequests.Remove(request);
        await db.SaveChangesAsync(ct);
    }
}

public sealed record AssignExecutorCommand(Guid Id, AssignExecutorRequest Request) : IRequest<PurchaseRequestDto>;

public sealed class AssignExecutorHandler(
    IInventoryDbContext db,
    ICurrentUser currentUser,
    INotificationService notifications)
    : IRequestHandler<AssignExecutorCommand, PurchaseRequestDto>
{
    public async Task<PurchaseRequestDto> Handle(AssignExecutorCommand cmd, CancellationToken ct)
    {
        if (!MechanizationRole.CanAssignExecutor(currentUser.Role))
            throw new ForbiddenException("Назначать исполнителя может коммерческий директор (или руководитель ОМТС).");

        var request = await db.PurchaseRequests
            .Include(r => r.CreatedBy)
            .FirstOrDefaultAsync(r => r.Id == cmd.Id, ct)
            ?? throw new NotFoundException("PurchaseRequest", cmd.Id);

        if (request.Status != WorkflowStatus.Approved)
            throw new ConflictException("not_approved", "Заявка должна быть утверждена.");

        var executor = await db.Users.FirstOrDefaultAsync(
            u => u.Id == cmd.Request.ExecutorUserId && u.IsActive, ct)
            ?? throw new NotFoundException("AppUser", cmd.Request.ExecutorUserId);

        if (!MechanizationRole.IsExecutorRole(executor.Role))
            throw new ValidationFailedException("Исполнителем может быть только пользователь с ролью «Исполнитель».");

        request.AssignedExecutorUserId = executor.Id;
        request.Status = WorkflowStatus.ExecutorAssigned;
        request.UpdatedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);

        var notify = new WorkflowNotification(
            DocumentTypes.PurchaseRequest,
            request.Id,
            request.Number,
            executor.Email,
            executor.FullName,
            request.CreatedBy?.Email ?? "",
            request.CreatedBy?.FullName ?? "—",
            null,
            $"/purchase-requests/{request.Id:D}");
        await notifications.SendAssignedForApprovalAsync(notify, ct);

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
            !MechanizationRole.CanAssignExecutor(currentUser.Role))
            throw new ForbiddenException("Закрыть заявку может исполнитель или коммерческий директор.");

        if (request.Status != WorkflowStatus.InProgress)
            throw new ConflictException("invalid_status", "Заявка должна быть в работе.");

        request.Status = WorkflowStatus.Closed;
        request.UpdatedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);

        return await PurchaseRequestMapper.ToDtoAsync(db, request.Id, currentUser, ct);
    }
}
