using MediatR;
using Microsoft.AspNetCore.Mvc;
using Tnsu.Inventory.Application.Approvals.Commands;
using Tnsu.Inventory.Application.Attachments;
using Tnsu.Inventory.Application.DefectActs;
using Tnsu.Inventory.Application.DefectActs.Commands;
using Tnsu.Inventory.Application.Dictionaries.Queries;
using Tnsu.Inventory.Application.Procurement;
using Tnsu.Inventory.Application.PurchaseRequests;
using Tnsu.Inventory.Application.PurchaseRequests.Commands;
using Tnsu.Inventory.Domain;

namespace Tnsu.Inventory.Api.Endpoints;

public static class ApiEndpoints
{
    public static IEndpointRouteBuilder MapInventoryEndpoints(this IEndpointRouteBuilder app)
    {
        var api = app.MapGroup("/api").RequireAuthorization();

        api.MapGet("/dictionaries/projects", async (IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListProjectsQuery(), ct)));
        api.MapGet("/dictionaries/vehicles", async (IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListVehiclesQuery(), ct)));
        api.MapGet("/dictionaries/project-sections", async ([FromQuery] Guid projectId, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListProjectSectionsQuery(projectId), ct)));
        api.MapGet("/dictionaries/work-types", async (IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListWorkTypesQuery(), ct)));
        api.MapGet("/dictionaries/nomenclature", async ([FromQuery] string? search, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListNomenclatureQuery(search), ct)));
        api.MapGet("/dictionaries/contractors", async ([FromQuery] string? search, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListContractorsQuery(search), ct)));

        var defects = api.MapGroup("/defect-acts");
        defects.MapGet("", async ([FromQuery] string? search, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListDefectActsQuery(search), ct)));
        defects.MapPost("", async ([FromBody] CreateDefectActRequest body, IMediator m, CancellationToken ct) =>
        {
            var dto = await m.Send(new CreateDefectActCommand(body), ct);
            return Results.Created($"/api/defect-acts/{dto.Id}", dto);
        });
        defects.MapGet("/{id:guid}", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new GetDefectActQuery(id), ct)));
        defects.MapGet("/{id:guid}/print", async (Guid id, IMediator m, CancellationToken ct) =>
        {
            var html = await m.Send(new GetDefectActPrintQuery(id), ct);
            return Results.Content(html, "text/html; charset=utf-8");
        });
        defects.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateDefectActRequest body, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new UpdateDefectActCommand(id, body), ct)));
        defects.MapPost("/{id:guid}/submit", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new SubmitDefectActCommand(id), ct)));
        defects.MapPost("/{id:guid}/cancel", async (Guid id, [FromBody] CancelRequest body, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new CancelDefectActCommand(id, body.Comment), ct)));
        defects.MapGet("/{id:guid}/approvals", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new GetDefectActApprovalsQuery(id), ct)));
        defects.MapPost("/{id:guid}/purchase-request", async (Guid id, IMediator m, CancellationToken ct) =>
        {
            var dto = await m.Send(new CreatePurchaseFromDefectActCommand(id), ct);
            return Results.Created($"/api/purchase-requests/{dto.Id}", dto);
        });

        var purchases = api.MapGroup("/purchase-requests");
        purchases.MapGet("", async ([FromQuery] string? search, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListPurchaseRequestsQuery(search), ct)));
        purchases.MapPost("", async ([FromBody] CreatePurchaseRequestRequest body, IMediator m, CancellationToken ct) =>
        {
            var dto = await m.Send(new CreatePurchaseRequestCommand(body), ct);
            return Results.Created($"/api/purchase-requests/{dto.Id}", dto);
        });
        purchases.MapGet("/{id:guid}", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new GetPurchaseRequestQuery(id), ct)));
        purchases.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdatePurchaseRequestRequest body, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new UpdatePurchaseRequestCommand(id, body), ct)));
        purchases.MapPost("/{id:guid}/submit", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new SubmitPurchaseRequestCommand(id), ct)));
        purchases.MapPost("/{id:guid}/cancel", async (Guid id, [FromBody] CancelRequest body, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new CancelPurchaseRequestCommand(id, body.Comment), ct)));
        purchases.MapGet("/{id:guid}/approvals", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new GetPurchaseRequestApprovalsQuery(id), ct)));
        purchases.MapGet("/{id:guid}/attachments", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListPurchaseAttachmentsQuery(id), ct)));
        purchases.MapPost("/{id:guid}/attachments", async (
            Guid id, HttpRequest request, IMediator m, CancellationToken ct) =>
        {
            if (!request.HasFormContentType)
                return Results.BadRequest(new { message = "Ожидается multipart/form-data" });

            var form = await request.ReadFormAsync(ct);
            var file = form.Files.FirstOrDefault();
            if (file is null) return Results.BadRequest(new { message = "Файл не передан" });

            var category = form["category"].FirstOrDefault() ?? AttachmentCategories.General;
            await using var stream = file.OpenReadStream();
            var dto = await m.Send(new UploadPurchaseAttachmentCommand(
                id, category, file.FileName, file.ContentType, stream), ct);
            return Results.Created($"/api/attachments/{dto.Id}", dto);
        }).DisableAntiforgery();
        purchases.MapPost("/{id:guid}/assign-executor", async (Guid id, [FromBody] AssignExecutorRequest body, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new AssignExecutorCommand(id, body), ct)));
        purchases.MapPost("/{id:guid}/start", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new StartPurchaseExecutionCommand(id), ct)));
        purchases.MapPost("/{id:guid}/close", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ClosePurchaseRequestCommand(id), ct)));
        purchases.MapPost("/{id:guid}/supplier-order", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new CreateSupplierOrderCommand(id), ct)));
        purchases.MapGet("/{id:guid}/supplier-order", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new GetSupplierOrderByPurchaseQuery(id), ct)));

        api.MapGet("/attachments/{id:guid}", async (Guid id, IMediator m, CancellationToken ct) =>
        {
            var (stream, fileName, contentType) = await m.Send(new DownloadAttachmentQuery(id), ct);
            return Results.File(stream, contentType, fileName);
        });

        var approvals = api.MapGroup("/approvals");
        approvals.MapGet("/inbox", async (IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new GetApprovalInboxQuery(), ct)));
        approvals.MapPost("/{stepId:guid}/approve", async (Guid stepId, [FromBody] DecisionRequest? body, IMediator m, CancellationToken ct) =>
        {
            await m.Send(new ApproveStepCommand(stepId, body?.Comment, body?.DigitalSignatureRef), ct);
            return Results.NoContent();
        });
        approvals.MapPost("/{stepId:guid}/return", async (Guid stepId, [FromBody] DecisionRequest body, IMediator m, CancellationToken ct) =>
        {
            await m.Send(new ReturnStepCommand(stepId, body.Comment ?? ""), ct);
            return Results.NoContent();
        });
        approvals.MapPost("/{stepId:guid}/reject", async (Guid stepId, [FromBody] DecisionRequest body, IMediator m, CancellationToken ct) =>
        {
            await m.Send(new RejectStepCommand(stepId, body.Comment ?? ""), ct);
            return Results.NoContent();
        });

        return app;
    }
}

public sealed record CancelRequest(string Comment);
