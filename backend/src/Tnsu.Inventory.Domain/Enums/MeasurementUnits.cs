namespace Tnsu.Inventory.Domain.Enums;

public static class MeasurementUnits
{
    public static readonly IReadOnlyList<string> All =
    [
        "шт.",
        "кг",
        "л",
        "м³",
        "м²",
        "пог. м",
        "комплект",
        "тн",
        "пара",
        "упаковка"
    ];

    public static string Normalize(string? value)
    {
        var trimmed = (value ?? "").Trim();
        if (trimmed is "" or "шт")
            return "шт.";

        var match = All.FirstOrDefault(u => string.Equals(u, trimmed, StringComparison.OrdinalIgnoreCase));
        return match ?? trimmed;
    }

    public static bool IsAllowed(string? value) =>
        All.Contains(Normalize(value));
}
