using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using Tnsu.Inventory.Application.Common.Interfaces;

namespace Tnsu.Inventory.Infrastructure.Notifications;

public sealed class SmtpNotificationService(
    IOptions<NotificationsOptions> notificationsOptions,
    ILogger<SmtpNotificationService> logger) : INotificationService
{
    public Task SendApprovalReminderAsync(ApprovalNotification n, CancellationToken ct) =>
        SendAsync(n.RecipientEmail,
            $"Напоминание: согласование {n.DocumentNumber}",
            $"На согласовании {n.PendingWorkingDays} раб. дн.\n{n.LinkUrl}",
            ct);

    public async Task SendEscalationAsync(ApprovalNotification n, CancellationToken ct)
    {
        await SendAsync(n.RecipientEmail,
            $"Эскалация: согласование {n.DocumentNumber}",
            $"Не обработан {n.PendingWorkingDays} раб. дн.\n{n.LinkUrl}", ct);

        if (!string.IsNullOrWhiteSpace(n.ManagerEmail))
            await SendAsync(n.ManagerEmail,
                $"Эскалация руководителю: {n.DocumentNumber}",
                $"Согласующий {n.RecipientName} не обработал.\n{n.LinkUrl}", ct);

        if (!string.IsNullOrWhiteSpace(n.ChiefMechanicEmail))
            await SendAsync(n.ChiefMechanicEmail,
                $"Эскалация главному механику: {n.DocumentNumber}",
                $"{n.DocumentNumber} просрочен.\n{n.LinkUrl}", ct);
    }

    public Task SendAssignedForApprovalAsync(WorkflowNotification n, CancellationToken ct) =>
        SendAsync(
            n.RecipientEmail,
            $"На согласовании: {n.DocumentNumber}",
            $"{n.DocumentNumber}\n{n.LinkUrl}",
            ct);

    public Task SendApprovedAsync(WorkflowNotification n, CancellationToken ct) =>
        SendAsync(
            n.InitiatorEmail,
            $"Согласовано: {n.DocumentNumber}",
            $"{n.DocumentNumber}\n{n.LinkUrl}",
            ct);

    public Task SendReturnedAsync(WorkflowNotification n, CancellationToken ct)
    {
        var body = string.IsNullOrWhiteSpace(n.Comment)
            ? $"{n.DocumentNumber} возвращён на доработку.\n{n.LinkUrl}"
            : $"{n.DocumentNumber} возвращён на доработку.\n{n.Comment.Trim()}\n{n.LinkUrl}";
        return SendAsync(
            n.InitiatorEmail,
            $"Возврат: {n.DocumentNumber}",
            body,
            ct);
    }

    private async Task SendAsync(string to, string subject, string body, CancellationToken ct)
    {
        var cfg = notificationsOptions.Value.Email;
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(cfg.FromName, cfg.FromEmail));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new TextPart("plain") { Text = body };

        try
        {
            using var client = new SmtpClient();
            var socketOptions = cfg.UseStartTls ? SecureSocketOptions.StartTls : SecureSocketOptions.None;
            await client.ConnectAsync(cfg.Host, cfg.Port, socketOptions, ct);
            if (cfg.HasCredentials)
                await client.AuthenticateAsync(cfg.Username, cfg.Password, ct);
            await client.SendAsync(message, ct);
            await client.DisconnectAsync(true, ct);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to send email to {To}", to);
        }
    }
}
