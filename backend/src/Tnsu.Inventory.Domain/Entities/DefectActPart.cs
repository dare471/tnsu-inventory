namespace Tnsu.Inventory.Domain.Entities;

public class DefectActPart
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid DefectActId { get; set; }
    public int LineNo { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? CatalogNumber { get; set; }
    public decimal Quantity { get; set; }
    public string? Unit { get; set; }
    public string? Notes { get; set; }

    public DefectAct? DefectAct { get; set; }
}
