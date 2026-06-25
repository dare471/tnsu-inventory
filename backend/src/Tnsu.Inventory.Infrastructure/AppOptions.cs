namespace Tnsu.Inventory.Infrastructure;

public sealed class AppOptions
{
    public const string SectionName = "App";

    public string SharePointSiteUrl { get; set; } = "https://tnsukz.sharepoint.com/sites/kps";
    public string FrontendBaseUrl { get; set; } = "https://tnsukz.sharepoint.com/sites/kps";
    public string AttachmentStoragePath { get; set; } = "/var/lib/tnsu-inventory/attachments";
}

public sealed class SmtpOptions
{
    public const string SectionName = "Smtp";

    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 1025;
    public string FromEmail { get; set; } = "mechanization@tansu.local";
    public string FromName { get; set; } = "Механизация — заявки";
}
