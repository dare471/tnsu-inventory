namespace Tnsu.Inventory.Domain.Entities;

public class ApprovalStep
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RoundId { get; set; }
    public string DocumentType { get; set; } = string.Empty;
    public Guid? DefectActId { get; set; }
    public Guid? PurchaseRequestId { get; set; }
    public int OrderNo { get; set; }
    public string ApproverRole { get; set; } = string.Empty;
    public Guid ApproverUserId { get; set; }
    public string Status { get; set; } = Enums.ApprovalStepStatus.Pending;
    public string? Comment { get; set; }
    public string? Action { get; set; }
    public bool RequiresDigitalSignature { get; set; }
    public string? DigitalSignatureRef { get; set; }
    public DateTimeOffset? AssignedAt { get; set; }
    public DateTimeOffset? DecidedAt { get; set; }
    public DateTimeOffset? LastReminderAt { get; set; }
    public DateTimeOffset? EscalatedAt { get; set; }

    public AppUser? Approver { get; set; }
    public DefectAct? DefectAct { get; set; }
    public PurchaseRequest? PurchaseRequest { get; set; }
}
