using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Tnsu.Inventory.Infrastructure.Dictionary1C;

public sealed class Dictionary1CTokenProvider(
    HttpClient http,
    IOptions<Dictionary1COptions> options,
    ILogger<Dictionary1CTokenProvider> logger)
{
    private string? _cachedToken;
    private DateTimeOffset _expiresAt;

    public async Task<string?> GetAccessTokenAsync(CancellationToken ct)
    {
        var cfg = options.Value;
        if (!cfg.IsAuthConfigured)
            return null;

        if (_cachedToken is not null && DateTimeOffset.UtcNow < _expiresAt.AddMinutes(-2))
            return _cachedToken;

        try
        {
            var scope = string.IsNullOrWhiteSpace(cfg.Scope)
                ? $"{cfg.ClientId}/.default"
                : cfg.Scope;

            using var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["grant_type"] = "client_credentials",
                ["client_id"] = cfg.ClientId,
                ["client_secret"] = cfg.ClientSecret,
                ["scope"] = scope
            });

            var url = $"https://login.microsoftonline.com/{cfg.TenantId}/oauth2/v2.0/token";
            using var response = await http.PostAsync(url, content, ct);
            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning("Dictionary1C token request failed: {Status}", response.StatusCode);
                return null;
            }

            var body = await response.Content.ReadFromJsonAsync<TokenResponse>(ct);
            _cachedToken = body?.AccessToken;
            _expiresAt = DateTimeOffset.UtcNow.AddSeconds(body?.ExpiresIn ?? 3600);
            return _cachedToken;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Dictionary1C token request error");
            return null;
        }
    }

    private sealed class TokenResponse
    {
        [JsonPropertyName("access_token")]
        public string? AccessToken { get; set; }

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }
    }
}
