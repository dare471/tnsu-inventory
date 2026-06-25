namespace Tnsu.Inventory.Domain.Enums;

public static class WorkflowStatus
{
    public const string Draft = "draft";
    public const string OnCoordination = "on_coordination";
    public const string OnFinalApproval = "on_final_approval";
    public const string Approved = "approved";
    public const string ExecutorAssigned = "executor_assigned";
    public const string InProgress = "in_progress";
    public const string Closed = "closed";
    public const string Returned = "returned";
    public const string Rejected = "rejected";
    public const string Cancelled = "cancelled";
    public const string Signed = "signed";

    public static string Label(string status) => status switch
    {
        Draft => "Черновик",
        OnCoordination => "На согласовании",
        OnFinalApproval => "На утверждении",
        Approved => "Утверждена",
        ExecutorAssigned => "Назначен исполнитель ОМТС",
        InProgress => "В работе ОМТС",
        Closed => "Закрыта",
        Returned => "Возврат на доработку",
        Rejected => "Отклонена",
        Cancelled => "Отменена",
        Signed => "Подписан",
        _ => status
    };
}
