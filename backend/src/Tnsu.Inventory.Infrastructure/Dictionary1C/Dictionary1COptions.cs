namespace Tnsu.Inventory.Infrastructure.Dictionary1C;

public sealed class Dictionary1COptions
{
    public const string SectionName = "Dictionary1C";

    public string BaseUrl { get; set; } = "https://api.tnsu.kz";
    public string TenantId { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string Scope { get; set; } = string.Empty;

    public bool IsAuthConfigured =>
        !string.IsNullOrWhiteSpace(TenantId) &&
        !string.IsNullOrWhiteSpace(ClientId) &&
        !string.IsNullOrWhiteSpace(ClientSecret);
}
