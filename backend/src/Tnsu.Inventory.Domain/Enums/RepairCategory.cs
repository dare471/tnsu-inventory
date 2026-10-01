namespace Tnsu.Inventory.Domain.Enums;

public static class RepairCategory
{
    public const string Capital = "capital";
    public const string Current = "current";

    public static bool IsValid(string? value) =>
        value is Capital or Current;

    public static string Normalize(string? value) =>
        IsValid(value) ? value! : Current;

    public static string Label(string category) => category switch
    {
        Capital => "Капитальный ремонт",
        Current => "Текущий ремонт",
        _ => category
    };
}
