using MediatR;
using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Exceptions;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Domain.Entities;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.Procurement;

public sealed record SupplierOrderDto(
    Guid Id,
    string Number,
    string Status,
    Guid PurchaseRequestId,
    string PurchaseRequestNumber,
    string? ExternalSystemRef,
    DateTimeOffset CreatedAt,
    DateTimeOffset? SubmittedAt);

public sealed record GetSupplierOrderByPurchaseQuery(Guid PurchaseRequestId) : IRequest<SupplierOrderDto?>;

public sealed class GetSupplierOrderByPurchaseHandler(IInventoryDbContext db)
    : IRequestHandler<GetSupplierOrderByPurchaseQuery, SupplierOrderDto?>
{
    public async Task<SupplierOrderDto?> Handle(GetSupplierOrderByPurchaseQuery q, CancellationToken ct)
    {
        var order = await db.SupplierOrders.AsNoTracking()
            .Include(o => o.PurchaseRequest)
            .FirstOrDefaultAsync(o => o.PurchaseRequestId == q.PurchaseRequestId, ct);

        return order is null ? null : ToDto(order);
    }

    internal static SupplierOrderDto ToDto(SupplierOrder o) => new(
        o.Id, o.Number, o.Status, o.PurchaseRequestId,
        o.PurchaseRequest?.Number ?? "—", o.ExternalSystemRef, o.CreatedAt, o.SubmittedAt);
}

public sealed record CreateSupplierOrderCommand(Guid PurchaseRequestId) : IRequest<SupplierOrderDto>;

public sealed class CreateSupplierOrderHandler(
    IInventoryDbContext db,
    ICurrentUser currentUser,
    IProcurementBridge procurement) : IRequestHandler<CreateSupplierOrderCommand, SupplierOrderDto>
{
    public async Task<SupplierOrderDto> Handle(CreateSupplierOrderCommand cmd, CancellationToken ct)
    {
        var userId = currentUser.UserId ?? throw new UnauthorizedException();
        if (currentUser.Role != MechanizationRole.OmtsSpecialist)
            throw new ForbiddenException("Заказ поставщику формирует специалист ОМТС.");

        var request = await db.PurchaseRequests
            .Include(r => r.Lines)
            .FirstOrDefaultAsync(r => r.Id == cmd.PurchaseRequestId, ct)
            ?? throw new NotFoundException("PurchaseRequest", cmd.PurchaseRequestId);

        if (currentUser.UserId != request.AssignedExecutorUserId)
            throw new ForbiddenException("Заказ может создать только назначенный исполнитель.");

        if (request.Status != WorkflowStatus.InProgress)
            throw new ConflictException("invalid_status", "Заявка должна быть в работе ОМТС.");

        var existing = await db.SupplierOrders.FirstOrDefaultAsync(o => o.PurchaseRequestId == request.Id, ct);
        if (existing is not null)
            return GetSupplierOrderByPurchaseHandler.ToDto(existing);

        var year = DateTime.UtcNow.Year;
        var count = await db.SupplierOrders.CountAsync(o => o.CreatedAt.Year == year, ct);
        var number = $"SO-{year}-{(count + 1):D5}";

        var externalRef = await procurement.SubmitOrderAsync(request, number, ct);

        var order = new SupplierOrder
        {
            PurchaseRequestId = request.Id,
            Number = number,
            Status = "submitted",
            CreatedByUserId = userId,
            ExternalSystemRef = externalRef,
            SubmittedAt = DateTimeOffset.UtcNow,
            Notes = $"Создан из заявки {request.Number}"
        };

        db.SupplierOrders.Add(order);
        await db.SaveChangesAsync(ct);

        order.PurchaseRequest = request;
        return GetSupplierOrderByPurchaseHandler.ToDto(order);
    }
}
