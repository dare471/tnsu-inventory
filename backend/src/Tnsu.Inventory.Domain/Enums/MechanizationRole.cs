namespace Tnsu.Inventory.Domain.Enums;

public static class MechanizationRole
{
    public const string SiteMechanic = "site_mechanic";
    public const string ProjectStorekeeper = "project_storekeeper";
    public const string Security = "security";
    public const string ProjectManager = "project_manager";
    public const string WarehouseCoordinator = "warehouse_coordinator";
    public const string ChiefMechanic = "chief_mechanic";
    public const string OmtsHead = "omts_head";
    public const string OmtsSpecialist = "omts_specialist";

    public static readonly IReadOnlyList<string> CoordinationRoles =
    [
        ProjectStorekeeper,
        Security,
        ProjectManager,
        WarehouseCoordinator
    ];

    public static readonly IReadOnlyList<string> PurchaseApprovalRoles =
    [
        ProjectStorekeeper,
        Security,
        ProjectManager,
        WarehouseCoordinator,
        ChiefMechanic
    ];

    public static readonly IReadOnlyList<string> PostApprovalRoles =
    [
        OmtsHead,
        OmtsSpecialist
    ];

    public static readonly IReadOnlySet<string> All = new HashSet<string>
    {
        SiteMechanic,
        ProjectStorekeeper,
        Security,
        ProjectManager,
        WarehouseCoordinator,
        ChiefMechanic,
        OmtsHead,
        OmtsSpecialist
    };

    public static string Label(string role) => role switch
    {
        SiteMechanic => "Механик участка",
        ProjectStorekeeper => "Кладовщик проекта",
        Security => "СБ",
        ProjectManager => "РП / Начальник участка",
        WarehouseCoordinator => "Координатор складского хозяйства",
        ChiefMechanic => "Главный механик",
        OmtsHead => "Руководитель ОМТС",
        OmtsSpecialist => "Специалист ОМТС",
        _ => role
    };
}
