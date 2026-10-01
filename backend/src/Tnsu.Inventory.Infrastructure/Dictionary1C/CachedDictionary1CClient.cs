using System.Text.Json;
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

    public Task<IReadOnlyList<StockBalanceDto>> GetStockBalancesAsync(string? search, CancellationToken ct) =>
        cache.GetOrLoadAsync(
            $"1c:stock:{NormalizeKey(search)}",
            (sp, c) => sp.GetRequiredService<HttpDictionary1CClient>().GetStockBalancesAsync(search, c),
            ct);

    public Task<JsonElement> MatchNomenclatureAsync(JsonElement body, CancellationToken ct) =>
        ExecuteAsync((sp, c) => sp.GetRequiredService<HttpDictionary1CClient>().MatchNomenclatureAsync(body, c), ct);

    public Task<JsonElement> GetNomenclatureCatalogAsync(
        string? search, string? groupName, string? nomenclatureType, int page, int pageSize, CancellationToken ct) =>
        ExecuteAsync(
            (sp, c) => sp.GetRequiredService<HttpDictionary1CClient>()
                .GetNomenclatureCatalogAsync(search, groupName, nomenclatureType, page, pageSize, c),
            ct);

    public Task<JsonElement> GetNomenclatureFiltersAsync(CancellationToken ct) =>
        ExecuteAsync((sp, c) => sp.GetRequiredService<HttpDictionary1CClient>().GetNomenclatureFiltersAsync(c), ct);

    private async Task<T> ExecuteAsync<T>(
        Func<IServiceProvider, CancellationToken, Task<T>> factory, CancellationToken ct)
    {
        using var scope = cache.CreateScope();
        return await factory(scope.ServiceProvider, ct);
    }

    private static string NormalizeKey(string? search) =>
        (search ?? string.Empty).Trim().ToLowerInvariant();
}
