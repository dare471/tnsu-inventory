namespace Tnsu.Inventory.Domain.Enums;

public static class ApprovalAction
{
    public const string Approved = "approved";
    public const string Rejected = "rejected";
    public const string Returned = "returned";

    public static string Label(string? action) => action switch
    {
        Approved => "Согласовано",
        Rejected => "Отклонено",
        Returned => "Возврат на доработку",
        _ => "—"
    };
}
