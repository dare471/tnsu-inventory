using MediatR;
using Tnsu.Inventory.Application.Common.Interfaces;

namespace Tnsu.Inventory.Application.Dictionaries.Queries;

public sealed record ListProjectsQuery() : IRequest<IReadOnlyList<ProjectDto>>;
public sealed class ListProjectsHandler(IDictionary1CClient client)
    : IRequestHandler<ListProjectsQuery, IReadOnlyList<ProjectDto>>
{
    public Task<IReadOnlyList<ProjectDto>> Handle(ListProjectsQuery q, CancellationToken ct) =>
        client.GetProjectsAsync(ct);
}

public sealed record ListVehiclesQuery() : IRequest<IReadOnlyList<VehicleDto>>;
public sealed class ListVehiclesHandler(IDictionary1CClient client)
    : IRequestHandler<ListVehiclesQuery, IReadOnlyList<VehicleDto>>
{
    public Task<IReadOnlyList<VehicleDto>> Handle(ListVehiclesQuery q, CancellationToken ct) =>
        client.GetVehiclesAsync(ct);
}
