using MediatR;
using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Application.DefectActs;
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
        var canSubmit = canEdit && request.Lines.Count > 0;
        var canCancel = currentUser.UserId == request.CreatedByUserId
                        && request.Status is not WorkflowStatus.Closed
                            and not WorkflowStatus.Cancelled
                            and not WorkflowStatus.Rejected;

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
            request.StateNumber,
            request.VinCode,
            request.VehicleYear,
            request.Description,
            request.EstimatedAmount,
            request.HasServiceNoteAttachment,
            request.CreatedBy?.FullName ?? "—",
            request.AssignedExecutor?.FullName,
            request.CreatedAt,
            request.Lines.OrderBy(l => l.LineNo).Select(l => new PurchaseRequestLineDto(
                l.Id, l.LineNo, l.Name, l.CatalogNumber, l.Quantity, l.Unit,
                l.EstimatedUnitPrice, l.EstimatedAmount, l.Notes)).ToList(),
            canEdit,
            canSubmit,
            canCancel);
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

public sealed class ListPurchaseRequestsHandler(IInventoryDbContext db)
    : IRequestHandler<ListPurchaseRequestsQuery, IReadOnlyList<PurchaseRequestListItemDto>>
{
    public async Task<IReadOnlyList<PurchaseRequestListItemDto>> Handle(
        ListPurchaseRequestsQuery q, CancellationToken ct)
    {
        var query = db.PurchaseRequests.AsNoTracking();
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
                r.EstimatedAmount,
                r.CreatedAt
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
            r.EstimatedAmount,
            r.CreatedAt)).ToList();
    }
}

public sealed record GetPurchaseRequestApprovalsQuery(Guid Id) : IRequest<IReadOnlyList<ApprovalStepDto>>;

public sealed class GetPurchaseRequestApprovalsHandler(IInventoryDbContext db)
    : IRequestHandler<GetPurchaseRequestApprovalsQuery, IReadOnlyList<ApprovalStepDto>>
{
    public async Task<IReadOnlyList<ApprovalStepDto>> Handle(
        GetPurchaseRequestApprovalsQuery q, CancellationToken ct)
    {
        return await db.ApprovalSteps.AsNoTracking()
            .Include(s => s.Approver)
            .Where(s => s.PurchaseRequestId == q.Id)
            .OrderBy(s => s.OrderNo)
            .Select(s => new ApprovalStepDto(
                s.Id, s.OrderNo, s.ApproverRole, MechanizationRole.Label(s.ApproverRole),
                s.Approver!.FullName, s.Status, ApprovalStepStatus.Label(s.Status), s.Action, s.Comment,
                s.RequiresDigitalSignature, s.AssignedAt, s.DecidedAt, s.DecidedAt ?? s.AssignedAt))
            .ToListAsync(ct);
    }
}
