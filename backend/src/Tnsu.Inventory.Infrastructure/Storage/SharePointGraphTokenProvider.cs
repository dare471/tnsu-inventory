using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Tnsu.Inventory.Infrastructure.Dictionary1C;

namespace Tnsu.Inventory.Infrastructure.Storage;

/// <summary>
/// Токен Graph: сначала SharePoint app registration, иначе Dictionary1C (как у вложений).
/// </summary>
public sealed class SharePointGraphTokenProvider(
    HttpClient http,
    IOptions<SharePointOptions> sharePointOptions,
    Dictionary1CTokenProvider dictionaryTokenProvider,
    ILogger<SharePointGraphTokenProvider> logger)
{
    private string? _cachedToken;
    private DateTimeOffset _expiresAt;

    public async Task<string?> GetAccessTokenAsync(CancellationToken ct)
    {
        var sp = sharePointOptions.Value;
        if (sp.IsConfigured)
        {
            if (_cachedToken is not null && DateTimeOffset.UtcNow < _expiresAt.AddMinutes(-2))
                return _cachedToken;

            try
            {
                using var content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    ["grant_type"] = "client_credentials",
                    ["client_id"] = sp.ClientId,
                    ["client_secret"] = sp.ClientSecret,
                    ["scope"] = "https://graph.microsoft.com/.default"
                });

                var url = $"https://login.microsoftonline.com/{sp.TenantId}/oauth2/v2.0/token";
                using var response = await http.PostAsync(url, content, ct);
                if (!response.IsSuccessStatusCode)
                {
                    logger.LogWarning("SharePoint Graph token failed: {Status}", response.StatusCode);
                }
                else
                {
                    var body = await response.Content.ReadFromJsonAsync<TokenResponse>(ct);
                    _cachedToken = body?.AccessToken;
                    _expiresAt = DateTimeOffset.UtcNow.AddSeconds(body?.ExpiresIn ?? 3600);
                    if (!string.IsNullOrWhiteSpace(_cachedToken))
                        return _cachedToken;
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "SharePoint Graph token error");
            }
        }

        return await dictionaryTokenProvider.GetAccessTokenAsync(ct);
    }

    private sealed class TokenResponse
    {
        [JsonPropertyName("access_token")]
        public string? AccessToken { get; set; }

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }
    }
}
