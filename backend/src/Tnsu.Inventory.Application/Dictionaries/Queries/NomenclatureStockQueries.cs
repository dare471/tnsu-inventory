using System.Text.Json;
using MediatR;
using Tnsu.Inventory.Application.Common.Exceptions;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.Dictionaries.Queries;

public sealed record MatchNomenclatureQuery(JsonElement Body) : IRequest<JsonElement>;

public sealed class MatchNomenclatureHandler(IDictionary1CClient dictionaries, ICurrentUser currentUser)
    : IRequestHandler<MatchNomenclatureQuery, JsonElement>
{
    public Task<JsonElement> Handle(MatchNomenclatureQuery q, CancellationToken ct)
    {
        EnsureStockRole(currentUser);
        return Forward(() => dictionaries.MatchNomenclatureAsync(q.Body, ct));
    }

    internal static void EnsureStockRole(ICurrentUser currentUser)
    {
        if (!MechanizationRole.CanSearchStock(currentUser.Role))
            throw new ForbiddenException(
                "Искать складские остатки могут координатор складского хозяйства и инженер по планированию ТОиР.");
    }

    internal static async Task<JsonElement> Forward(Func<Task<JsonElement>> call)
    {
        try
        {
            return await call();
        }
        catch (InvalidOperationException ex)
        {
            throw new ValidationFailedException(ex.Message);
        }
    }
}

public sealed record NomenclatureCatalogQuery(
    string? Search,
    string? GroupName,
    string? NomenclatureType,
    int Page,
    int PageSize) : IRequest<JsonElement>;

public sealed class NomenclatureCatalogHandler(IDictionary1CClient dictionaries, ICurrentUser currentUser)
    : IRequestHandler<NomenclatureCatalogQuery, JsonElement>
{
    public Task<JsonElement> Handle(NomenclatureCatalogQuery q, CancellationToken ct)
    {
        MatchNomenclatureHandler.EnsureStockRole(currentUser);
        var page = q.Page < 1 ? 1 : q.Page;
        var pageSize = q.PageSize is < 1 or > 100 ? 25 : q.PageSize;
        return MatchNomenclatureHandler.Forward(() => dictionaries.GetNomenclatureCatalogAsync(
            q.Search, q.GroupName, q.NomenclatureType, page, pageSize, ct));
    }
}

public sealed record NomenclatureFiltersQuery : IRequest<JsonElement>;

public sealed class NomenclatureFiltersHandler(IDictionary1CClient dictionaries, ICurrentUser currentUser)
    : IRequestHandler<NomenclatureFiltersQuery, JsonElement>
{
    public Task<JsonElement> Handle(NomenclatureFiltersQuery q, CancellationToken ct)
    {
        MatchNomenclatureHandler.EnsureStockRole(currentUser);
        return MatchNomenclatureHandler.Forward(() => dictionaries.GetNomenclatureFiltersAsync(ct));
    }
}
