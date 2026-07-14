using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;
using Tnsu.Inventory.Domain;

namespace Tnsu.Inventory.Infrastructure.Notifications;

/// <summary>
/// Абсолютные ссылки для уведомлений.
/// В SharePoint документ открывается по query documentId/DocId = GUID
/// (path /purchase-requests/{id} во встраивании не работает).
/// </summary>
public sealed partial class NotificationUrlResolver(IOptions<AppOptions> appOptions)
{
    private static readonly HashSet<string> IdParamNames = new(StringComparer.OrdinalIgnoreCase)
    {
        "documentId", "DocId", "id",
        "purchaseRequestId", "requestId", "defectActId", "actId"
    };

    public string ToAbsolute(string linkUrl)
    {
        if (string.IsNullOrWhiteSpace(linkUrl)) return linkUrl;

        if (Uri.TryCreate(linkUrl, UriKind.Absolute, out var absolute)
            && absolute.Scheme is "http" or "https"
            && Guid.TryParse(GetQueryValue(absolute.Query, "documentId")
                             ?? GetQueryValue(absolute.Query, "DocId")
                             ?? GetQueryValue(absolute.Query, "id"), out _))
        {
            return linkUrl;
        }

        if (!TryParseRelativeDocumentLink(linkUrl, out var documentType, out var documentId))
        {
            var baseUrl = appOptions.Value.FrontendBaseUrl.TrimEnd('/');
            return linkUrl.StartsWith('/') ? $"{baseUrl}{linkUrl}" : $"{baseUrl}/{linkUrl}";
        }

        return BuildDocumentUrl(documentType, documentId);
    }

    public string BuildDocumentUrl(string documentType, Guid documentId) =>
        BuildDocumentUrl(documentType, documentId.ToString("D"));

    public string BuildDocumentUrl(string documentType, string documentId)
    {
        var options = appOptions.Value;
        documentId = documentId.Trim();

        var formPageUrl = documentType == DocumentTypes.DefectAct
            ? options.DefectActPageUrl
            : options.PurchaseRequestPageUrl;

        if (!string.IsNullOrWhiteSpace(formPageUrl))
            return SetDocumentQuery(formPageUrl!, documentType, documentId, includeDocType: false);

        if (!string.IsNullOrWhiteSpace(options.ListsPageUrl))
            return SetDocumentQuery(options.ListsPageUrl!, documentType, documentId, includeDocType: true);

        var baseUrl = options.FrontendBaseUrl.TrimEnd('/');
        if (LooksLikeSharePoint(baseUrl))
            return SetDocumentQuery(baseUrl, documentType, documentId, includeDocType: true);

        var path = documentType == DocumentTypes.DefectAct
            ? $"/defect-acts/{documentId}"
            : $"/purchase-requests/{documentId}";
        return $"{baseUrl}{path}";
    }

    private static bool TryParseRelativeDocumentLink(
        string linkUrl, out string documentType, out string documentId)
    {
        documentType = "";
        documentId = "";

        var defectMatch = DefectActLink().Match(linkUrl);
        if (defectMatch.Success)
        {
            documentType = DocumentTypes.DefectAct;
            documentId = defectMatch.Groups["id"].Value;
            return Guid.TryParse(documentId, out _);
        }

        var purchaseMatch = PurchaseRequestLink().Match(linkUrl);
        if (purchaseMatch.Success)
        {
            documentType = DocumentTypes.PurchaseRequest;
            documentId = purchaseMatch.Groups["id"].Value;
            return Guid.TryParse(documentId, out _);
        }

        return false;
    }

    private static string SetDocumentQuery(
        string pageUrl, string documentType, string documentId, bool includeDocType)
    {
        var trimmed = pageUrl.Trim();
        var hashIndex = trimmed.IndexOf('#');
        var hash = hashIndex >= 0 ? trimmed[hashIndex..] : "";
        var withoutHash = hashIndex >= 0 ? trimmed[..hashIndex] : trimmed;

        var qIndex = withoutHash.IndexOf('?');
        var path = qIndex >= 0 ? withoutHash[..qIndex] : withoutHash;
        var existingQuery = qIndex >= 0 ? withoutHash[(qIndex + 1)..] : "";

        var pairs = ParseQuery(existingQuery)
            .Where(p => !IdParamNames.Contains(p.Key)
                        && !(includeDocType && p.Key.Equals("docType", StringComparison.OrdinalIgnoreCase))
                        && !(includeDocType && p.Key.Equals("documentType", StringComparison.OrdinalIgnoreCase))
                        && !(includeDocType && p.Key.Equals("type", StringComparison.OrdinalIgnoreCase)))
            .ToList();

        if (includeDocType)
            pairs.Add(new KeyValuePair<string, string>("docType", documentType));

        pairs.Add(new KeyValuePair<string, string>("documentId", documentId));
        pairs.Add(new KeyValuePair<string, string>("DocId", documentId));

        var sb = new StringBuilder(path);
        sb.Append('?');
        for (var i = 0; i < pairs.Count; i++)
        {
            if (i > 0) sb.Append('&');
            sb.Append(Uri.EscapeDataString(pairs[i].Key));
            sb.Append('=');
            sb.Append(Uri.EscapeDataString(pairs[i].Value));
        }

        sb.Append(hash);
        return sb.ToString();
    }

    private static List<KeyValuePair<string, string>> ParseQuery(string query)
    {
        var result = new List<KeyValuePair<string, string>>();
        if (string.IsNullOrWhiteSpace(query)) return result;

        foreach (var part in query.Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var eq = part.IndexOf('=');
            if (eq < 0)
            {
                result.Add(new KeyValuePair<string, string>(Uri.UnescapeDataString(part), ""));
                continue;
            }

            var key = Uri.UnescapeDataString(part[..eq]);
            var value = Uri.UnescapeDataString(part[(eq + 1)..]);
            if (!string.IsNullOrEmpty(key))
                result.Add(new KeyValuePair<string, string>(key, value));
        }

        return result;
    }

    private static string? GetQueryValue(string query, string name)
    {
        foreach (var pair in ParseQuery(query.TrimStart('?')))
        {
            if (pair.Key.Equals(name, StringComparison.OrdinalIgnoreCase))
                return pair.Value;
        }
        return null;
    }

    private static bool LooksLikeSharePoint(string url) =>
        url.Contains("sharepoint.com", StringComparison.OrdinalIgnoreCase);

    [GeneratedRegex(@"^/defect-acts/(?<id>[^/?#]+)", RegexOptions.IgnoreCase)]
    private static partial Regex DefectActLink();

    [GeneratedRegex(@"^/purchase-requests/(?<id>[^/?#]+)", RegexOptions.IgnoreCase)]
    private static partial Regex PurchaseRequestLink();
}
