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
            $"Заявка/акт ожидает вашего решения уже {n.PendingWorkingDays} раб. дн.\n{n.LinkUrl}",
            ct);

    public async Task SendEscalationAsync(ApprovalNotification n, CancellationToken ct)
    {
        await SendAsync(n.RecipientEmail,
            $"Эскалация: согласование {n.DocumentNumber}",
            $"Документ не обработан {n.PendingWorkingDays} раб. дн.\n{n.LinkUrl}", ct);

        if (!string.IsNullOrWhiteSpace(n.ManagerEmail))
            await SendAsync(n.ManagerEmail,
                $"Эскалация руководителю: {n.DocumentNumber}",
                $"Согласующий {n.RecipientName} не обработал документ.\n{n.LinkUrl}", ct);

        if (!string.IsNullOrWhiteSpace(n.ChiefMechanicEmail))
            await SendAsync(n.ChiefMechanicEmail,
                $"Эскалация главному механику: {n.DocumentNumber}",
                $"Документ {n.DocumentNumber} просрочен на шаге согласования.\n{n.LinkUrl}", ct);
    }

    public Task SendAssignedForApprovalAsync(WorkflowNotification n, CancellationToken ct) =>
        SendAsync(
            n.RecipientEmail,
            $"Документ на согласовании: {n.DocumentNumber}",
            $"{n.RecipientName}, документ поступил на согласование.\n{n.LinkUrl}",
            ct);

    public Task SendApprovedAsync(WorkflowNotification n, CancellationToken ct) =>
        SendAsync(
            n.InitiatorEmail,
            $"Документ согласован: {n.DocumentNumber}",
            $"{n.InitiatorName}, документ согласован.\n{n.LinkUrl}",
            ct);

    public Task SendReturnedAsync(WorkflowNotification n, CancellationToken ct)
    {
        var body = string.IsNullOrWhiteSpace(n.Comment)
            ? $"{n.InitiatorName}, документ возвращён на доработку.\n{n.LinkUrl}"
            : $"{n.InitiatorName}, документ возвращён на доработку.\nКомментарий: {n.Comment.Trim()}\n{n.LinkUrl}";
        return SendAsync(
            n.InitiatorEmail,
            $"Документ возвращён: {n.DocumentNumber}",
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
