using MediatR;
using Tnsu.Inventory.Application.Common.Interfaces;

namespace Tnsu.Inventory.Application.Dictionaries.Queries;

public sealed record ListProjectSectionsQuery(Guid ProjectId) : IRequest<IReadOnlyList<ProjectSectionDto>>;
public sealed class ListProjectSectionsHandler(IDictionary1CClient client)
    : IRequestHandler<ListProjectSectionsQuery, IReadOnlyList<ProjectSectionDto>>
{
    public Task<IReadOnlyList<ProjectSectionDto>> Handle(ListProjectSectionsQuery q, CancellationToken ct) =>
        client.GetProjectSectionsAsync(q.ProjectId, ct);
}

public sealed record ListWorkTypesQuery() : IRequest<IReadOnlyList<WorkTypeDto>>;
public sealed class ListWorkTypesHandler(IDictionary1CClient client)
    : IRequestHandler<ListWorkTypesQuery, IReadOnlyList<WorkTypeDto>>
{
    public Task<IReadOnlyList<WorkTypeDto>> Handle(ListWorkTypesQuery q, CancellationToken ct) =>
        client.GetWorkTypesAsync(ct);
}

public sealed record ListNomenclatureQuery(string? Search) : IRequest<IReadOnlyList<NomenclatureDto>>;
public sealed class ListNomenclatureHandler(IDictionary1CClient client)
    : IRequestHandler<ListNomenclatureQuery, IReadOnlyList<NomenclatureDto>>
{
    public Task<IReadOnlyList<NomenclatureDto>> Handle(ListNomenclatureQuery q, CancellationToken ct) =>
        client.GetNomenclatureAsync(q.Search, ct);
}

public sealed record ListContractorsQuery(string? Search) : IRequest<IReadOnlyList<ContractorDto>>;
public sealed class ListContractorsHandler(IDictionary1CClient client)
    : IRequestHandler<ListContractorsQuery, IReadOnlyList<ContractorDto>>
{
    public Task<IReadOnlyList<ContractorDto>> Handle(ListContractorsQuery q, CancellationToken ct) =>
        client.GetContractorsAsync(q.Search, ct);
}

public sealed record ListSparePartsQuery(string? VehicleName, string? Search)
    : IRequest<IReadOnlyList<SparePartDto>>;

public sealed class ListSparePartsHandler(ISparePartsCatalog catalog)
    : IRequestHandler<ListSparePartsQuery, IReadOnlyList<SparePartDto>>
{
    public Task<IReadOnlyList<SparePartDto>> Handle(ListSparePartsQuery q, CancellationToken ct) =>
        catalog.SearchAsync(q.VehicleName, q.Search, ct);
}
