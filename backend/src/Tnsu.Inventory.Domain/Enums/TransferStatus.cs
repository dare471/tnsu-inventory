namespace Tnsu.Inventory.Domain.Enums;

public static class TransferStatus
{
    public const string Draft = "draft";
    public const string Submitted = "submitted";
    public const string Cancelled = "cancelled";

    public static string Label(string status) => status switch
    {
        Draft => "Черновик",
        Submitted => "Отправлена",
        Cancelled => "Аннулирована",
        _ => status
    };
}
