using Tnsu.Inventory.Application.DefectActs;
using Tnsu.Inventory.Domain.Entities;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.Workflow;

internal static class ApprovalRoundMapper
{
    public static IReadOnlyList<ApprovalStepDto> ToDtos(IEnumerable<ApprovalStep> steps)
    {
        var list = steps.ToList();
        var roundNo = list
            .GroupBy(s => s.RoundId)
            .OrderBy(g => g.Min(s => s.AssignedAt ?? s.DecidedAt ?? DateTimeOffset.MaxValue))
            .Select((g, index) => (g.Key, No: index + 1))
            .ToDictionary(x => x.Key, x => x.No);

        return list
            .OrderBy(s => roundNo[s.RoundId])
            .ThenBy(s => s.OrderNo)
            .Select(s => new ApprovalStepDto(
                s.Id,
                s.OrderNo,
                s.ApproverRole,
                MechanizationRole.Label(s.ApproverRole),
                s.Approver?.FullName ?? "—",
                s.Status,
                ApprovalStepStatus.Label(s.Status),
                s.Action,
                s.Comment,
                s.RequiresDigitalSignature,
                s.AssignedAt,
                s.DecidedAt,
                s.DecidedAt ?? s.AssignedAt,
                roundNo[s.RoundId]))
            .ToList();
    }
}
