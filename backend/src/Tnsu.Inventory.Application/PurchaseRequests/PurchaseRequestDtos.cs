namespace Tnsu.Inventory.Application.PurchaseRequests;

public sealed record PurchaseRequestLineInput(
    int LineNo,
    string Name,
    string? CatalogNumber,
    decimal Quantity,
    string? Unit,
    decimal? EstimatedUnitPrice,
    string? Notes,
    Guid? Id = null,
    Guid? SourceDefectActPartId = null,
    bool IsRemoved = false);

public sealed record CreatePurchaseRequestRequest(
    Guid? DefectActId,
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
    string Description,
    DateOnly? DeliveryDate,
    IReadOnlyList<PurchaseRequestLineInput> Lines);

public sealed record UpdatePurchaseRequestRequest(
    string RepairType,
    string RepairCategory,
    decimal? Odometer,
    decimal? EngineHours,
    string Description,
    DateOnly? DeliveryDate,
    IReadOnlyList<PurchaseRequestLineInput> Lines);

public sealed record PurchaseRequestLineDto(
    Guid Id,
    int LineNo,
    string Code,
    string Name,
    string? CatalogNumber,
    decimal Quantity,
    string? Unit,
    decimal? EstimatedUnitPrice,
    decimal? EstimatedAmount,
    string? Notes,
    Guid? SourceDefectActPartId,
    decimal? MaxQuantity,
    bool IsRemoved);

public sealed record PurchaseRequestDto(
    Guid Id,
    string Number,
    string Status,
    string StatusLabel,
    Guid? DefectActId,
    string? DefectActNumber,
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
    string Description,
    decimal EstimatedAmount,
    bool HasServiceNoteAttachment,
    string CreatedByFullName,
    string? AssignedExecutorFullName,
    DateTimeOffset CreatedAt,
    DateOnly? DeliveryDate,
    IReadOnlyList<PurchaseRequestLineDto> Lines,
    bool CanEdit,
    bool CanSubmit,
    bool CanCancel,
    bool CanDelete,
    bool CanAssignExecutor,
    bool CanStartExecution,
    bool CanClose,
    bool LockedToDefectAct);

public sealed record DocumentChangeDto(
    Guid Id,
    string Action,
    string Summary,
    string UserFullName,
    DateTimeOffset CreatedAt);

public sealed record PurchaseRequestListItemDto(
    Guid Id,
    string Number,
    string Status,
    string StatusLabel,
    string ProjectName,
    string VehicleName,
    string InitiatorFullName,
    string? CurrentApproverFullName,
    string? AssignedExecutorFullName,
    decimal EstimatedAmount,
    DateOnly? DeliveryDate,
    DateTimeOffset CreatedAt,
    bool CanDelete);

public sealed record AssignExecutorRequest(Guid ExecutorUserId);
