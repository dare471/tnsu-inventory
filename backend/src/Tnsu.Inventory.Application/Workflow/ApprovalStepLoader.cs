using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Exceptions;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Domain.Entities;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.Workflow;

internal static class ApprovalStepLoader
{
    public static async Task<(ApprovalStep step, AppUser approver)> LoadPendingStepAsync(
        IInventoryDbContext db,
        Guid stepId,
        ICurrentUser currentUser,
        CancellationToken ct)
    {
        var userId = currentUser.UserId ?? throw new UnauthorizedException();

        var step = await db.ApprovalSteps
            .Include(s => s.Approver)
            .FirstOrDefaultAsync(s => s.Id == stepId, ct)
            ?? throw new NotFoundException("ApprovalStep", stepId);

        if (step.ApproverUserId != userId)
            throw new ForbiddenException("Этот шаг назначен другому согласующему.");

        if (step.Status != ApprovalStepStatus.Pending)
            throw new ConflictException("not_pending", $"Шаг уже обработан (статус: {step.Status}).");

        var earlierPending = await db.ApprovalSteps.AnyAsync(s =>
            s.RoundId == step.RoundId &&
            s.Status == ApprovalStepStatus.Pending &&
            s.OrderNo < step.OrderNo, ct);

        if (earlierPending)
            throw new ConflictException("not_current_step", "Сначала должны быть согласованы предыдущие шаги.");

        return (step, step.Approver!);
    }
}
