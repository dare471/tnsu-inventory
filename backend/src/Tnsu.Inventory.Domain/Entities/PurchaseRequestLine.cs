namespace Tnsu.Inventory.Domain.Entities;

public class PurchaseRequestLine
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PurchaseRequestId { get; set; }
    public int LineNo { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? CatalogNumber { get; set; }
    public decimal Quantity { get; set; }
    public string? Unit { get; set; }
    public decimal? EstimatedUnitPrice { get; set; }
    public decimal? EstimatedAmount { get; set; }
    public string? Notes { get; set; }

    public PurchaseRequest? PurchaseRequest { get; set; }
}
