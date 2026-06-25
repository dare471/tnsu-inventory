using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Tnsu.Inventory.Application.Common.Interfaces;

namespace Tnsu.Inventory.Infrastructure.Storage;

public sealed class SharePointAttachmentStorage(
    HttpClient http,
    IOptions<SharePointOptions> options,
    Dictionary1C.Dictionary1CTokenProvider tokenProvider,
    LocalAttachmentStorage localFallback,
    ILogger<SharePointAttachmentStorage> logger) : ISharePointAwareStorage
{
    private readonly Dictionary<string, string> _urlByPath = new();

    public async Task<string> SaveAsync(Stream content, string fileName, CancellationToken ct)
    {
        if (!options.Value.IsConfigured)
            return await localFallback.SaveAsync(content, fileName, ct);

        try
        {
            var token = await tokenProvider.GetAccessTokenAsync(ct);
            if (token is null)
                return await localFallback.SaveAsync(content, fileName, ct);

            var cfg = options.Value;
            var siteHost = new Uri(cfg.SiteUrl).Host;
            var sitePath = new Uri(cfg.SiteUrl).AbsolutePath.Trim('/');
            var siteId = await ResolveSiteIdAsync(siteHost, sitePath, token, ct);
            var driveId = await ResolveDriveIdAsync(siteId, cfg.DocumentLibrary, token, ct);

            var safeName = $"{DateTime.UtcNow:yyyy/MM}/{Guid.NewGuid():N}_{Path.GetFileName(fileName)}";
            using var ms = new MemoryStream();
            await content.CopyToAsync(ms, ct);
            ms.Position = 0;

            var uploadUrl =
                $"https://graph.microsoft.com/v1.0/sites/{siteId}/drives/{driveId}/root:/{safeName}:/content";
            using var request = new HttpRequestMessage(HttpMethod.Put, uploadUrl)
            {
                Content = new StreamContent(ms)
            };
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

            using var response = await http.SendAsync(request, ct);
            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning("SharePoint upload failed: {Status}", response.StatusCode);
                ms.Position = 0;
                return await localFallback.SaveAsync(ms, fileName, ct);
            }

            var body = await response.Content.ReadFromJsonAsync<DriveItemResponse>(ct);
            _urlByPath[safeName] = body?.WebUrl ?? cfg.SiteUrl;
            ms.Position = 0;
            await localFallback.SaveAsync(ms, safeName, ct);
            return safeName;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "SharePoint upload error, falling back to local storage");
            content.Position = 0;
            return await localFallback.SaveAsync(content, fileName, ct);
        }
    }

    public Task<Stream> OpenReadAsync(string storagePath, CancellationToken ct) =>
        localFallback.OpenReadAsync(storagePath, ct);

    public Task<string?> GetPublicUrlAsync(string storagePath, CancellationToken ct) =>
        Task.FromResult(_urlByPath.TryGetValue(storagePath, out var url) ? url : null);

    private static async Task<string> ResolveSiteIdAsync(
        string host, string path, string token, CancellationToken ct)
    {
        using var http = new HttpClient();
        using var req = new HttpRequestMessage(HttpMethod.Get,
            $"https://graph.microsoft.com/v1.0/sites/{host}:/{path}");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        using var res = await http.SendAsync(req, ct);
        res.EnsureSuccessStatusCode();
        var json = await res.Content.ReadFromJsonAsync<SiteResponse>(ct);
        return json!.Id!;
    }

    private async Task<string> ResolveDriveIdAsync(string siteId, string libraryName, string token, CancellationToken ct)
    {
        using var req = new HttpRequestMessage(HttpMethod.Get,
            $"https://graph.microsoft.com/v1.0/sites/{siteId}/drives");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        using var res = await http.SendAsync(req, ct);
        res.EnsureSuccessStatusCode();
        var json = await res.Content.ReadFromJsonAsync<DrivesResponse>(ct);
        var drive = json?.Value?.FirstOrDefault(d =>
            string.Equals(d.Name, libraryName, StringComparison.OrdinalIgnoreCase))
            ?? json?.Value?.FirstOrDefault();
        return drive?.Id ?? throw new InvalidOperationException("SharePoint drive not found");
    }

    private sealed class SiteResponse { public string? Id { get; set; } }
    private sealed class DrivesResponse { public List<DriveInfo>? Value { get; set; } }
    private sealed class DriveInfo { public string? Id { get; set; } public string? Name { get; set; } }
    private sealed class DriveItemResponse { public string? WebUrl { get; set; } }
}
