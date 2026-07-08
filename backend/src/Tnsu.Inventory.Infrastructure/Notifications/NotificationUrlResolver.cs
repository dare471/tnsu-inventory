using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;
using Tnsu.Inventory.Domain;

namespace Tnsu.Inventory.Infrastructure.Notifications;

public sealed partial class NotificationUrlResolver(IOptions<AppOptions> appOptions)
{
    public string ToAbsolute(string linkUrl)
    {
        if (string.IsNullOrWhiteSpace(linkUrl)) return linkUrl;
        if (Uri.TryCreate(linkUrl, UriKind.Absolute, out _)) return linkUrl;

        var options = appOptions.Value;

        var defectMatch = DefectActLink().Match(linkUrl);
        if (defectMatch.Success)
        {
            var resolved = ResolvePageUrl(
                options.DefectActPageUrl, options.ListsPageUrl,
                DocumentTypes.DefectAct, defectMatch.Groups["id"].Value);
            if (resolved is not null) return resolved;
        }

        var purchaseMatch = PurchaseRequestLink().Match(linkUrl);
        if (purchaseMatch.Success)
        {
            var resolved = ResolvePageUrl(
                options.PurchaseRequestPageUrl, options.ListsPageUrl,
                DocumentTypes.PurchaseRequest, purchaseMatch.Groups["id"].Value);
            if (resolved is not null) return resolved;
        }

        var baseUrl = options.FrontendBaseUrl.TrimEnd('/');
        return linkUrl.StartsWith('/') ? $"{baseUrl}{linkUrl}" : $"{baseUrl}/{linkUrl}";
    }

    private static string? ResolvePageUrl(string? formPageUrl, string? listsPageUrl, string documentType, string documentId)
    {
        if (!string.IsNullOrWhiteSpace(formPageUrl))
            return AppendQuery(formPageUrl, $"DocId={Uri.EscapeDataString(documentId)}");

        if (!string.IsNullOrWhiteSpace(listsPageUrl))
            return AppendQuery(listsPageUrl, $"docType={documentType}&DocId={Uri.EscapeDataString(documentId)}");

        return null;
    }

    private static string AppendQuery(string pageUrl, string query)
    {
        var trimmed = pageUrl.Trim();
        var separator = trimmed.Contains('?') ? '&' : '?';
        return $"{trimmed}{separator}{query}";
    }

    [GeneratedRegex(@"^/defect-acts/(?<id>[^/?#]+)", RegexOptions.IgnoreCase)]
    private static partial Regex DefectActLink();

    [GeneratedRegex(@"^/purchase-requests/(?<id>[^/?#]+)", RegexOptions.IgnoreCase)]
    private static partial Regex PurchaseRequestLink();
}
