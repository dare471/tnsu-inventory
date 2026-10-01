using MediatR;
using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common;
using Tnsu.Inventory.Application.Common.Exceptions;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Application.DefectActs;
using Tnsu.Inventory.Application.Workflow;
using Tnsu.Inventory.Domain;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.PurchaseRequests;

internal static class PurchaseRequestMapper
{
    public static async Task<PurchaseRequestDto> ToDtoAsync(
        IInventoryDbContext db, Guid id, ICurrentUser currentUser, CancellationToken ct)
    {
        var request = await db.PurchaseRequests
            .Include(r => r.Lines)
            .Include(r => r.CreatedBy)
            .Include(r => r.AssignedExecutor)
            .Include(r => r.DefectAct)
            .FirstAsync(r => r.Id == id, ct);

        var canEdit = request.Status is WorkflowStatus.Draft or WorkflowStatus.Returned
                      && currentUser.UserId == request.CreatedByUserId;
        var canSubmit = canEdit && request.Lines.Any(l => !l.IsRemoved);
        var canCancel = (currentUser.UserId == request.CreatedByUserId
                         || currentUser.Role == MechanizationRole.MaintenancePlanner)
                        && request.Status is not WorkflowStatus.Closed
                            and not WorkflowStatus.Cancelled;
        var canDelete = request.Status == WorkflowStatus.Draft
                        && currentUser.UserId == request.CreatedByUserId;
        var canAssignExecutor = request.Status == WorkflowStatus.Approved
                                && MechanizationRole.CanAssignExecutor(currentUser.Role);
        var canStartExecution = request.Status == WorkflowStatus.ExecutorAssigned
                                && currentUser.UserId == request.AssignedExecutorUserId;
        var canClose = request.Status == WorkflowStatus.InProgress
                       && (currentUser.UserId == request.AssignedExecutorUserId
                           || MechanizationRole.CanAssignExecutor(currentUser.Role));

        return new PurchaseRequestDto(
            request.Id,
            request.Number,
            request.Status,
            WorkflowStatus.Label(request.Status),
            request.DefectActId,
            request.DefectAct?.Number,
            request.ProjectId,
            request.ProjectCode,
            request.ProjectName,
            request.VehicleId,
            request.VehicleName,
            request.VehicleGroupName,
            request.StateNumber,
            request.VinCode,
            request.VehicleYear,
            request.RepairType,
            RepairType.Label(request.RepairType),
            request.RepairCategory,
            RepairCategory.Label(request.RepairCategory),
            request.Odometer,
            request.EngineHours,
            request.Description,
            request.EstimatedAmount,
            request.HasServiceNoteAttachment,
            request.CreatedBy?.FullName ?? "—",
            request.AssignedExecutor?.FullName,
            request.CreatedAt,
            request.DeliveryDate,
            request.Lines.OrderBy(l => l.LineNo).Select(l => new PurchaseRequestLineDto(
                l.Id, l.LineNo, l.Code, l.Name, l.CatalogNumber, l.Quantity, l.Unit,
                l.EstimatedUnitPrice, l.EstimatedAmount, l.Notes,
                l.SourceDefectActPartId, l.MaxQuantity ?? l.Quantity, l.IsRemoved)).ToList(),
            canEdit,
            canSubmit,
            canCancel,
            canDelete,
            canAssignExecutor,
            canStartExecution,
            canClose,
            request.DefectActId is not null);
    }
}

public sealed record GetPurchaseRequestQuery(Guid Id) : IRequest<PurchaseRequestDto>;

public sealed class GetPurchaseRequestHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<GetPurchaseRequestQuery, PurchaseRequestDto>
{
    public Task<PurchaseRequestDto> Handle(GetPurchaseRequestQuery q, CancellationToken ct) =>
        PurchaseRequestMapper.ToDtoAsync(db, q.Id, currentUser, ct);
}

public sealed record ListPurchaseRequestsQuery(string? Search) : IRequest<IReadOnlyList<PurchaseRequestListItemDto>>;

public sealed class ListPurchaseRequestsHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<ListPurchaseRequestsQuery, IReadOnlyList<PurchaseRequestListItemDto>>
{
    public async Task<IReadOnlyList<PurchaseRequestListItemDto>> Handle(
        ListPurchaseRequestsQuery q, CancellationToken ct)
    {
        var query = db.PurchaseRequests.AsNoTracking();

        if (!DocumentListScope.IsGlobalAdmin(currentUser))
        {
            var userId = currentUser.UserId ?? throw new UnauthorizedException();
            var participantIds = await db.ApprovalSteps.AsNoTracking()
                .Where(s => s.PurchaseRequestId.HasValue && s.ApproverUserId == userId)
                .Select(s => s.PurchaseRequestId!.Value)
                .Distinct()
                .ToListAsync(ct);

            query = query.Where(r =>
                r.CreatedByUserId == userId
                || r.AssignedExecutorUserId == userId
                || participantIds.Contains(r.Id));
        }

        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var s = q.Search.Trim();
            query = query.Where(r =>
                r.Number.Contains(s) || r.VehicleName.Contains(s) || r.ProjectName.Contains(s));
        }

        var list = await query.OrderByDescending(r => r.CreatedAt).Take(200)
            .Select(r => new
            {
                r.Id,
                r.Number,
                r.Status,
                r.ProjectName,
                r.VehicleName,
                InitiatorFullName = r.CreatedBy!.FullName,
                AssignedExecutorFullName = r.AssignedExecutor != null ? r.AssignedExecutor.FullName : null,
                r.EstimatedAmount,
                r.DeliveryDate,
                r.CreatedAt,
                r.CreatedByUserId
            })
            .ToListAsync(ct);

        var ids = list.Select(x => x.Id).ToList();
        var pendingSteps = await db.ApprovalSteps.AsNoTracking()
            .Include(s => s.Approver)
            .Where(s => s.PurchaseRequestId.HasValue
                        && ids.Contains(s.PurchaseRequestId.Value)
                        && s.Status == ApprovalStepStatus.Pending)
            .OrderBy(s => s.OrderNo)
            .ToListAsync(ct);
        var pendingByRequest = pendingSteps
            .GroupBy(s => s.PurchaseRequestId!.Value)
            .ToDictionary(g => g.Key, g => g.First().Approver?.FullName);

        return list.Select(r => new PurchaseRequestListItemDto(
            r.Id,
            r.Number,
            r.Status,
            WorkflowStatus.Label(r.Status),
            r.ProjectName,
            r.VehicleName,
            r.InitiatorFullName,
            pendingByRequest.GetValueOrDefault(r.Id),
            r.AssignedExecutorFullName,
            r.EstimatedAmount,
            r.DeliveryDate,
            r.CreatedAt,
            r.Status == WorkflowStatus.Draft && currentUser.UserId == r.CreatedByUserId)).ToList();
    }
}

public sealed record GetPurchaseRequestApprovalsQuery(Guid Id) : IRequest<IReadOnlyList<ApprovalStepDto>>;

public sealed class GetPurchaseRequestApprovalsHandler(IInventoryDbContext db)
    : IRequestHandler<GetPurchaseRequestApprovalsQuery, IReadOnlyList<ApprovalStepDto>>
{
    public async Task<IReadOnlyList<ApprovalStepDto>> Handle(
        GetPurchaseRequestApprovalsQuery q, CancellationToken ct)
    {
        var steps = await db.ApprovalSteps.AsNoTracking()
            .Include(s => s.Approver)
            .Where(s => s.PurchaseRequestId == q.Id)
            .ToListAsync(ct);
        return ApprovalRoundMapper.ToDtos(steps);
    }
}

public sealed record GetPurchaseRequestChangesQuery(Guid Id) : IRequest<IReadOnlyList<DocumentChangeDto>>;

public sealed class GetPurchaseRequestChangesHandler(IInventoryDbContext db)
    : IRequestHandler<GetPurchaseRequestChangesQuery, IReadOnlyList<DocumentChangeDto>>
{
    public async Task<IReadOnlyList<DocumentChangeDto>> Handle(GetPurchaseRequestChangesQuery q, CancellationToken ct)
    {
        var exists = await db.PurchaseRequests.AsNoTracking().AnyAsync(r => r.Id == q.Id, ct);
        if (!exists)
            throw new NotFoundException("PurchaseRequest", q.Id);

        return await db.DocumentChanges.AsNoTracking()
            .Where(c => c.DocumentType == DocumentTypes.PurchaseRequest && c.DocumentId == q.Id)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new DocumentChangeDto(c.Id, c.Action, c.Summary, c.UserFullName, c.CreatedAt))
            .ToListAsync(ct);
    }
}
