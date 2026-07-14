using System.Collections.Concurrent;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Tnsu.Inventory.Application.Common.Interfaces;

namespace Tnsu.Inventory.Infrastructure.Storage;

public sealed class SharePointSparePartsCatalog(
    HttpClient http,
    IOptions<SharePointOptions> options,
    SharePointGraphTokenProvider tokenProvider,
    ILogger<SharePointSparePartsCatalog> logger) : ISparePartsCatalog
{
    private static readonly ConcurrentDictionary<string, (DateTimeOffset Expires, object Value)> Cache = new();
    private static readonly string[] NameHints =
        ["наименование тмц", "наименование", "тмц", "название", "запчаст", "материал", "номенклатур", "name", "title"];
    private static readonly string[] CatalogHints =
        ["каталог", "кат. №", "кат №", "артикул", "catalog", "part number", "partnumber"];
    private static readonly string[] CodeHints = ["код", "code", "номер позиции"];
    private static readonly string[] UnitHints = ["ед. изм", "ед изм", "единиц", "unit", "uom"];
    private static readonly string[] VehicleHints =
        ["нормализованн", "модель", "техник", "основн", "средств", "машин", "vehicle", "equipment"];
    private static readonly string[] GroupHints = ["группа", "group", "категор"];

    public async Task<IReadOnlyList<SparePartDto>> SearchAsync(
        string? vehicleName, string? search, CancellationToken ct)
    {
        var cfg = options.Value;
        if (string.IsNullOrWhiteSpace(cfg.SiteUrl) || string.IsNullOrWhiteSpace(cfg.SparePartsListName))
            return [];

        var token = await tokenProvider.GetAccessTokenAsync(ct);
        if (token is null)
        {
            logger.LogWarning("Spare parts catalog: no Graph token");
            return [];
        }

        try
        {
            var siteHost = new Uri(cfg.SiteUrl).Host;
            var sitePath = new Uri(cfg.SiteUrl).AbsolutePath.Trim('/');
            var siteId = await ResolveSiteIdAsync(siteHost, sitePath, token, ct);
            var listId = await ResolveListIdAsync(siteId, cfg.SparePartsListName, token, ct);
            var mapping = await ResolveFieldMappingAsync(siteId, listId, cfg, token, ct);
            var items = await LoadItemsAsync(siteId, listId, token, ct);

            IEnumerable<SparePartDto> query = items.Select(i => MapItem(i, mapping));
            var allMapped = query.ToList();

            if (!string.IsNullOrWhiteSpace(vehicleName) && mapping.VehicleField is not null)
            {
                var vn = vehicleName.Trim();
                var filtered = allMapped.Where(p =>
                    string.IsNullOrWhiteSpace(p.VehicleName) ||
                    p.VehicleName.Contains(vn, StringComparison.OrdinalIgnoreCase) ||
                    vn.Contains(p.VehicleName, StringComparison.OrdinalIgnoreCase)).ToList();
                // Если по технике ничего не нашлось — показываем весь справочник (имена техники могут не совпадать 1:1).
                query = filtered.Count > 0 ? filtered : allMapped;
            }
            else
            {
                query = allMapped;
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim();
                query = query.Where(p =>
                    p.Name.Contains(s, StringComparison.OrdinalIgnoreCase) ||
                    (p.CatalogNumber?.Contains(s, StringComparison.OrdinalIgnoreCase) ?? false) ||
                    (p.Code?.Contains(s, StringComparison.OrdinalIgnoreCase) ?? false));
            }

            return query
                .Where(p => !string.IsNullOrWhiteSpace(p.Name))
                .OrderBy(p => p.Name)
                .Take(100)
                .ToList();
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Spare parts catalog load failed");
            return [];
        }
    }

    private static async Task<T> GetOrAddCacheAsync<T>(string key, TimeSpan ttl, Func<Task<T>> factory)
    {
        if (Cache.TryGetValue(key, out var entry) && entry.Expires > DateTimeOffset.UtcNow && entry.Value is T typed)
            return typed;
        var value = await factory();
        Cache[key] = (DateTimeOffset.UtcNow.Add(ttl), value!);
        return value;
    }

    private async Task<string> ResolveSiteIdAsync(string host, string path, string token, CancellationToken ct)
    {
        return await GetOrAddCacheAsync($"sp-site:{host}:{path}", TimeSpan.FromHours(6), async () =>
        {
            using var req = new HttpRequestMessage(HttpMethod.Get,
                $"https://graph.microsoft.com/v1.0/sites/{host}:/{path}");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            using var res = await http.SendAsync(req, ct);
            res.EnsureSuccessStatusCode();
            var json = await res.Content.ReadFromJsonAsync<IdResponse>(ct);
            return json?.Id ?? throw new InvalidOperationException("SharePoint site not found");
        });
    }

    private async Task<string> ResolveListIdAsync(string siteId, string listName, string token, CancellationToken ct)
    {
        return await GetOrAddCacheAsync($"sp-list:{siteId}:{listName}", TimeSpan.FromHours(6), async () =>
        {
            using var req = new HttpRequestMessage(HttpMethod.Get,
                $"https://graph.microsoft.com/v1.0/sites/{siteId}/lists?$select=id,displayName,name,webUrl");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            using var res = await http.SendAsync(req, ct);
            res.EnsureSuccessStatusCode();
            var json = await res.Content.ReadFromJsonAsync<ListCollection>(ct);
            var list = json?.Value?.FirstOrDefault(l =>
                string.Equals(l.DisplayName, listName, StringComparison.OrdinalIgnoreCase) ||
                string.Equals(l.Name, listName, StringComparison.OrdinalIgnoreCase) ||
                (l.WebUrl?.Contains($"/{listName}", StringComparison.OrdinalIgnoreCase) ?? false))
                ?? throw new InvalidOperationException($"SharePoint list '{listName}' not found");
            return list.Id!;
        });
    }

    private async Task<FieldMapping> ResolveFieldMappingAsync(
        string siteId, string listId, SharePointOptions cfg, string token, CancellationToken ct)
    {
        return await GetOrAddCacheAsync($"sp-fields:{listId}", TimeSpan.FromHours(1), async () =>
        {
            using var req = new HttpRequestMessage(HttpMethod.Get,
                $"https://graph.microsoft.com/v1.0/sites/{siteId}/lists/{listId}/columns?$select=name,displayName");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            using var res = await http.SendAsync(req, ct);
            res.EnsureSuccessStatusCode();
            var json = await res.Content.ReadFromJsonAsync<ColumnCollection>(ct);
            var cols = json?.Value ?? [];

            string? Pick(string? configured, string[] hints, string? fallback = null)
            {
                if (!string.IsNullOrWhiteSpace(configured))
                    return configured;
                // Сначала по приоритету подсказок (иначе Title часто перебивает «Наименование ТМЦ»).
                foreach (var hint in hints)
                {
                    foreach (var col in cols)
                    {
                        var display = col.DisplayName ?? "";
                        var name = col.Name ?? "";
                        if (display.Contains(hint, StringComparison.OrdinalIgnoreCase) ||
                            name.Contains(hint, StringComparison.OrdinalIgnoreCase))
                            return name;
                    }
                }
                return fallback;
            }

            var mapping = new FieldMapping(
                Pick(cfg.SparePartsNameField, NameHints, "Title") ?? "Title",
                Pick(cfg.SparePartsCatalogNumberField, CatalogHints),
                Pick(cfg.SparePartsCodeField, CodeHints),
                Pick(cfg.SparePartsUnitField, UnitHints),
                Pick(cfg.SparePartsVehicleField, VehicleHints),
                Pick(cfg.SparePartsGroupField, GroupHints));

            logger.LogInformation(
                "Spare parts field map: name={Name}, unit={Unit}, vehicle={Vehicle}, group={Group}",
                mapping.NameField, mapping.UnitField, mapping.VehicleField, mapping.GroupField);
            return mapping;
        });
    }

    private async Task<List<JsonElement>> LoadItemsAsync(
        string siteId, string listId, string token, CancellationToken ct)
    {
        return await GetOrAddCacheAsync($"sp-items:{listId}", TimeSpan.FromMinutes(10), async () =>
        {
            var items = new List<JsonElement>();
            var url =
                $"https://graph.microsoft.com/v1.0/sites/{siteId}/lists/{listId}/items?$expand=fields&$top=200";

            while (!string.IsNullOrWhiteSpace(url))
            {
                using var req = new HttpRequestMessage(HttpMethod.Get, url);
                req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                using var res = await http.SendAsync(req, ct);
                res.EnsureSuccessStatusCode();
                await using var stream = await res.Content.ReadAsStreamAsync(ct);
                using var doc = await JsonDocument.ParseAsync(stream, cancellationToken: ct);
                var root = doc.RootElement;
                if (root.TryGetProperty("value", out var value) && value.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in value.EnumerateArray())
                        items.Add(item.Clone());
                }

                url = root.TryGetProperty("@odata.nextLink", out var next) ? next.GetString() : null;
                if (items.Count >= 2000) break;
            }

            return items;
        });
    }

    private static SparePartDto MapItem(JsonElement item, FieldMapping mapping)
    {
        var id = item.TryGetProperty("id", out var idEl) ? idEl.GetString() ?? "" : "";
        if (!item.TryGetProperty("fields", out var fields))
            return new SparePartDto(id, "", null, null, null, null, null);

        return new SparePartDto(
            id,
            ReadString(fields, mapping.NameField) ?? "",
            ReadString(fields, mapping.CatalogField),
            ReadString(fields, mapping.CodeField),
            ReadString(fields, mapping.UnitField),
            ReadString(fields, mapping.VehicleField),
            ReadString(fields, mapping.GroupField));
    }

    private static string? ReadString(JsonElement fields, string? name)
    {
        if (string.IsNullOrWhiteSpace(name)) return null;
        if (!fields.TryGetProperty(name, out var el)) return null;
        return el.ValueKind switch
        {
            JsonValueKind.String => el.GetString()?.Trim(),
            JsonValueKind.Number => el.ToString(),
            JsonValueKind.True => "true",
            JsonValueKind.False => "false",
            JsonValueKind.Object when el.TryGetProperty("LookupValue", out var lv) => lv.GetString()?.Trim(),
            JsonValueKind.Object when el.TryGetProperty("Title", out var t) => t.GetString()?.Trim(),
            _ => el.ToString()?.Trim()
        };
    }

    private sealed record FieldMapping(
        string NameField,
        string? CatalogField,
        string? CodeField,
        string? UnitField,
        string? VehicleField,
        string? GroupField);

    private sealed class IdResponse { public string? Id { get; set; } }
    private sealed class ListCollection { public List<ListInfo>? Value { get; set; } }
    private sealed class ListInfo
    {
        public string? Id { get; set; }
        public string? DisplayName { get; set; }
        public string? Name { get; set; }
        public string? WebUrl { get; set; }
    }
    private sealed class ColumnCollection { public List<ColumnInfo>? Value { get; set; } }
    private sealed class ColumnInfo
    {
        public string? Name { get; set; }
        public string? DisplayName { get; set; }
    }
}

public sealed class EmptySparePartsCatalog : ISparePartsCatalog
{
    public Task<IReadOnlyList<SparePartDto>> SearchAsync(
        string? vehicleName, string? search, CancellationToken ct) =>
        Task.FromResult<IReadOnlyList<SparePartDto>>([]);
}
