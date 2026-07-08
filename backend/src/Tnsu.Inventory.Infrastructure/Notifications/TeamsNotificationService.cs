using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Tnsu.Inventory.Application.Common.Interfaces;

namespace Tnsu.Inventory.Infrastructure.Notifications;

public sealed class TeamsNotificationService(
    HttpClient http,
    IOptions<TeamsOptions> options,
    ILogger<TeamsNotificationService> logger)
{
    public async Task SendAdaptiveCardAsync(
        string title, string text, string actionUrl, IEnumerable<string>? mentionEmails, CancellationToken ct)
    {
        var webhook = options.Value.WebhookUrl;
        if (string.IsNullOrWhiteSpace(webhook)) return;

        var card = new
        {
            type = "message",
            attachments = new[]
            {
                new
                {
                    contentType = "application/vnd.microsoft.card.adaptive",
                    content = new
                    {
                        type = "AdaptiveCard",
                        version = "1.4",
                        body = new object[]
                        {
                            new { type = "TextBlock", text = title, weight = "Bolder", size = "Medium" },
                            new { type = "TextBlock", text, wrap = true }
                        },
                        actions = new[]
                        {
                            new { type = "Action.OpenUrl", title = "Открыть документ", url = actionUrl }
                        }
                    }
                }
            }
        };

        try
        {
            using var response = await http.PostAsJsonAsync(webhook, card, ct);
            if (!response.IsSuccessStatusCode)
                logger.LogWarning("Teams webhook returned {Status}", response.StatusCode);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Teams notification failed");
        }
    }
}

public sealed class CompositeNotificationService(
    SmtpNotificationService smtp,
    TeamsNotificationService teams) : INotificationService
{
    public async Task SendApprovalReminderAsync(ApprovalNotification n, CancellationToken ct)
    {
        await smtp.SendApprovalReminderAsync(n, ct);
        await teams.SendAdaptiveCardAsync(
            $"Напоминание: {n.DocumentNumber}",
            $"{n.DocumentNumber}: на согласовании {n.PendingWorkingDays} раб. дн.",
            n.LinkUrl, [n.RecipientEmail], ct);
    }

    public async Task SendEscalationAsync(ApprovalNotification n, CancellationToken ct)
    {
        await smtp.SendEscalationAsync(n, ct);
        var emails = new List<string> { n.RecipientEmail };
        if (!string.IsNullOrWhiteSpace(n.ManagerEmail)) emails.Add(n.ManagerEmail);
        if (!string.IsNullOrWhiteSpace(n.ChiefMechanicEmail)) emails.Add(n.ChiefMechanicEmail!);

        await teams.SendAdaptiveCardAsync(
            $"Эскалация: {n.DocumentNumber}",
            $"Не обработан {n.PendingWorkingDays} раб. дн. · {n.RecipientName}",
            n.LinkUrl, emails, ct);
    }

    public async Task SendAssignedForApprovalAsync(WorkflowNotification n, CancellationToken ct)
    {
        await smtp.SendAssignedForApprovalAsync(n, ct);
        await teams.SendAdaptiveCardAsync(
            $"На согласовании: {n.DocumentNumber}",
            n.DocumentNumber,
            n.LinkUrl,
            [n.RecipientEmail],
            ct);
    }

    public async Task SendApprovedAsync(WorkflowNotification n, CancellationToken ct)
    {
        await smtp.SendApprovedAsync(n, ct);
        await teams.SendAdaptiveCardAsync(
            $"Согласовано: {n.DocumentNumber}",
            n.DocumentNumber,
            n.LinkUrl,
            [n.InitiatorEmail],
            ct);
    }

    public async Task SendReturnedAsync(WorkflowNotification n, CancellationToken ct)
    {
        await smtp.SendReturnedAsync(n, ct);
        var text = string.IsNullOrWhiteSpace(n.Comment)
            ? $"{n.DocumentNumber} возвращён на доработку."
            : $"{n.DocumentNumber} возвращён на доработку. {n.Comment}";
        await teams.SendAdaptiveCardAsync(
            $"Возврат: {n.DocumentNumber}",
            text,
            n.LinkUrl,
            [n.InitiatorEmail],
            ct);
    }
}
