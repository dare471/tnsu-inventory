using Microsoft.Extensions.DependencyInjection;
using Tnsu.Inventory.Application.Common.Interfaces;

namespace Tnsu.Inventory.Infrastructure.Dictionary1C;

public sealed class CachedZupEmployeeClient(DictionaryDataCache cache) : IZupEmployeeClient
{
    public Task<IReadOnlyList<ZupEmployeeDto>> ListEmployeesAsync(
        string employerCompany, CancellationToken ct) =>
        cache.GetOrLoadAsync(
            $"zup:employees:{employerCompany.Trim().ToLowerInvariant()}",
            (sp, c) => sp.GetRequiredService<HttpZupEmployeeClient>().ListEmployeesAsync(employerCompany, c),
            ct);
}
