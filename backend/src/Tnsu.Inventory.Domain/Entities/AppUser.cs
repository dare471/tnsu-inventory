namespace Tnsu.Inventory.Domain.Entities;

public class AppUser
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string EntraObjectId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public Guid? ManagerUserId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public AppUser? Manager { get; set; }
}
