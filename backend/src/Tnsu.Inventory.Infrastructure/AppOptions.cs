namespace Tnsu.Inventory.Infrastructure;

public sealed class AppOptions
{
    public const string SectionName = "App";

    public string SharePointSiteUrl { get; set; } = "https://tnsukz.sharepoint.com/sites/kps";
    public string FrontendBaseUrl { get; set; } = "https://tnsukz.sharepoint.com/sites/kps";
    public string AttachmentStoragePath { get; set; } = "/var/lib/tnsu-inventory/attachments";

    // Страницы SharePoint с веб-частями «формы». Если заданы — ссылки в уведомлениях
    // ведут на них в виде "{PageUrl}?documentId={guid}&DocId={guid}".
    public string? DefectActPageUrl { get; set; }
    public string? PurchaseRequestPageUrl { get; set; }

    // Единая страница со списками. Если задана (и нет отдельной страницы формы) —
    // ссылка = "{PageUrl}?docType={type}&documentId={guid}&DocId={guid}".
    public string? ListsPageUrl { get; set; }
}

