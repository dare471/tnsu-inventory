namespace Tnsu.Inventory.Domain.Entities;

public class DocumentChangeEntry
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string DocumentType { get; set; } = string.Empty;
    public Guid DocumentId { get; set; }
    public Guid? UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
