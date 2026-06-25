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
