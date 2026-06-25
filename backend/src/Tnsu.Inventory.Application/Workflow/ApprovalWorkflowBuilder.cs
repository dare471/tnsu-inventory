using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Exceptions;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Domain;
using Tnsu.Inventory.Domain.Entities;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.Workflow;

public static class ApprovalWorkflowBuilder
{
    public static async Task<List<ApprovalStep>> BuildDefectActStepsAsync(
        IInventoryDbContext db,
        DefectAct act,
        Guid roundId,
        int startFromOrder,
        CancellationToken ct)
    {
        var approvers = await ResolveRoleApproversAsync(
            db, MechanizationRole.PurchaseApprovalRoles, ct);

        var steps = new List<ApprovalStep>();
        var order = 1;
        var now = DateTimeOffset.UtcNow;
        var firstPendingAssigned = false;

        foreach (var role in MechanizationRole.PurchaseApprovalRoles)
        {
            if (order < startFromOrder)
            {
                order++;
                continue;
            }

            var isFirst = !firstPendingAssigned;
            if (isFirst) firstPendingAssigned = true;

            steps.Add(new ApprovalStep
            {
                RoundId = roundId,
                DocumentType = DocumentTypes.DefectAct,
                DefectActId = act.Id,
                OrderNo = order++,
                ApproverRole = role,
                ApproverUserId = approvers[role].Id,
                Status = ApprovalStepStatus.Pending,
                RequiresDigitalSignature = role == MechanizationRole.ChiefMechanic,
                AssignedAt = isFirst ? now : null
            });
        }

        return steps;
    }

    public static async Task<List<ApprovalStep>> BuildPurchaseRequestStepsAsync(
        IInventoryDbContext db,
        PurchaseRequest request,
        Guid roundId,
        IReadOnlySet<string> skipRoles,
        int startFromOrder,
        CancellationToken ct)
    {
        var approvers = await ResolveRoleApproversAsync(
            db, MechanizationRole.PurchaseApprovalRoles, ct);

        var steps = new List<ApprovalStep>();
        var order = 1;
        var now = DateTimeOffset.UtcNow;
        var firstPendingAssigned = false;

        foreach (var role in MechanizationRole.PurchaseApprovalRoles)
        {
            if (skipRoles.Contains(role))
            {
                steps.Add(new ApprovalStep
                {
                    RoundId = roundId,
                    DocumentType = DocumentTypes.PurchaseRequest,
                    PurchaseRequestId = request.Id,
                    OrderNo = order++,
                    ApproverRole = role,
                    ApproverUserId = approvers[role].Id,
                    Status = ApprovalStepStatus.Skipped,
                    DecidedAt = now,
                    Action = ApprovalAction.Approved,
                    Comment = "Согласовано ранее при утверждении дефектного акта"
                });
                continue;
            }

            if (order < startFromOrder)
            {
                order++;
                continue;
            }

            var isFirst = !firstPendingAssigned;
            if (isFirst) firstPendingAssigned = true;

            steps.Add(new ApprovalStep
            {
                RoundId = roundId,
                DocumentType = DocumentTypes.PurchaseRequest,
                PurchaseRequestId = request.Id,
                OrderNo = order++,
                ApproverRole = role,
                ApproverUserId = approvers[role].Id,
                Status = ApprovalStepStatus.Pending,
                RequiresDigitalSignature = role == MechanizationRole.ChiefMechanic,
                AssignedAt = isFirst ? now : null
            });
        }

        return steps;
    }

    public static async Task<Dictionary<string, AppUser>> ResolveRoleApproversAsync(
        IInventoryDbContext db,
        IEnumerable<string> roles,
        CancellationToken ct)
    {
        var roleSet = roles.ToHashSet();
        var users = await db.Users
            .Where(u => u.IsActive && roleSet.Contains(u.Role))
            .ToListAsync(ct);

        var map = new Dictionary<string, AppUser>();
        foreach (var role in roleSet)
        {
            var user = users.FirstOrDefault(u => u.Role == role);
            if (user is null)
                throw new ValidationFailedException(
                    $"Не назначен активный пользователь с ролью «{MechanizationRole.Label(role)}».");
            map[role] = user;
        }

        return map;
    }

    public static string ResolveDocumentStatus(IEnumerable<ApprovalStep> steps, string currentStatus)
    {
        var list = steps.Where(s => s.Status != ApprovalStepStatus.Skipped).ToList();
        if (list.Count == 0) return currentStatus;

        if (list.Any(s => s.Status == ApprovalStepStatus.Rejected))
            return WorkflowStatus.Rejected;

        if (list.Any(s => s.Status == ApprovalStepStatus.Returned))
            return WorkflowStatus.Returned;

        var pending = list.FirstOrDefault(s => s.Status == ApprovalStepStatus.Pending);
        if (pending is null)
            return WorkflowStatus.Approved;

        return pending.ApproverRole == MechanizationRole.ChiefMechanic
            ? WorkflowStatus.OnFinalApproval
            : WorkflowStatus.OnCoordination;
    }

    public static async Task ActivateNextStepAsync(
        IInventoryDbContext db,
        IEnumerable<ApprovalStep> steps,
        CancellationToken ct)
    {
        var next = steps
            .Where(s => s.Status == ApprovalStepStatus.Pending && s.AssignedAt == null)
            .OrderBy(s => s.OrderNo)
            .FirstOrDefault();

        if (next is null) return;

        next.AssignedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);
    }

    public static IReadOnlySet<string> CollectApprovedRoles(IEnumerable<ApprovalStep> steps) =>
        steps
            .Where(s => s.Status is ApprovalStepStatus.Approved or ApprovalStepStatus.Skipped)
            .Select(s => s.ApproverRole)
            .ToHashSet();

    public static IReadOnlyList<ApprovalStep> LatestRoundSteps(IEnumerable<ApprovalStep> steps)
    {
        var list = steps.ToList();
        if (list.Count == 0) return list;

        var latestRoundId = list.MaxBy(s => s.DecidedAt ?? s.AssignedAt ?? DateTimeOffset.MinValue)!.RoundId;
        return list.Where(s => s.RoundId == latestRoundId).OrderBy(s => s.OrderNo).ToList();
    }
}
