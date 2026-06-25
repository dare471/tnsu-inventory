using MailKit.Net.Smtp;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using Tnsu.Inventory.Application.Common.Interfaces;

namespace Tnsu.Inventory.Infrastructure.Notifications;

public sealed class SmtpNotificationService(
    IOptions<SmtpOptions> smtpOptions,
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

    private async Task SendAsync(string to, string subject, string body, CancellationToken ct)
    {
        var cfg = smtpOptions.Value;
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(cfg.FromName, cfg.FromEmail));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new TextPart("plain") { Text = body };

        try
        {
            using var client = new SmtpClient();
            await client.ConnectAsync(cfg.Host, cfg.Port, false, ct);
            await client.SendAsync(message, ct);
            await client.DisconnectAsync(true, ct);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to send email to {To}", to);
        }
    }
}
