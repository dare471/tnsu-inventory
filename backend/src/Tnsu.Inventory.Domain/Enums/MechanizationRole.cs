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
    public const string CommercialDirector = "commercial_director";
    public const string Executor = "executor";

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

    /// <summary>Кто назначает исполнителя после утверждения заявки.</summary>
    public static readonly IReadOnlySet<string> ExecutionAssignerRoles = new HashSet<string>
    {
        CommercialDirector,
        OmtsHead
    };

    /// <summary>Кого можно назначить исполнителем заявки.</summary>
    public static readonly IReadOnlySet<string> ExecutorRoles = new HashSet<string>
    {
        Executor,
        OmtsSpecialist
    };

    public static readonly IReadOnlyList<string> PostApprovalRoles =
    [
        CommercialDirector,
        Executor,
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
        OmtsSpecialist,
        CommercialDirector,
        Executor
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
        CommercialDirector => "Коммерческий директор",
        Executor => "Исполнитель",
        _ => role
    };

    public static bool CanAssignExecutor(string? role) =>
        role is not null && ExecutionAssignerRoles.Contains(role);

    public static bool IsExecutorRole(string? role) =>
        role is not null && ExecutorRoles.Contains(role);
}
