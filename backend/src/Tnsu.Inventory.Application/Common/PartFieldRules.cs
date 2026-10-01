using Tnsu.Inventory.Application.Common.Exceptions;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.Common;

internal static class PartFieldRules
{
    public static string? CatalogNumber(string? value)
    {
        var trimmed = value?.Trim();
        if (string.IsNullOrEmpty(trimmed))
            return null;
        if (trimmed.Length > 50)
            throw new ValidationFailedException("Партномер не длиннее 50 символов.");
        return trimmed;
    }

    public static string Unit(string? value)
    {
        if (!MeasurementUnits.IsAllowed(value))
            throw new ValidationFailedException("Выберите единицу измерения из списка.");
        return MeasurementUnits.Normalize(value);
    }
}
