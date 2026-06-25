using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Domain;
using Tnsu.Inventory.Domain.Entities;
using Tnsu.Inventory.Domain.Enums;
using Tnsu.Inventory.Infrastructure.Persistence;

namespace Tnsu.Inventory.Infrastructure.Seeding;

public static class DemoDocumentSeeder
{
    public static async Task SeedAsync(InventoryDbContext db, CancellationToken ct = default)
    {
        if (await db.PurchaseRequests.AnyAsync(p => p.Number == DemoSeedData.SeedPurchaseApprovalNumber, ct))
            return;

        var mechanic = await db.Users.FirstAsync(
            u => u.Email.ToLower() == DemoSeedData.MechanicEmail.ToLower(), ct);
        var chief = await db.Users.FirstAsync(
            u => u.Email.ToLower() == DemoSeedData.DaurenEmail.ToLower(), ct);
        var storekeeper = await db.Users.FirstAsync(u => u.Role == MechanizationRole.ProjectStorekeeper, ct);
        var security = await db.Users.FirstAsync(u => u.Role == MechanizationRole.Security, ct);
        var pm = await db.Users.FirstAsync(u => u.Role == MechanizationRole.ProjectManager, ct);
        var coordinator = await db.Users.FirstAsync(u => u.Role == MechanizationRole.WarehouseCoordinator, ct);

        var now = DateTimeOffset.UtcNow;

        var defectAct = new DefectAct
        {
            Number = DemoSeedData.SeedDefectActNumber,
            CreatedByUserId = mechanic.Id,
            ProjectId = DemoSeedData.DemoProjectId,
            ProjectCode = DemoSeedData.DemoProjectCode,
            ProjectName = DemoSeedData.DemoProjectName,
            VehicleId = DemoSeedData.DemoVehicleId,
            VehicleName = DemoSeedData.DemoVehicleName,
            VehicleGroupName = DemoSeedData.DemoVehicleGroup,
            StateNumber = DemoSeedData.DemoStateNumber,
            VinCode = "",
            MalfunctionDescription = "Повышенный расход масла, требуется замена фильтров и уплотнений.",
            Status = WorkflowStatus.Signed,
            SignedAt = now.AddDays(-2),
            CreatedAt = now.AddDays(-3),
            UpdatedAt = now.AddDays(-2)
        };
        defectAct.Parts.Add(new DefectActPart
        {
            LineNo = 1,
            Name = "Фильтр масляный",
            CatalogNumber = "FL-001",
            Quantity = 2,
            Unit = "шт"
        });
        defectAct.Parts.Add(new DefectActPart
        {
            LineNo = 2,
            Name = "Масло моторное 15W-40",
            CatalogNumber = "OIL-15W40",
            Quantity = 20,
            Unit = "л"
        });
        db.DefectActs.Add(defectAct);

        var draftRequest = new PurchaseRequest
        {
            Number = DemoSeedData.SeedPurchaseDraftNumber,
            CreatedByUserId = mechanic.Id,
            DefectActId = defectAct.Id,
            ProjectId = DemoSeedData.DemoProjectId,
            ProjectCode = DemoSeedData.DemoProjectCode,
            ProjectName = DemoSeedData.DemoProjectName,
            VehicleId = DemoSeedData.DemoVehicleId,
            VehicleName = DemoSeedData.DemoVehicleName,
            StateNumber = DemoSeedData.DemoStateNumber,
            VinCode = "",
            Description = "Черновик заявки: фильтры и расходники.",
            EstimatedAmount = 185_000m,
            Status = WorkflowStatus.Draft,
            CreatedAt = now.AddDays(-1),
            UpdatedAt = now.AddDays(-1)
        };
        draftRequest.Lines.Add(new PurchaseRequestLine
        {
            LineNo = 1,
            Name = "Фильтр масляный",
            CatalogNumber = "FL-001",
            Quantity = 2,
            Unit = "шт",
            EstimatedUnitPrice = 25_000m,
            EstimatedAmount = 50_000m
        });
        draftRequest.Lines.Add(new PurchaseRequestLine
        {
            LineNo = 2,
            Name = "Масло моторное 15W-40",
            CatalogNumber = "OIL-15W40",
            Quantity = 20,
            Unit = "л",
            EstimatedUnitPrice = 6_750m,
            EstimatedAmount = 135_000m
        });
        db.PurchaseRequests.Add(draftRequest);

        var approvalRequest = new PurchaseRequest
        {
            Number = DemoSeedData.SeedPurchaseApprovalNumber,
            CreatedByUserId = mechanic.Id,
            DefectActId = defectAct.Id,
            ProjectId = DemoSeedData.DemoProjectId,
            ProjectCode = DemoSeedData.DemoProjectCode,
            ProjectName = DemoSeedData.DemoProjectName,
            VehicleId = DemoSeedData.DemoVehicleId,
            VehicleName = DemoSeedData.DemoVehicleName,
            StateNumber = DemoSeedData.DemoStateNumber,
            VinCode = "",
            Description = "Заявка на согласовании: ремонт генератора AKSA.",
            EstimatedAmount = 320_000m,
            Status = WorkflowStatus.OnFinalApproval,
            CreatedAt = now.AddHours(-6),
            UpdatedAt = now.AddHours(-1)
        };
        approvalRequest.Lines.Add(new PurchaseRequestLine
        {
            LineNo = 1,
            Name = "Комплект прокладок двигателя",
            CatalogNumber = "GSK-445",
            Quantity = 1,
            Unit = "компл",
            EstimatedUnitPrice = 120_000m,
            EstimatedAmount = 120_000m
        });
        approvalRequest.Lines.Add(new PurchaseRequestLine
        {
            LineNo = 2,
            Name = "Ремень приводной",
            CatalogNumber = "BLT-778",
            Quantity = 2,
            Unit = "шт",
            EstimatedUnitPrice = 100_000m,
            EstimatedAmount = 200_000m
        });
        db.PurchaseRequests.Add(approvalRequest);
        await db.SaveChangesAsync(ct);

        var roundId = Guid.NewGuid();
        var decidedAt = now.AddHours(-2);

        var steps = new List<ApprovalStep>
        {
            CreateApprovedStep(roundId, approvalRequest.Id, 1, MechanizationRole.ProjectStorekeeper, storekeeper.Id, decidedAt.AddHours(-4)),
            CreateApprovedStep(roundId, approvalRequest.Id, 2, MechanizationRole.Security, security.Id, decidedAt.AddHours(-3)),
            CreateApprovedStep(roundId, approvalRequest.Id, 3, MechanizationRole.ProjectManager, pm.Id, decidedAt.AddHours(-2).AddMinutes(-30)),
            CreateApprovedStep(roundId, approvalRequest.Id, 4, MechanizationRole.WarehouseCoordinator, coordinator.Id, decidedAt),
            new()
            {
                RoundId = roundId,
                DocumentType = DocumentTypes.PurchaseRequest,
                PurchaseRequestId = approvalRequest.Id,
                OrderNo = 5,
                ApproverRole = MechanizationRole.ChiefMechanic,
                ApproverUserId = chief.Id,
                Status = ApprovalStepStatus.Pending,
                RequiresDigitalSignature = true,
                AssignedAt = now.AddHours(-1)
            }
        };

        db.ApprovalSteps.AddRange(steps);
        await db.SaveChangesAsync(ct);
    }

    private static ApprovalStep CreateApprovedStep(
        Guid roundId,
        Guid purchaseId,
        int orderNo,
        string role,
        Guid approverUserId,
        DateTimeOffset decidedAt) =>
        new()
        {
            RoundId = roundId,
            DocumentType = DocumentTypes.PurchaseRequest,
            PurchaseRequestId = purchaseId,
            OrderNo = orderNo,
            ApproverRole = role,
            ApproverUserId = approverUserId,
            Status = ApprovalStepStatus.Approved,
            Action = ApprovalAction.Approved,
            DecidedAt = decidedAt,
            AssignedAt = decidedAt.AddHours(-1)
        };
}
