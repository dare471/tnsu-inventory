using MediatR;
using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Exceptions;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Application.DefectActs;
using Tnsu.Inventory.Domain.Entities;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.DefectActs.Commands;

public sealed record CreateDefectActCommand(CreateDefectActRequest Request) : IRequest<DefectActDto>;

public sealed class CreateDefectActHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<CreateDefectActCommand, DefectActDto>
{
    public async Task<DefectActDto> Handle(CreateDefectActCommand cmd, CancellationToken ct)
    {
        var userId = currentUser.UserId ?? throw new UnauthorizedException();
        if (currentUser.Role != MechanizationRole.SiteMechanic)
            throw new ForbiddenException("Создавать дефектный акт может только механик участка.");

        var req = cmd.Request;
        var number = await NextNumberAsync(db, "DA", ct);

        var act = new DefectAct
        {
            Number = number,
            CreatedByUserId = userId,
            ProjectId = req.ProjectId,
            ProjectCode = req.ProjectCode.Trim(),
            ProjectName = req.ProjectName.Trim(),
            VehicleId = req.VehicleId,
            VehicleName = req.VehicleName.Trim(),
            VehicleGroupName = req.VehicleGroupName.Trim(),
            StateNumber = req.StateNumber.Trim(),
            VinCode = req.VinCode.Trim(),
            VehicleYear = req.VehicleYear,
            MalfunctionDescription = req.MalfunctionDescription.Trim()
        };

        act.Parts = req.Parts.Select(p => new DefectActPart
        {
            DefectActId = act.Id,
            LineNo = p.LineNo,
            Name = p.Name.Trim(),
            CatalogNumber = p.CatalogNumber?.Trim(),
            Quantity = p.Quantity,
            Unit = p.Unit?.Trim(),
            Notes = p.Notes?.Trim()
        }).ToList();

        db.DefectActs.Add(act);
        await db.SaveChangesAsync(ct);

        return await DefectActMapper.ToDtoAsync(db, act.Id, currentUser, ct);
    }

    internal static async Task<string> NextNumberAsync(IInventoryDbContext db, string prefix, CancellationToken ct)
    {
        var year = DateTime.UtcNow.Year;
        var count = await db.DefectActs.CountAsync(a => a.CreatedAt.Year == year, ct);
        return $"{prefix}-{year}-{(count + 1):D5}";
    }
}

public sealed record UpdateDefectActCommand(Guid Id, UpdateDefectActRequest Request) : IRequest<DefectActDto>;

public sealed class UpdateDefectActHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<UpdateDefectActCommand, DefectActDto>
{
    public async Task<DefectActDto> Handle(UpdateDefectActCommand cmd, CancellationToken ct)
    {
        var act = await db.DefectActs
            .Include(a => a.Parts)
            .FirstOrDefaultAsync(a => a.Id == cmd.Id, ct)
            ?? throw new NotFoundException("DefectAct", cmd.Id);

        EnsureEditable(act, currentUser);

        act.MalfunctionDescription = cmd.Request.MalfunctionDescription.Trim();
        act.UpdatedAt = DateTimeOffset.UtcNow;

        db.DefectActParts.RemoveRange(act.Parts);
        act.Parts = cmd.Request.Parts.Select(p => new DefectActPart
        {
            DefectActId = act.Id,
            LineNo = p.LineNo,
            Name = p.Name.Trim(),
            CatalogNumber = p.CatalogNumber?.Trim(),
            Quantity = p.Quantity,
            Unit = p.Unit?.Trim(),
            Notes = p.Notes?.Trim()
        }).ToList();

        await db.SaveChangesAsync(ct);
        return await DefectActMapper.ToDtoAsync(db, act.Id, currentUser, ct);
    }

    internal static void EnsureEditable(DefectAct act, ICurrentUser currentUser)
    {
        if (act.Status is not WorkflowStatus.Draft and not WorkflowStatus.Returned)
            throw new ConflictException("not_editable", "Редактирование доступно только в черновике или после возврата.");

        if (currentUser.UserId != act.CreatedByUserId)
            throw new ForbiddenException("Редактировать может только автор документа.");
    }
}

public sealed record SubmitDefectActCommand(Guid Id) : IRequest<DefectActDto>;

public sealed class SubmitDefectActHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<SubmitDefectActCommand, DefectActDto>
{
    public async Task<DefectActDto> Handle(SubmitDefectActCommand cmd, CancellationToken ct)
    {
        var act = await db.DefectActs.FirstOrDefaultAsync(a => a.Id == cmd.Id, ct)
            ?? throw new NotFoundException("DefectAct", cmd.Id);

        UpdateDefectActHandler.EnsureEditable(act, currentUser);

        if (string.IsNullOrWhiteSpace(act.MalfunctionDescription))
            throw new ValidationFailedException("Укажите описание неисправности.");

        var hasPending = await db.ApprovalSteps.AnyAsync(
            s => s.DefectActId == act.Id && s.Status == ApprovalStepStatus.Pending, ct);
        if (hasPending)
            throw new ConflictException("approval_in_progress", "Документ уже на согласовании.");

        var startFrom = act.Status == WorkflowStatus.Returned && act.ResumeFromReturnStep
            ? act.ResubmitFromStepOrder
            : 1;

        var roundId = Guid.NewGuid();
        var steps = await Workflow.ApprovalWorkflowBuilder.BuildDefectActStepsAsync(
            db, act, roundId, startFrom, ct);

        if (steps.Count == 0)
            throw new ValidationFailedException("Нет шагов согласования для запуска маршрута.");

        act.Status = WorkflowStatus.OnCoordination;
        act.UpdatedAt = DateTimeOffset.UtcNow;
        db.ApprovalSteps.AddRange(steps);
        await db.SaveChangesAsync(ct);

        return await DefectActMapper.ToDtoAsync(db, act.Id, currentUser, ct);
    }
}

public sealed record CancelDefectActCommand(Guid Id, string Comment) : IRequest<DefectActDto>;

public sealed class CancelDefectActHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<CancelDefectActCommand, DefectActDto>
{
    public async Task<DefectActDto> Handle(CancelDefectActCommand cmd, CancellationToken ct)
    {
        var act = await db.DefectActs.FirstOrDefaultAsync(a => a.Id == cmd.Id, ct)
            ?? throw new NotFoundException("DefectAct", cmd.Id);

        if (currentUser.UserId != act.CreatedByUserId)
            throw new ForbiddenException("Отменить может только автор.");

        if (act.Status == WorkflowStatus.Cancelled)
            throw new ConflictException("already_cancelled", "Документ уже отменён.");

        act.Status = WorkflowStatus.Cancelled;
        act.CancelComment = cmd.Comment.Trim();
        act.UpdatedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);

        return await DefectActMapper.ToDtoAsync(db, act.Id, currentUser, ct);
    }
}
