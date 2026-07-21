using Microsoft.Extensions.DependencyInjection;
using Tnsu.Inventory.Application.Common.Interfaces;

namespace Tnsu.Inventory.Infrastructure.Dictionary1C;

public sealed class CachedDictionary1CClient(DictionaryDataCache cache) : IDictionary1CClient
{
    public Task<IReadOnlyList<ProjectDto>> GetProjectsAsync(CancellationToken ct) =>
        cache.GetOrLoadAsync(
            "1c:projects",
            (sp, c) => sp.GetRequiredService<HttpDictionary1CClient>().GetProjectsAsync(c),
            ct);

    public Task<IReadOnlyList<VehicleDto>> GetVehiclesAsync(CancellationToken ct) =>
        cache.GetOrLoadAsync(
            "1c:vehicles",
            (sp, c) => sp.GetRequiredService<HttpDictionary1CClient>().GetVehiclesAsync(c),
            ct);

    public Task<IReadOnlyList<ProjectSectionDto>> GetProjectSectionsAsync(Guid projectId, CancellationToken ct) =>
        cache.GetOrLoadAsync(
            $"1c:sections:{projectId}",
            (sp, c) => sp.GetRequiredService<HttpDictionary1CClient>().GetProjectSectionsAsync(projectId, c),
            ct);

    public Task<IReadOnlyList<WorkTypeDto>> GetWorkTypesAsync(CancellationToken ct) =>
        cache.GetOrLoadAsync(
            "1c:work-types",
            (sp, c) => sp.GetRequiredService<HttpDictionary1CClient>().GetWorkTypesAsync(c),
            ct);

    public Task<IReadOnlyList<NomenclatureDto>> GetNomenclatureAsync(string? search, CancellationToken ct) =>
        cache.GetOrLoadAsync(
            $"1c:nomenclature:{NormalizeKey(search)}",
            (sp, c) => sp.GetRequiredService<HttpDictionary1CClient>().GetNomenclatureAsync(search, c),
            ct);

    public Task<IReadOnlyList<ContractorDto>> GetContractorsAsync(string? search, CancellationToken ct) =>
        cache.GetOrLoadAsync(
            $"1c:contractors:{NormalizeKey(search)}",
            (sp, c) => sp.GetRequiredService<HttpDictionary1CClient>().GetContractorsAsync(search, c),
            ct);

    private static string NormalizeKey(string? search) =>
        (search ?? string.Empty).Trim().ToLowerInvariant();
}
