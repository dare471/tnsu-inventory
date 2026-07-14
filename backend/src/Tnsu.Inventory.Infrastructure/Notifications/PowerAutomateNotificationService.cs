using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Tnsu.Inventory.Infrastructure.Notifications;

public sealed class PowerAutomateNotificationService(
    HttpClient http,
    IOptions<NotificationsOptions> notificationsOptions,
    NotificationUrlResolver urlResolver,
    ILogger<PowerAutomateNotificationService> logger)
{
    private readonly SemaphoreSlim tokenLock = new(1, 1);
    private string? cachedToken;
    private DateTimeOffset tokenExpiresAt = DateTimeOffset.MinValue;

    public async Task<bool> SendAsync(string email, string linkUrl, string status, string docNumber, CancellationToken ct)
    {
        var options = notificationsOptions.Value.PowerAutomate;
        if (string.IsNullOrWhiteSpace(options.FlowUrl) || string.IsNullOrWhiteSpace(email))
            return false;

        var absoluteLink = urlResolver.ToAbsolute(linkUrl);
        TryExtractDocument(absoluteLink, linkUrl, out var documentType, out var documentId);

        var payload = new
        {
            email = email.Trim(),
            linkURL = absoluteLink,
            status,
            docNumber,
            documentId,
            documentType
        };

        return await InvokeAsync(options, payload, ct);
    }

    private static void TryExtractDocument(
        string absoluteLink, string originalLink, out string? documentType, out string? documentId)
    {
        documentType = null;
        documentId = null;

        static string? Q(string url, string name)
        {
            var qIndex = url.IndexOf('?');
            if (qIndex < 0) return null;
            foreach (var part in url[(qIndex + 1)..].Split('&', StringSplitOptions.RemoveEmptyEntries))
            {
                var eq = part.IndexOf('=');
                if (eq <= 0) continue;
                var key = Uri.UnescapeDataString(part[..eq]);
                if (!key.Equals(name, StringComparison.OrdinalIgnoreCase)) continue;
                return Uri.UnescapeDataString(part[(eq + 1)..]);
            }
            return null;
        }

        documentId = Q(absoluteLink, "documentId") ?? Q(absoluteLink, "DocId");
        documentType = Q(absoluteLink, "docType") ?? Q(absoluteLink, "documentType");

        if (documentId is null || documentType is null)
        {
            if (originalLink.Contains("/defect-acts/", StringComparison.OrdinalIgnoreCase))
            {
                documentType ??= "defect_act";
                var idx = originalLink.LastIndexOf('/');
                if (idx >= 0 && Guid.TryParse(originalLink[(idx + 1)..].Split('?', '#')[0], out var gid))
                    documentId ??= gid.ToString("D");
            }
            else if (originalLink.Contains("/purchase-requests/", StringComparison.OrdinalIgnoreCase))
            {
                documentType ??= "purchase_request";
                var idx = originalLink.LastIndexOf('/');
                if (idx >= 0 && Guid.TryParse(originalLink[(idx + 1)..].Split('?', '#')[0], out var gid))
                    documentId ??= gid.ToString("D");
            }
        }
    }

    private async Task<bool> InvokeAsync(PowerAutomateOptions options, object payload, CancellationToken ct)
    {
        try
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, options.FlowUrl)
            {
                Content = JsonContent.Create(payload)
            };

            if (options.RequiresOAuth)
            {
                var token = await GetTokenAsync(options, ct);
                if (string.IsNullOrWhiteSpace(token))
                {
                    logger.LogWarning("Power Automate: не удалось получить OAuth-токен, уведомление не отправлено");
                    return false;
                }

                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            }

            using var response = await http.SendAsync(request, ct);
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(ct);
                logger.LogWarning(
                    "Power Automate flow returned {Status}: {Body}",
                    response.StatusCode,
                    body);
                return false;
            }

            return true;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Power Automate notification failed");
            return false;
        }
    }

    private async Task<string?> GetTokenAsync(PowerAutomateOptions options, CancellationToken ct)
    {
        if (cachedToken is not null && DateTimeOffset.UtcNow < tokenExpiresAt)
            return cachedToken;

        await tokenLock.WaitAsync(ct);
        try
        {
            if (cachedToken is not null && DateTimeOffset.UtcNow < tokenExpiresAt)
                return cachedToken;

            using var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["grant_type"] = "client_credentials",
                ["client_id"] = options.ClientId!,
                ["client_secret"] = options.ClientSecret!,
                ["scope"] = options.Scope
            });

            var url = $"https://login.microsoftonline.com/{options.TenantId}/oauth2/v2.0/token";
            using var response = await http.PostAsync(url, content, ct);
            var raw = await response.Content.ReadAsStringAsync(ct);
            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning("Power Automate: token endpoint returned {Status}: {Body}", response.StatusCode, raw);
                return null;
            }

            using var doc = JsonDocument.Parse(raw);
            var root = doc.RootElement;
            var token = root.GetProperty("access_token").GetString();
            var expiresIn = root.TryGetProperty("expires_in", out var exp) ? exp.GetInt32() : 3600;

            cachedToken = token;
            tokenExpiresAt = DateTimeOffset.UtcNow.AddSeconds(expiresIn - 300);
            return token;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Power Automate: token acquisition failed");
            return null;
        }
        finally
        {
            tokenLock.Release();
        }
    }
}
