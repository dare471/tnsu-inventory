using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Tnsu.Inventory.Application.Common.Interfaces;

namespace Tnsu.Inventory.Infrastructure.Dictionary1C;

public sealed class HttpDictionary1CClient(
    HttpClient http,
    IOptions<Dictionary1COptions> options,
    Dictionary1CTokenProvider tokenProvider,
    ILogger<HttpDictionary1CClient> logger) : IDictionary1CClient
{
    public async Task<IReadOnlyList<ProjectDto>> GetProjectsAsync(CancellationToken ct)
    {
        var rows = await GetAsync<ProjectApiRow>("/Dictionary/Projects1C", ct);
        return rows
            .Select(r => Guid.TryParse(r.Id, out var id)
                ? new ProjectDto(id, r.Code ?? "", r.ProjectName ?? "")
                : null)
            .Where(x => x is not null)
            .Cast<ProjectDto>()
            .ToList();
    }

    public async Task<IReadOnlyList<VehicleDto>> GetVehiclesAsync(CancellationToken ct)
    {
        var rows = await GetAsync<VehicleApiRow>("/Dictionary/vehicles", ct);
        return rows
            .Select(r => Guid.TryParse(r.Id, out var id)
                ? new VehicleDto(id, r.GroupName ?? "", r.Name ?? "", r.StateNumber ?? "",
                    r.VinCode ?? "", r.FullPath ?? "")
                : null)
            .Where(x => x is not null)
            .Cast<VehicleDto>()
            .ToList();
    }

    public async Task<IReadOnlyList<ProjectSectionDto>> GetProjectSectionsAsync(Guid projectId, CancellationToken ct)
    {
        var rows = await GetAsync<SectionApiRow>($"/Dictionary/ProjectSections?projectId={projectId}", ct);
        return rows.Select(r => new ProjectSectionDto(
            Guid.TryParse(r.Id, out var id) ? id : Guid.Empty,
            projectId, r.Code ?? "", r.Name ?? ""))
            .Where(x => x.Id != Guid.Empty).ToList();
    }

    public async Task<IReadOnlyList<WorkTypeDto>> GetWorkTypesAsync(CancellationToken ct)
    {
        var rows = await GetAsync<NamedCodeRow>("/Dictionary/WorkTypes", ct);
        return rows.Select(r => new WorkTypeDto(
            Guid.TryParse(r.Id, out var id) ? id : Guid.NewGuid(),
            r.Code ?? "", r.Name ?? "")).ToList();
    }

    public async Task<IReadOnlyList<NomenclatureDto>> GetNomenclatureAsync(string? search, CancellationToken ct)
    {
        var path = string.IsNullOrWhiteSpace(search)
            ? "/Dictionary/Nomenclature"
            : $"/Dictionary/Nomenclature?search={Uri.EscapeDataString(search)}";
        var rows = await GetAsync<NomenclatureApiRow>(path, ct);
        return rows.Select(r => new NomenclatureDto(
            Guid.TryParse(r.Id, out var id) ? id : Guid.NewGuid(),
            r.Code ?? "", r.Name ?? "", r.Unit)).ToList();
    }

    public async Task<IReadOnlyList<ContractorDto>> GetContractorsAsync(string? search, CancellationToken ct)
    {
        var path = string.IsNullOrWhiteSpace(search)
            ? "/Dictionary/Contractors"
            : $"/Dictionary/Contractors?search={Uri.EscapeDataString(search)}";
        var rows = await GetAsync<ContractorApiRow>(path, ct);
        return rows.Select(r => new ContractorDto(
            Guid.TryParse(r.Id, out var id) ? id : Guid.NewGuid(),
            r.Code ?? "", r.Name ?? "", r.Inn)).ToList();
    }

    private async Task<List<T>> GetAsync<T>(string path, CancellationToken ct)
    {
        var baseUrl = options.Value.BaseUrl.TrimEnd('/');
        if (string.IsNullOrWhiteSpace(baseUrl))
            return [];

        try
        {
            var token = await tokenProvider.GetAccessTokenAsync(ct);
            using var request = new HttpRequestMessage(HttpMethod.Get, $"{baseUrl}{path}");
            if (token is not null)
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            using var response = await http.SendAsync(request, ct);
            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning("Dictionary API {Path} returned {Status}", path, response.StatusCode);
                return GetDemoFallback<T>(path);
            }

            var data = await response.Content.ReadFromJsonAsync<List<T>>(ct);
            return data ?? [];
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Dictionary API {Path} failed", path);
            return GetDemoFallback<T>(path);
        }
    }

    private static List<T> GetDemoFallback<T>(string path)
    {
        if (typeof(T) == typeof(ProjectApiRow))
            return
            [
                (T)(object)new ProjectApiRow
                {
                    Id = "ec3c9aa7-29ef-4725-11ee-50903dd59e16",
                    Code = "БК0000001",
                    ProjectName = "Строительство завода по производству меди Беркара ARX-0015-01-21"
                }
            ];

        if (typeof(T) == typeof(VehicleApiRow))
            return
            [
                (T)(object)new VehicleApiRow
                {
                    Id = "5000b296-4856-b5c4-11ed-97fcfbcaa218",
                    GroupName = "МАЛАЯ МЕХАНИЗАЦИЯ",
                    Name = "ГЕНЕРАТОР ДИЗЕЛЬНЫЙ AKSA APD145C / БК0001037",
                    StateNumber = "БК0001037",
                    VinCode = "",
                    FullPath = "МАЛАЯ МЕХАНИЗАЦИЯ\\Малая механизация Жезказган"
                }
            ];

        if (typeof(T) == typeof(SectionApiRow))
            return [(T)(object)new SectionApiRow { Id = Guid.NewGuid().ToString(), Code = "Р-01", Name = "Механизация" }];

        if (typeof(T) == typeof(NamedCodeRow))
            return [(T)(object)new NamedCodeRow { Id = Guid.NewGuid().ToString(), Code = "РМ-01", Name = "Ремонт техники" }];

        if (typeof(T) == typeof(NomenclatureApiRow))
            return [(T)(object)new NomenclatureApiRow { Id = Guid.NewGuid().ToString(), Code = "НМ-0001", Name = "Масло моторное 15W-40", Unit = "л" }];

        if (typeof(T) == typeof(ContractorApiRow))
            return [(T)(object)new ContractorApiRow { Id = Guid.NewGuid().ToString(), Code = "К-001", Name = "ТОО Поставщик демо", Inn = "123456789012" }];

        return [];
    }

    private sealed class ProjectApiRow
    {
        [JsonPropertyName("Id")] public string? Id { get; set; }
        [JsonPropertyName("Code")] public string? Code { get; set; }
        [JsonPropertyName("ProjectName")] public string? ProjectName { get; set; }
    }

    private sealed class VehicleApiRow
    {
        [JsonPropertyName("id")] public string? Id { get; set; }
        [JsonPropertyName("GroupName")] public string? GroupName { get; set; }
        [JsonPropertyName("Name")] public string? Name { get; set; }
        [JsonPropertyName("StateNumber")] public string? StateNumber { get; set; }
        [JsonPropertyName("VINCode")] public string? VinCode { get; set; }
        [JsonPropertyName("FullPath")] public string? FullPath { get; set; }
    }

    private sealed class SectionApiRow
    {
        [JsonPropertyName("Id")] public string? Id { get; set; }
        [JsonPropertyName("Code")] public string? Code { get; set; }
        [JsonPropertyName("Name")] public string? Name { get; set; }
    }

    private sealed class NamedCodeRow
    {
        [JsonPropertyName("Id")] public string? Id { get; set; }
        [JsonPropertyName("Code")] public string? Code { get; set; }
        [JsonPropertyName("Name")] public string? Name { get; set; }
    }

    private sealed class NomenclatureApiRow
    {
        [JsonPropertyName("Id")] public string? Id { get; set; }
        [JsonPropertyName("Code")] public string? Code { get; set; }
        [JsonPropertyName("Name")] public string? Name { get; set; }
        [JsonPropertyName("Unit")] public string? Unit { get; set; }
    }

    private sealed class ContractorApiRow
    {
        [JsonPropertyName("Id")] public string? Id { get; set; }
        [JsonPropertyName("Code")] public string? Code { get; set; }
        [JsonPropertyName("Name")] public string? Name { get; set; }
        [JsonPropertyName("Inn")] public string? Inn { get; set; }
    }
}
