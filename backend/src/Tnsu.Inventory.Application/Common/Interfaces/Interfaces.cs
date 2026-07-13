namespace Tnsu.Inventory.Application.Common.Interfaces;

public interface IInventoryDbContext
{
    Microsoft.EntityFrameworkCore.DbSet<Domain.Entities.AppUser> Users { get; }
    Microsoft.EntityFrameworkCore.DbSet<Domain.Entities.DefectAct> DefectActs { get; }
    Microsoft.EntityFrameworkCore.DbSet<Domain.Entities.DefectActPart> DefectActParts { get; }
    Microsoft.EntityFrameworkCore.DbSet<Domain.Entities.PurchaseRequest> PurchaseRequests { get; }
    Microsoft.EntityFrameworkCore.DbSet<Domain.Entities.PurchaseRequestLine> PurchaseRequestLines { get; }
    Microsoft.EntityFrameworkCore.DbSet<Domain.Entities.ApprovalStep> ApprovalSteps { get; }
    Microsoft.EntityFrameworkCore.DbSet<Domain.Entities.ProjectApprovalAssignee> ProjectApprovalAssignees { get; }
    Microsoft.EntityFrameworkCore.DbSet<Domain.Entities.DocumentApprovalAssignee> DocumentApprovalAssignees { get; }
    Microsoft.EntityFrameworkCore.DbSet<Domain.Entities.DocumentAttachment> Attachments { get; }
    Microsoft.EntityFrameworkCore.DbSet<Domain.Entities.SupplierOrder> SupplierOrders { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

public interface ICurrentUser
{
    Guid? UserId { get; }
    string? Email { get; }
    string? Role { get; }
}

public interface IDictionary1CClient
{
    Task<IReadOnlyList<ProjectDto>> GetProjectsAsync(CancellationToken ct);
    Task<IReadOnlyList<VehicleDto>> GetVehiclesAsync(CancellationToken ct);
    Task<IReadOnlyList<ProjectSectionDto>> GetProjectSectionsAsync(Guid projectId, CancellationToken ct);
    Task<IReadOnlyList<WorkTypeDto>> GetWorkTypesAsync(CancellationToken ct);
    Task<IReadOnlyList<NomenclatureDto>> GetNomenclatureAsync(string? search, CancellationToken ct);
    Task<IReadOnlyList<ContractorDto>> GetContractorsAsync(string? search, CancellationToken ct);
}

public sealed record ProjectDto(Guid Id, string Code, string ProjectName);
public sealed record VehicleDto(
    Guid Id, string GroupName, string Name, string StateNumber, string VinCode, string FullPath);
public sealed record ProjectSectionDto(Guid Id, Guid ProjectId, string Code, string Name);
public sealed record WorkTypeDto(Guid Id, string Code, string Name);
public sealed record NomenclatureDto(Guid Id, string Code, string Name, string? Unit);
public sealed record ContractorDto(Guid Id, string Code, string Name, string? Inn);

public sealed record SparePartDto(
    string Id,
    string Name,
    string? CatalogNumber,
    string? Code,
    string? Unit,
    string? VehicleName,
    string? GroupName);

public interface ISparePartsCatalog
{
    Task<IReadOnlyList<SparePartDto>> SearchAsync(
        string? vehicleName, string? search, CancellationToken ct);
}

public interface IZupEmployeeClient
{
    Task<IReadOnlyList<ZupEmployeeDto>> ListEmployeesAsync(string employerCompany, CancellationToken ct);
}

public sealed record ZupEmployeeDto(
    string ExternalId,
    string FullName,
    string Position,
    string Email,
    string Department,
    string Mobile);

public interface IAttachmentStorage
{
    Task<string> SaveAsync(Stream content, string fileName, CancellationToken ct);
    Task<Stream> OpenReadAsync(string storagePath, CancellationToken ct);
}

public interface ISharePointAwareStorage : IAttachmentStorage
{
    Task<string?> GetPublicUrlAsync(string storagePath, CancellationToken ct);
}

public interface IProcurementBridge
{
    Task<string?> SubmitOrderAsync(Domain.Entities.PurchaseRequest request, string orderNumber, CancellationToken ct);
}

public interface INotificationService
{
    Task SendApprovalReminderAsync(ApprovalNotification notification, CancellationToken ct);
    Task SendEscalationAsync(ApprovalNotification notification, CancellationToken ct);
    Task SendAssignedForApprovalAsync(WorkflowNotification notification, CancellationToken ct);
    Task SendApprovedAsync(WorkflowNotification notification, CancellationToken ct);
    Task SendReturnedAsync(WorkflowNotification notification, CancellationToken ct);
    Task SendRejectedAsync(WorkflowNotification notification, CancellationToken ct);
}

public sealed record ApprovalNotification(
    Guid StepId,
    string DocumentType,
    Guid DocumentId,
    string DocumentNumber,
    string RecipientEmail,
    string RecipientName,
    string? ManagerEmail,
    string? ChiefMechanicEmail,
    int PendingWorkingDays,
    string LinkUrl);

public sealed record WorkflowNotification(
    string DocumentType,
    Guid DocumentId,
    string DocumentNumber,
    string RecipientEmail,
    string RecipientName,
    string InitiatorEmail,
    string InitiatorName,
    string? Comment,
    string LinkUrl);
