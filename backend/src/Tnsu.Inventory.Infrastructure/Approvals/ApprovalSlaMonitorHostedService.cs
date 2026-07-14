using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Domain;
using Tnsu.Inventory.Domain.Enums;
using Tnsu.Inventory.Infrastructure.Persistence;

namespace Tnsu.Inventory.Infrastructure.Approvals;

public sealed class ApprovalSlaMonitorHostedService(
    IServiceScopeFactory scopeFactory,
    ILogger<ApprovalSlaMonitorHostedService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await RunOnceAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "SLA monitor failed");
            }

            await Task.Delay(TimeSpan.FromHours(6), stoppingToken);
        }
    }

    private async Task RunOnceAsync(CancellationToken ct)
    {
        using var scope = scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<InventoryDbContext>();
        var notifications = scope.ServiceProvider.GetRequiredService<INotificationService>();

        var pendingSteps = await db.ApprovalSteps
            .Where(s => s.Status == ApprovalStepStatus.Pending && s.AssignedAt != null)
            .ToListAsync(ct);

        var chief = await db.Users.FirstOrDefaultAsync(u =>
            u.IsActive && u.Role == MechanizationRole.ChiefMechanic, ct);

        foreach (var step in pendingSteps)
        {
            var pendingDays = CountWorkingDays(step.AssignedAt!.Value, DateTimeOffset.UtcNow);
            if (pendingDays < BusinessRules.SlaWorkingDays)
                continue;

            var shouldNotify = step.LastReminderAt is null ||
                CountWorkingDays(step.LastReminderAt.Value, DateTimeOffset.UtcNow) >= BusinessRules.SlaWorkingDays;
            if (!shouldNotify) continue;

            var approver = await db.Users.FirstAsync(u => u.Id == step.ApproverUserId, ct);
            string? managerEmail = null;
            if (approver.ManagerUserId is Guid mid)
                managerEmail = (await db.Users.FirstOrDefaultAsync(u => u.Id == mid, ct))?.Email;

            var docType = step.DocumentType;
            var docId = step.DefectActId ?? step.PurchaseRequestId ?? Guid.Empty;
            if (docId == Guid.Empty) continue;

            var docNumber = docType == DocumentTypes.DefectAct
                ? (await db.DefectActs.AsNoTracking().Where(a => a.Id == docId).Select(a => a.Number).FirstOrDefaultAsync(ct))
                : (await db.PurchaseRequests.AsNoTracking().Where(r => r.Id == docId).Select(r => r.Number).FirstOrDefaultAsync(ct));

            var link = docType == DocumentTypes.DefectAct
                ? $"/defect-acts/{docId:D}"
                : $"/purchase-requests/{docId:D}";
            var notification = new ApprovalNotification(
                step.Id, docType, docId, docNumber ?? docType,
                approver.Email, approver.FullName,
                managerEmail, chief?.Email,
                pendingDays, link);

            if (step.EscalatedAt is null && pendingDays >= BusinessRules.SlaWorkingDays)
            {
                await notifications.SendEscalationAsync(notification, ct);
                step.EscalatedAt = DateTimeOffset.UtcNow;
            }
            else
            {
                await notifications.SendApprovalReminderAsync(notification, ct);
            }

            step.LastReminderAt = DateTimeOffset.UtcNow;
        }

        await db.SaveChangesAsync(ct);
    }

    private static int CountWorkingDays(DateTimeOffset from, DateTimeOffset to)
    {
        var days = 0;
        var date = from.Date;
        while (date < to.Date)
        {
            date = date.AddDays(1);
            if (date.DayOfWeek is not DayOfWeek.Saturday and not DayOfWeek.Sunday)
                days++;
        }
        return days;
    }
}
