using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;

namespace Tnsu.Inventory.Infrastructure.Notifications;

public sealed partial class NotificationUrlResolver(IOptions<AppOptions> appOptions)
{
    public string ToAbsolute(string linkUrl)
    {
        if (string.IsNullOrWhiteSpace(linkUrl)) return linkUrl;
        if (Uri.TryCreate(linkUrl, UriKind.Absolute, out _)) return linkUrl;

        var options = appOptions.Value;

        var defectMatch = DefectActLink().Match(linkUrl);
        if (defectMatch.Success && !string.IsNullOrWhiteSpace(options.DefectActPageUrl))
            return WithDocId(options.DefectActPageUrl!, defectMatch.Groups["id"].Value);

        var purchaseMatch = PurchaseRequestLink().Match(linkUrl);
        if (purchaseMatch.Success && !string.IsNullOrWhiteSpace(options.PurchaseRequestPageUrl))
            return WithDocId(options.PurchaseRequestPageUrl!, purchaseMatch.Groups["id"].Value);

        var baseUrl = options.FrontendBaseUrl.TrimEnd('/');
        return linkUrl.StartsWith('/') ? $"{baseUrl}{linkUrl}" : $"{baseUrl}/{linkUrl}";
    }

    private static string WithDocId(string pageUrl, string documentId)
    {
        var trimmed = pageUrl.Trim();
        var separator = trimmed.Contains('?') ? '&' : '?';
        return $"{trimmed}{separator}DocId={Uri.EscapeDataString(documentId)}";
    }

    [GeneratedRegex(@"^/defect-acts/(?<id>[^/?#]+)", RegexOptions.IgnoreCase)]
    private static partial Regex DefectActLink();

    [GeneratedRegex(@"^/purchase-requests/(?<id>[^/?#]+)", RegexOptions.IgnoreCase)]
    private static partial Regex PurchaseRequestLink();
}
