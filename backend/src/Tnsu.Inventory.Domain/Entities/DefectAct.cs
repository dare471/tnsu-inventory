namespace Tnsu.Inventory.Domain.Entities;

public class DefectAct
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Number { get; set; } = string.Empty;
    public Guid CreatedByUserId { get; set; }
    public Guid ProjectId { get; set; }
    public string ProjectCode { get; set; } = string.Empty;
    public string ProjectName { get; set; } = string.Empty;
    public Guid VehicleId { get; set; }
    public string VehicleName { get; set; } = string.Empty;
    public string VehicleGroupName { get; set; } = string.Empty;
    public string StateNumber { get; set; } = string.Empty;
    public string VinCode { get; set; } = string.Empty;
    public int? VehicleYear { get; set; }
    public string MalfunctionDescription { get; set; } = string.Empty;
    public string Status { get; set; } = Enums.WorkflowStatus.Draft;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? SignedAt { get; set; }
    public string? CancelComment { get; set; }
    public int ResubmitFromStepOrder { get; set; } = 1;
    public bool ResumeFromReturnStep { get; set; } = true;

    public AppUser? CreatedBy { get; set; }
    public ICollection<DefectActPart> Parts { get; set; } = new List<DefectActPart>();
    public ICollection<ApprovalStep> ApprovalSteps { get; set; } = new List<ApprovalStep>();
    public ICollection<DocumentAttachment> Attachments { get; set; } = new List<DocumentAttachment>();
}
