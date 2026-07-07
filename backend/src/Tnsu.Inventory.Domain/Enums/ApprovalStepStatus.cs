namespace Tnsu.Inventory.Domain.Enums;

public static class ApprovalStepStatus
{
    public const string Pending = "pending";
    public const string Approved = "approved";
    public const string Rejected = "rejected";
    public const string Returned = "returned";
    public const string Skipped = "skipped";

    public static string Label(string status) => status switch
    {
        Pending => "На согласовании",
        Approved => "Согласовано",
        Rejected => "Отклонено",
        Returned => "Возврат на доработку",
        Skipped => "Пропущено",
        _ => status
    };
}
