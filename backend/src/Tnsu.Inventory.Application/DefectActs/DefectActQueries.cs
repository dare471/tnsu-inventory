using MediatR;
using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Exceptions;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Application.DefectActs;
using Tnsu.Inventory.Application.PurchaseRequests;
using Tnsu.Inventory.Domain.Entities;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.DefectActs;

internal static class DefectActMapper
{
    public static async Task<DefectActDto> ToDtoAsync(
        IInventoryDbContext db, Guid id, ICurrentUser currentUser, CancellationToken ct)
    {
        var act = await db.DefectActs
            .Include(a => a.Parts)
            .Include(a => a.CreatedBy)
            .FirstAsync(a => a.Id == id, ct);

        var canEdit = act.Status is WorkflowStatus.Draft or WorkflowStatus.Returned
                      && currentUser.UserId == act.CreatedByUserId;
        var canSubmit = canEdit && !string.IsNullOrWhiteSpace(act.MalfunctionDescription);
        var canCreatePurchase = act.Status is WorkflowStatus.Approved or WorkflowStatus.Signed;

        return new DefectActDto(
            act.Id,
            act.Number,
            act.Status,
            WorkflowStatus.Label(act.Status),
            act.ProjectId,
            act.ProjectCode,
            act.ProjectName,
            act.VehicleId,
            act.VehicleName,
            act.VehicleGroupName,
            act.StateNumber,
            act.VinCode,
            act.VehicleYear,
            act.MalfunctionDescription,
            act.CreatedBy?.FullName ?? "—",
            act.CreatedAt,
            act.SignedAt,
            act.Parts.OrderBy(p => p.LineNo).Select(p => new DefectActPartDto(
                p.Id, p.LineNo, p.Name, p.CatalogNumber, p.Quantity, p.Unit, p.Notes)).ToList(),
            canEdit,
            canSubmit,
            canCreatePurchase);
    }
}

public sealed record GetDefectActQuery(Guid Id) : IRequest<DefectActDto>;

public sealed class GetDefectActHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<GetDefectActQuery, DefectActDto>
{
    public Task<DefectActDto> Handle(GetDefectActQuery q, CancellationToken ct) =>
        DefectActMapper.ToDtoAsync(db, q.Id, currentUser, ct);
}

public sealed record ListDefectActsQuery(string? Search) : IRequest<IReadOnlyList<DefectActListItemDto>>;

public sealed class ListDefectActsHandler(IInventoryDbContext db)
    : IRequestHandler<ListDefectActsQuery, IReadOnlyList<DefectActListItemDto>>
{
    public async Task<IReadOnlyList<DefectActListItemDto>> Handle(ListDefectActsQuery q, CancellationToken ct)
    {
        var query = db.DefectActs.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var s = q.Search.Trim();
            query = query.Where(a =>
                a.Number.Contains(s) || a.VehicleName.Contains(s) || a.ProjectName.Contains(s));
        }

        return await query.OrderByDescending(a => a.CreatedAt).Take(200)
            .Select(a => new DefectActListItemDto(
            a.Id, a.Number, a.Status, WorkflowStatus.Label(a.Status),
            a.ProjectName, a.VehicleName, a.CreatedBy!.FullName, a.StateNumber, a.CreatedAt)).ToListAsync(ct);
    }
}

public sealed record GetDefectActApprovalsQuery(Guid Id) : IRequest<IReadOnlyList<ApprovalStepDto>>;

public sealed class GetDefectActApprovalsHandler(IInventoryDbContext db)
    : IRequestHandler<GetDefectActApprovalsQuery, IReadOnlyList<ApprovalStepDto>>
{
    public async Task<IReadOnlyList<ApprovalStepDto>> Handle(GetDefectActApprovalsQuery q, CancellationToken ct)
    {
        return await db.ApprovalSteps.AsNoTracking()
            .Include(s => s.Approver)
            .Where(s => s.DefectActId == q.Id)
            .OrderBy(s => s.OrderNo)
            .Select(s => new ApprovalStepDto(
                s.Id, s.OrderNo, s.ApproverRole, MechanizationRole.Label(s.ApproverRole),
                s.Approver!.FullName, s.Status, ApprovalStepStatus.Label(s.Status), s.Action, s.Comment,
                s.RequiresDigitalSignature, s.AssignedAt, s.DecidedAt, s.DecidedAt ?? s.AssignedAt))
            .ToListAsync(ct);
    }
}

public sealed record CreatePurchaseFromDefectActCommand(Guid DefectActId) : IRequest<PurchaseRequestDto>;

public sealed class CreatePurchaseFromDefectActHandler(IInventoryDbContext db, ICurrentUser currentUser, IMediator mediator)
    : IRequestHandler<CreatePurchaseFromDefectActCommand, PurchaseRequestDto>
{
    public async Task<PurchaseRequestDto> Handle(CreatePurchaseFromDefectActCommand cmd, CancellationToken ct)
    {
        var act = await db.DefectActs
            .Include(a => a.Parts)
            .FirstOrDefaultAsync(a => a.Id == cmd.DefectActId, ct)
            ?? throw new NotFoundException("DefectAct", cmd.DefectActId);

        if (act.Status is not WorkflowStatus.Approved and not WorkflowStatus.Signed)
            throw new ConflictException("not_approved", "Сначала завершите согласование дефектного акта.");

        var lines = act.Parts.OrderBy(p => p.LineNo).Select(p =>
            new PurchaseRequestLineInput(p.LineNo, p.Name, p.CatalogNumber, p.Quantity, p.Unit, null, p.Notes)).ToList();

        return await mediator.Send(new PurchaseRequests.Commands.CreatePurchaseRequestCommand(
            new CreatePurchaseRequestRequest(
                act.Id,
                act.ProjectId,
                act.ProjectCode,
                act.ProjectName,
                act.VehicleId,
                act.VehicleName,
                act.StateNumber,
                act.VinCode,
                act.VehicleYear,
                act.MalfunctionDescription,
                lines)), ct);
    }
}
