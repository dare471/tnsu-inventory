namespace Tnsu.Inventory.Domain.Entities;

public class MaterialTransferRequest
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Number { get; set; } = string.Empty;
    public Guid CreatedByUserId { get; set; }
    public string Status { get; set; } = Enums.TransferStatus.Draft;
    public string SourceWarehouse { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public string? Comment { get; set; }
    public Guid? DefectActId { get; set; }
    public string? DefectActNumber { get; set; }
    public Guid? PurchaseRequestId { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public AppUser? CreatedBy { get; set; }
    public ICollection<MaterialTransferLine> Lines { get; set; } = new List<MaterialTransferLine>();
}
