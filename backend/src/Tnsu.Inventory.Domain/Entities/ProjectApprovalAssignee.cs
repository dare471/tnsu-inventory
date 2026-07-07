namespace Tnsu.Inventory.Domain.Entities;

public class ProjectApprovalAssignee
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProjectId { get; set; }
    public string Role { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public AppUser? User { get; set; }
}
