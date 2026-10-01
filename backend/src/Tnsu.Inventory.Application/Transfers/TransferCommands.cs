using MediatR;
using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Exceptions;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Domain.Entities;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.Transfers;

public sealed record MaterialTransferLineInput(
    int LineNo,
    string Code,
    string Name,
    string? CatalogNumber,
    decimal Quantity,
    string Unit,
    decimal? AvailableQuantity,
    string? NomenclatureId = null,
    Guid? SourceDefectActPartId = null);

public sealed record MaterialTransferLineDto(
    Guid Id,
    int LineNo,
    string Code,
    string Name,
    string? CatalogNumber,
    decimal Quantity,
    string Unit,
    decimal? AvailableQuantity,
    string? NomenclatureId,
    Guid? SourceDefectActPartId);

public sealed record MaterialTransferDto(
    Guid Id,
    string Number,
    string Status,
    string StatusLabel,
    string SourceWarehouse,
    string Destination,
    string? Comment,
    Guid? DefectActId,
    string? DefectActNumber,
    Guid? PurchaseRequestId,
    string CreatedByFullName,
    DateTimeOffset CreatedAt,
    IReadOnlyList<MaterialTransferLineDto> Lines,
    bool CanEdit);

public sealed record CreateMaterialTransferRequest(
    string SourceWarehouse,
    string Destination,
    string? Comment,
    IReadOnlyList<MaterialTransferLineInput> Lines,
    Guid? DefectActId = null,
    Guid? PurchaseRequestId = null);

public sealed record UpdateMaterialTransferRequest(
    string SourceWarehouse,
    string Destination,
    string? Comment,
    IReadOnlyList<MaterialTransferLineInput> Lines);

public sealed record ListStockBalancesQuery(string? Search) : IRequest<IReadOnlyList<StockBalanceDto>>;

public sealed class ListStockBalancesHandler(IDictionary1CClient dictionaries, ICurrentUser currentUser)
    : IRequestHandler<ListStockBalancesQuery, IReadOnlyList<StockBalanceDto>>
{
    public Task<IReadOnlyList<StockBalanceDto>> Handle(ListStockBalancesQuery q, CancellationToken ct)
    {
        if (!MechanizationRole.CanSearchStock(currentUser.Role))
            throw new ForbiddenException("Искать складские остатки могут координатор склада и инженер по планированию ТОиР.");
        return dictionaries.GetStockBalancesAsync(q.Search, ct);
    }
}

public sealed record ListMaterialTransfersQuery : IRequest<IReadOnlyList<MaterialTransferDto>>;

public sealed class ListMaterialTransfersHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<ListMaterialTransfersQuery, IReadOnlyList<MaterialTransferDto>>
{
    public async Task<IReadOnlyList<MaterialTransferDto>> Handle(ListMaterialTransfersQuery q, CancellationToken ct)
    {
        EnsureAccess(currentUser);
        var items = await db.MaterialTransfers.AsNoTracking()
            .Include(x => x.Lines)
            .Include(x => x.CreatedBy)
            .OrderByDescending(x => x.CreatedAt)
            .Take(200)
            .ToListAsync(ct);
        return items.Select(x => ToDto(x, currentUser)).ToList();
    }

    internal static void EnsureAccess(ICurrentUser currentUser)
    {
        if (!MechanizationRole.CanSearchStock(currentUser.Role))
            throw new ForbiddenException("Заявки на перемещение доступны координатору склада и инженеру по планированию ТОиР.");
    }

    internal static MaterialTransferDto ToDto(MaterialTransferRequest request, ICurrentUser currentUser) =>
        new(
            request.Id,
            request.Number,
            request.Status,
            TransferStatus.Label(request.Status),
            request.SourceWarehouse,
            request.Destination,
            request.Comment,
            request.DefectActId,
            request.DefectActNumber,
            request.PurchaseRequestId,
            request.CreatedBy?.FullName ?? "—",
            request.CreatedAt,
            request.Lines.OrderBy(l => l.LineNo).Select(l => new MaterialTransferLineDto(
                l.Id, l.LineNo, l.Code, l.Name, l.CatalogNumber, l.Quantity, l.Unit, l.AvailableQuantity,
                l.NomenclatureId, l.SourceDefectActPartId)).ToList(),
            request.Status == TransferStatus.Draft && currentUser.UserId == request.CreatedByUserId);
}

public sealed record GetMaterialTransferQuery(Guid Id) : IRequest<MaterialTransferDto>;

public sealed class GetMaterialTransferHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<GetMaterialTransferQuery, MaterialTransferDto>
{
    public async Task<MaterialTransferDto> Handle(GetMaterialTransferQuery q, CancellationToken ct)
    {
        ListMaterialTransfersHandler.EnsureAccess(currentUser);
        var request = await db.MaterialTransfers
            .Include(x => x.Lines)
            .Include(x => x.CreatedBy)
            .FirstOrDefaultAsync(x => x.Id == q.Id, ct)
            ?? throw new NotFoundException("MaterialTransfer", q.Id);
        return ListMaterialTransfersHandler.ToDto(request, currentUser);
    }
}

public sealed record CreateMaterialTransferCommand(CreateMaterialTransferRequest Request) : IRequest<MaterialTransferDto>;

public sealed class CreateMaterialTransferHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<CreateMaterialTransferCommand, MaterialTransferDto>
{
    public async Task<MaterialTransferDto> Handle(CreateMaterialTransferCommand cmd, CancellationToken ct)
    {
        ListMaterialTransfersHandler.EnsureAccess(currentUser);
        var userId = currentUser.UserId ?? throw new UnauthorizedException();
        var req = cmd.Request;
        if (req.Lines.Count == 0)
            throw new ValidationFailedException("Добавьте хотя бы одну позицию.");

        string? defectActNumber = null;
        if (req.DefectActId is Guid defectActId)
        {
            defectActNumber = await db.DefectActs.AsNoTracking()
                .Where(a => a.Id == defectActId)
                .Select(a => a.Number)
                .FirstOrDefaultAsync(ct)
                ?? throw new NotFoundException("DefectAct", defectActId);
        }

        if (req.PurchaseRequestId is Guid purchaseRequestId
            && !await db.PurchaseRequests.AsNoTracking().AnyAsync(p => p.Id == purchaseRequestId, ct))
            throw new NotFoundException("PurchaseRequest", purchaseRequestId);

        var year = DateTime.UtcNow.Year;
        var count = await db.MaterialTransfers.CountAsync(x => x.CreatedAt.Year == year, ct);
        var request = new MaterialTransferRequest
        {
            Number = $"MV-{year}-{(count + 1):D5}",
            CreatedByUserId = userId,
            SourceWarehouse = req.SourceWarehouse.Trim(),
            Destination = req.Destination.Trim(),
            Comment = string.IsNullOrWhiteSpace(req.Comment) ? null : req.Comment.Trim(),
            DefectActId = req.DefectActId,
            DefectActNumber = defectActNumber,
            PurchaseRequestId = req.PurchaseRequestId
        };
        request.Lines = req.Lines.Select(MapLine).ToList();
        foreach (var line in request.Lines)
            line.TransferRequestId = request.Id;

        db.MaterialTransfers.Add(request);
        await db.SaveChangesAsync(ct);
        return await new GetMaterialTransferHandler(db, currentUser).Handle(new GetMaterialTransferQuery(request.Id), ct);
    }

    internal static MaterialTransferLine MapLine(MaterialTransferLineInput line) => new()
    {
        LineNo = line.LineNo,
        Code = line.Code.Trim(),
        Name = line.Name.Trim(),
        CatalogNumber = string.IsNullOrWhiteSpace(line.CatalogNumber) ? null : line.CatalogNumber.Trim(),
        Quantity = line.Quantity,
        Unit = MeasurementUnits.Normalize(string.IsNullOrWhiteSpace(line.Unit) ? "шт." : line.Unit),
        AvailableQuantity = line.AvailableQuantity,
        NomenclatureId = string.IsNullOrWhiteSpace(line.NomenclatureId) ? null : line.NomenclatureId.Trim(),
        SourceDefectActPartId = line.SourceDefectActPartId
    };
}

public sealed record UpdateMaterialTransferCommand(Guid Id, UpdateMaterialTransferRequest Request) : IRequest<MaterialTransferDto>;

public sealed class UpdateMaterialTransferHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<UpdateMaterialTransferCommand, MaterialTransferDto>
{
    public async Task<MaterialTransferDto> Handle(UpdateMaterialTransferCommand cmd, CancellationToken ct)
    {
        ListMaterialTransfersHandler.EnsureAccess(currentUser);
        var request = await db.MaterialTransfers
            .Include(x => x.Lines)
            .FirstOrDefaultAsync(x => x.Id == cmd.Id, ct)
            ?? throw new NotFoundException("MaterialTransfer", cmd.Id);

        if (request.Status != TransferStatus.Draft || currentUser.UserId != request.CreatedByUserId)
            throw new ForbiddenException("Редактировать можно только свой черновик.");

        request.SourceWarehouse = cmd.Request.SourceWarehouse.Trim();
        request.Destination = cmd.Request.Destination.Trim();
        request.Comment = cmd.Request.Comment?.Trim();
        request.UpdatedAt = DateTimeOffset.UtcNow;
        foreach (var line in request.Lines.ToList())
            db.MaterialTransferLines.Remove(line);
        request.Lines.Clear();
        foreach (var line in cmd.Request.Lines.Select(CreateMaterialTransferHandler.MapLine))
        {
            line.TransferRequestId = request.Id;
            request.Lines.Add(line);
        }

        await db.SaveChangesAsync(ct);
        return await new GetMaterialTransferHandler(db, currentUser).Handle(new GetMaterialTransferQuery(request.Id), ct);
    }
}

public sealed record SubmitMaterialTransferCommand(Guid Id) : IRequest<MaterialTransferDto>;

public sealed class SubmitMaterialTransferHandler(IInventoryDbContext db, ICurrentUser currentUser)
    : IRequestHandler<SubmitMaterialTransferCommand, MaterialTransferDto>
{
    public async Task<MaterialTransferDto> Handle(SubmitMaterialTransferCommand cmd, CancellationToken ct)
    {
        ListMaterialTransfersHandler.EnsureAccess(currentUser);
        var request = await db.MaterialTransfers
            .Include(x => x.Lines)
            .FirstOrDefaultAsync(x => x.Id == cmd.Id, ct)
            ?? throw new NotFoundException("MaterialTransfer", cmd.Id);

        if (request.Status != TransferStatus.Draft || currentUser.UserId != request.CreatedByUserId)
            throw new ForbiddenException("Отправить можно только свой черновик.");
        if (request.Lines.Count == 0)
            throw new ValidationFailedException("Добавьте хотя бы одну позицию.");
        if (string.IsNullOrWhiteSpace(request.SourceWarehouse) || string.IsNullOrWhiteSpace(request.Destination))
            throw new ValidationFailedException("Укажите склад-отправитель и получателя.");

        request.Status = TransferStatus.Submitted;
        request.UpdatedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);
        return await new GetMaterialTransferHandler(db, currentUser).Handle(new GetMaterialTransferQuery(request.Id), ct);
    }
}
