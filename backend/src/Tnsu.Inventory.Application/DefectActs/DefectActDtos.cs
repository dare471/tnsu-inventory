namespace Tnsu.Inventory.Application.DefectActs;

public sealed record DefectActPartInput(
    int LineNo,
    string Name,
    string? CatalogNumber,
    decimal Quantity,
    string? Unit,
    string? Notes,
    decimal? ActualStockQuantity = null);

public sealed record CreateDefectActRequest(
    Guid ProjectId,
    string ProjectCode,
    string ProjectName,
    Guid VehicleId,
    string VehicleName,
    string VehicleGroupName,
    string StateNumber,
    string VinCode,
    int? VehicleYear,
    string RepairType,
    string RepairCategory,
    decimal? Odometer,
    decimal? EngineHours,
    string MalfunctionDescription,
    IReadOnlyList<DefectActPartInput> Parts);

public sealed record UpdateDefectActRequest(
    string RepairType,
    string RepairCategory,
    decimal? Odometer,
    decimal? EngineHours,
    string MalfunctionDescription,
    IReadOnlyList<DefectActPartInput> Parts);

public sealed record UpdateDefectActStockLine(Guid PartId, decimal? ActualStockQuantity);

public sealed record UpdateDefectActStockRequest(IReadOnlyList<UpdateDefectActStockLine> Parts);

public sealed record DefectActPartDto(
    Guid Id,
    int LineNo,
    string Name,
    string? CatalogNumber,
    decimal Quantity,
    string? Unit,
    string? Notes,
    decimal? ActualStockQuantity);

public sealed record DefectActDto(
    Guid Id,
    string Number,
    string Status,
    string StatusLabel,
    Guid ProjectId,
    string ProjectCode,
    string ProjectName,
    Guid VehicleId,
    string VehicleName,
    string VehicleGroupName,
    string StateNumber,
    string VinCode,
    int? VehicleYear,
    string RepairType,
    string RepairTypeLabel,
    string RepairCategory,
    string RepairCategoryLabel,
    decimal? Odometer,
    decimal? EngineHours,
    string MalfunctionDescription,
    string CreatedByFullName,
    DateTimeOffset CreatedAt,
    DateTimeOffset? SignedAt,
    IReadOnlyList<DefectActPartDto> Parts,
    bool CanEdit,
    bool CanSubmit,
    bool CanCreatePurchaseRequest,
    bool CanDelete,
    bool CanEditStock);

public sealed record DefectActListItemDto(
    Guid Id,
    string Number,
    string Status,
    string StatusLabel,
    string ProjectName,
    string VehicleName,
    string InitiatorFullName,
    string StateNumber,
    DateTimeOffset CreatedAt,
    bool CanDelete);

public sealed record ApprovalStepDto(
    Guid Id,
    int OrderNo,
    string ApproverRole,
    string ApproverRoleLabel,
    string ApproverFullName,
    string Status,
    string StatusLabel,
    string? Action,
    string? Comment,
    bool RequiresDigitalSignature,
    DateTimeOffset? AssignedAt,
    DateTimeOffset? DecidedAt,
    DateTimeOffset? StatusDate,
    int RoundNo);

public sealed record InboxItemDto(
    Guid StepId,
    string DocumentType,
    Guid DocumentId,
    string DocumentNumber,
    string Title,
    string ApproverRole,
    string ApproverRoleLabel,
    int OrderNo,
    DateTimeOffset? AssignedAt,
    int PendingWorkingDays);

public sealed record DecisionRequest(string? Comment, string? DigitalSignatureRef);
