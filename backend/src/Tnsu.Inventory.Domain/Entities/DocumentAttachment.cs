namespace Tnsu.Inventory.Domain.Entities;

public class DocumentAttachment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string DocumentType { get; set; } = string.Empty;
    public Guid? DefectActId { get; set; }
    public Guid? PurchaseRequestId { get; set; }
    public string Category { get; set; } = "general";
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
    public string StoragePath { get; set; } = string.Empty;
    public string? SharePointUrl { get; set; }
    public Guid UploadedByUserId { get; set; }
    public DateTimeOffset UploadedAt { get; set; } = DateTimeOffset.UtcNow;

    public DefectAct? DefectAct { get; set; }
    public PurchaseRequest? PurchaseRequest { get; set; }
}
