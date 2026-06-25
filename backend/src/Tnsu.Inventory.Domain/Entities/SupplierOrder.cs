namespace Tnsu.Inventory.Domain.Entities;

public class SupplierOrder
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PurchaseRequestId { get; set; }
    public string Number { get; set; } = string.Empty;
    public string Status { get; set; } = "draft";
    public Guid CreatedByUserId { get; set; }
    public string? ExternalSystemRef { get; set; }
    public string? Notes { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? SubmittedAt { get; set; }

    public PurchaseRequest? PurchaseRequest { get; set; }
    public AppUser? CreatedBy { get; set; }
}
