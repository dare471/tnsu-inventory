namespace Tnsu.Inventory.Domain.Entities;

public class MaterialTransferLine
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TransferRequestId { get; set; }
    public int LineNo { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? CatalogNumber { get; set; }
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = "шт.";
    public decimal? AvailableQuantity { get; set; }

    public MaterialTransferRequest? TransferRequest { get; set; }
}
