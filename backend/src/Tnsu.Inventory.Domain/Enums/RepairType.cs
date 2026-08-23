namespace Tnsu.Inventory.Domain.Enums;

public static class RepairType
{
    public const string Planned = "planned";
    public const string Emergency = "emergency";

    public static bool IsValid(string? value) =>
        value is Planned or Emergency;

    public static string Normalize(string? value) =>
        IsValid(value) ? value! : Planned;

    public static string Label(string type) => type switch
    {
        Planned => "Плановый ремонт",
        Emergency => "Аварийный ремонт",
        _ => type
    };
}
