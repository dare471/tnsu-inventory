using System.Net.Http.Json;
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
    TeamsNotificationService teams,
    PowerAutomateNotificationService powerAutomate,
    IOptions<NotificationsOptions> notificationsOptions,
    NotificationUrlResolver urlResolver,
    ILogger<CompositeNotificationService> logger) : INotificationService
{
    private bool UsePowerAutomate => notificationsOptions.Value.PowerAutomate.IsConfigured;

    private async Task<bool> TryPowerAutomateAsync(
        string email, string linkUrl, string status, string docNumber, CancellationToken ct)
    {
        if (!UsePowerAutomate) return false;
        var ok = await powerAutomate.SendAsync(email, linkUrl, status, docNumber, ct);
        if (!ok)
            logger.LogWarning(
                "Power Automate не доставил уведомление ({Status}, {Doc}). Fallback SMTP/Teams.",
                status, docNumber);
        return ok;
    }

    public async Task SendApprovalReminderAsync(ApprovalNotification n, CancellationToken ct)
    {
        if (await TryPowerAutomateAsync(
                n.RecipientEmail, n.LinkUrl, PowerAutomateNotificationStatus.Assigned, n.DocumentNumber, ct))
            return;

        await smtp.SendApprovalReminderAsync(n, ct);
        await teams.SendAdaptiveCardAsync(
            $"Напоминание: {n.DocumentNumber}",
            $"{n.DocumentNumber}: на согласовании {n.PendingWorkingDays} раб. дн.",
            urlResolver.ToAbsolute(n.LinkUrl), [n.RecipientEmail], ct);
    }

    public async Task SendEscalationAsync(ApprovalNotification n, CancellationToken ct)
    {
        if (UsePowerAutomate)
        {
            var ok = await powerAutomate.SendAsync(
                n.RecipientEmail, n.LinkUrl, PowerAutomateNotificationStatus.Assigned, n.DocumentNumber, ct);

            if (!string.IsNullOrWhiteSpace(n.ManagerEmail))
            {
                ok = await powerAutomate.SendAsync(
                    n.ManagerEmail, n.LinkUrl, PowerAutomateNotificationStatus.Assigned, n.DocumentNumber, ct) || ok;
            }

            if (!string.IsNullOrWhiteSpace(n.ChiefMechanicEmail))
            {
                ok = await powerAutomate.SendAsync(
                    n.ChiefMechanicEmail!, n.LinkUrl, PowerAutomateNotificationStatus.Assigned, n.DocumentNumber, ct) || ok;
            }

            if (ok) return;
            logger.LogWarning("Power Automate escalation failed for {Doc}. Fallback SMTP/Teams.", n.DocumentNumber);
        }

        await smtp.SendEscalationAsync(n, ct);
        var emails = new List<string> { n.RecipientEmail };
        if (!string.IsNullOrWhiteSpace(n.ManagerEmail)) emails.Add(n.ManagerEmail);
        if (!string.IsNullOrWhiteSpace(n.ChiefMechanicEmail)) emails.Add(n.ChiefMechanicEmail!);

        await teams.SendAdaptiveCardAsync(
            $"Эскалация: {n.DocumentNumber}",
            $"Не обработан {n.PendingWorkingDays} раб. дн. · {n.RecipientName}",
            urlResolver.ToAbsolute(n.LinkUrl), emails, ct);
    }

    public async Task SendAssignedForApprovalAsync(WorkflowNotification n, CancellationToken ct)
    {
        if (await TryPowerAutomateAsync(
                n.RecipientEmail, n.LinkUrl, PowerAutomateNotificationStatus.Assigned, n.DocumentNumber, ct))
            return;

        await smtp.SendAssignedForApprovalAsync(n, ct);
        await teams.SendAdaptiveCardAsync(
            $"На согласовании: {n.DocumentNumber}",
            n.DocumentNumber,
            urlResolver.ToAbsolute(n.LinkUrl),
            [n.RecipientEmail],
            ct);
    }

    public async Task SendAwaitingExecutionAsync(WorkflowNotification n, CancellationToken ct)
    {
        if (await TryPowerAutomateAsync(
                n.RecipientEmail, n.LinkUrl, PowerAutomateNotificationStatus.AwaitingExecution, n.DocumentNumber, ct))
            return;

        await smtp.SendAssignedForApprovalAsync(n, ct);
        await teams.SendAdaptiveCardAsync(
            $"На исполнение: {n.DocumentNumber}",
            $"{n.DocumentNumber} — назначьте исполнителя",
            urlResolver.ToAbsolute(n.LinkUrl),
            [n.RecipientEmail],
            ct);
    }

    public async Task SendApprovedAsync(WorkflowNotification n, CancellationToken ct)
    {
        if (await TryPowerAutomateAsync(
                n.InitiatorEmail, n.LinkUrl, PowerAutomateNotificationStatus.Approved, n.DocumentNumber, ct))
            return;

        await smtp.SendApprovedAsync(n, ct);
        await teams.SendAdaptiveCardAsync(
            $"Согласовано: {n.DocumentNumber}",
            n.DocumentNumber,
            urlResolver.ToAbsolute(n.LinkUrl),
            [n.InitiatorEmail],
            ct);
    }

    public async Task SendReturnedAsync(WorkflowNotification n, CancellationToken ct)
    {
        if (await TryPowerAutomateAsync(
                n.InitiatorEmail, n.LinkUrl, PowerAutomateNotificationStatus.Returned, n.DocumentNumber, ct))
            return;

        await smtp.SendReturnedAsync(n, ct);
        var text = string.IsNullOrWhiteSpace(n.Comment)
            ? $"{n.DocumentNumber} возвращён на доработку."
            : $"{n.DocumentNumber} возвращён на доработку. {n.Comment}";
        await teams.SendAdaptiveCardAsync(
            $"Возврат: {n.DocumentNumber}",
            text,
            urlResolver.ToAbsolute(n.LinkUrl),
            [n.InitiatorEmail],
            ct);
    }

    public async Task SendRejectedAsync(WorkflowNotification n, CancellationToken ct)
    {
        if (await TryPowerAutomateAsync(
                n.InitiatorEmail, n.LinkUrl, PowerAutomateNotificationStatus.Rejected, n.DocumentNumber, ct))
            return;

        await smtp.SendReturnedAsync(n, ct);
        var text = string.IsNullOrWhiteSpace(n.Comment)
            ? $"{n.DocumentNumber} отклонён."
            : $"{n.DocumentNumber} отклонён. {n.Comment}";
        await teams.SendAdaptiveCardAsync(
            $"Отклонено: {n.DocumentNumber}",
            text,
            urlResolver.ToAbsolute(n.LinkUrl),
            [n.InitiatorEmail],
            ct);
    }
}
