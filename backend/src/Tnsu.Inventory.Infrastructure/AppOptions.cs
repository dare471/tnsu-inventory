namespace Tnsu.Inventory.Infrastructure;

public sealed class AppOptions
{
    public const string SectionName = "App";

    public string SharePointSiteUrl { get; set; } = "https://tnsukz.sharepoint.com/sites/kps";
    public string FrontendBaseUrl { get; set; } = "https://tnsukz.sharepoint.com/sites/kps";
    public string AttachmentStoragePath { get; set; } = "/var/lib/tnsu-inventory/attachments";

    // Страницы SharePoint с веб-частями. Если заданы — ссылки в уведомлениях
    // ведут на них в виде "{PageUrl}?DocId={id}", иначе — на FrontendBaseUrl.
    public string? DefectActPageUrl { get; set; }
    public string? PurchaseRequestPageUrl { get; set; }
}

