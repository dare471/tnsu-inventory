namespace Tnsu.Inventory.Application.PurchaseRequests;

public sealed record PurchaseRequestLineInput(
    int LineNo,
    string Name,
    string? CatalogNumber,
    decimal Quantity,
    string? Unit,
    decimal? EstimatedUnitPrice,
    string? Notes);

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
    string Description,
    IReadOnlyList<PurchaseRequestLineInput> Lines);

public sealed record UpdatePurchaseRequestRequest(
    string Description,
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
    string? Notes);

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
    string Description,
    decimal EstimatedAmount,
    bool HasServiceNoteAttachment,
    string CreatedByFullName,
    string? AssignedExecutorFullName,
    DateTimeOffset CreatedAt,
    IReadOnlyList<PurchaseRequestLineDto> Lines,
    bool CanEdit,
    bool CanSubmit,
    bool CanCancel);

public sealed record PurchaseRequestListItemDto(
    Guid Id,
    string Number,
    string Status,
    string StatusLabel,
    string ProjectName,
    string VehicleName,
    string InitiatorFullName,
    string? CurrentApproverFullName,
    decimal EstimatedAmount,
    DateTimeOffset CreatedAt);

public sealed record AssignExecutorRequest(Guid ExecutorUserId);
