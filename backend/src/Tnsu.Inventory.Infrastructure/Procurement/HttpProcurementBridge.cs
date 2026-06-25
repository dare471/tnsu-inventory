using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Domain.Entities;

namespace Tnsu.Inventory.Infrastructure.Procurement;

public sealed class HttpProcurementBridge(
    HttpClient http,
    IOptions<ProcurementOptions> options,
    ILogger<HttpProcurementBridge> logger) : IProcurementBridge
{
    public async Task<string?> SubmitOrderAsync(PurchaseRequest request, string orderNumber, CancellationToken ct)
    {
        var baseUrl = options.Value.BaseUrl?.TrimEnd('/');
        if (string.IsNullOrWhiteSpace(baseUrl))
            return $"local:{orderNumber}";

        try
        {
            var payload = new
            {
                externalNumber = orderNumber,
                purchaseRequestId = request.Id,
                purchaseRequestNumber = request.Number,
                projectId = request.ProjectId,
                projectCode = request.ProjectCode,
                estimatedAmount = request.EstimatedAmount,
                lines = request.Lines.Select(l => new
                {
                    l.LineNo, l.Name, l.CatalogNumber, l.Quantity, l.Unit,
                    l.EstimatedUnitPrice, l.EstimatedAmount
                })
            };

            using var response = await http.PostAsJsonAsync($"{baseUrl}/api/supplier-orders", payload, ct);
            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning("Procurement API returned {Status}", response.StatusCode);
                return $"pending:{orderNumber}";
            }

            var body = await response.Content.ReadFromJsonAsync<SubmitResponse>(ct);
            return body?.Id ?? orderNumber;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Procurement API failed for {OrderNumber}", orderNumber);
            return $"pending:{orderNumber}";
        }
    }

    private sealed class SubmitResponse { public string? Id { get; set; } }
}

public sealed class LocalProcurementBridge : IProcurementBridge
{
    public Task<string?> SubmitOrderAsync(PurchaseRequest request, string orderNumber, CancellationToken ct) =>
        Task.FromResult<string?>($"local:{orderNumber}");
}
