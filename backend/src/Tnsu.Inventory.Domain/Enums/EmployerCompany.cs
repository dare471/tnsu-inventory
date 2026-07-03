namespace Tnsu.Inventory.Domain.Enums;

public static class EmployerCompany
{
    public const string TansuConstruction = "tansu_construction";
    public const string KazPromService = "kazprom_service";

    public static readonly IReadOnlySet<string> All = new HashSet<string>(StringComparer.Ordinal)
    {
        TansuConstruction,
        KazPromService
    };

    public static bool IsValid(string? value) => value is not null && All.Contains(value);

    public static string Label(string company) => company switch
    {
        TansuConstruction => "ТОО TANSU Construction",
        KazPromService => "ТОО KazPromService",
        _ => company
    };

    public static string ZupQueryValue(string company) => company switch
    {
        TansuConstruction => "ТОО TANSU Construction",
        KazPromService => "ТОО KazPromService",
        _ => company
    };
}
