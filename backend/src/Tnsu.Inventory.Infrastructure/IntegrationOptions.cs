namespace Tnsu.Inventory.Infrastructure;

public sealed class SharePointOptions
{
    public const string SectionName = "SharePoint";

    public bool Enabled { get; set; }
    public string SiteUrl { get; set; } = "https://tnsukz.sharepoint.com/sites/kps";
    public string DocumentLibrary { get; set; } = "MechanizationAttachments";
    public string TenantId { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;

    public bool IsConfigured =>
        Enabled &&
        !string.IsNullOrWhiteSpace(TenantId) &&
        !string.IsNullOrWhiteSpace(ClientId) &&
        !string.IsNullOrWhiteSpace(ClientSecret);
}

public sealed class NotificationsOptions
{
    public const string SectionName = "Notifications";

    public NotificationEmailOptions Email { get; set; } = new();
}

public sealed class NotificationEmailOptions
{
    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 1025;
    public bool UseStartTls { get; set; }
    public string FromEmail { get; set; } = "portal@tnsu.kz";
    public string FromName { get; set; } = "TNSU Portal";
    public string? Username { get; set; }
    public string? Password { get; set; }

    public bool HasCredentials =>
        !string.IsNullOrWhiteSpace(Username) && !string.IsNullOrWhiteSpace(Password);
}

public sealed class TeamsOptions
{
    public const string SectionName = "Teams";

    public string? WebhookUrl { get; set; }
    public bool IsConfigured => !string.IsNullOrWhiteSpace(WebhookUrl);
}

public sealed class ProcurementOptions
{
    public const string SectionName = "Procurement";

    public string? BaseUrl { get; set; }
    public bool IsConfigured => !string.IsNullOrWhiteSpace(BaseUrl);
}
