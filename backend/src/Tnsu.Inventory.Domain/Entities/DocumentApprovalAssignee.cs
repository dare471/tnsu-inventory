namespace Tnsu.Inventory.Domain.Entities;

public class DocumentApprovalAssignee
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? DefectActId { get; set; }
    public Guid? PurchaseRequestId { get; set; }
    public string Role { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public DefectAct? DefectAct { get; set; }
    public PurchaseRequest? PurchaseRequest { get; set; }
    public AppUser? User { get; set; }
}
