using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Domain.Entities;

namespace Tnsu.Inventory.Infrastructure.Persistence;

public sealed class InventoryDbContext(DbContextOptions<InventoryDbContext> options)
    : DbContext(options), IInventoryDbContext
{
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<DefectAct> DefectActs => Set<DefectAct>();
    public DbSet<DefectActPart> DefectActParts => Set<DefectActPart>();
    public DbSet<PurchaseRequest> PurchaseRequests => Set<PurchaseRequest>();
    public DbSet<PurchaseRequestLine> PurchaseRequestLines => Set<PurchaseRequestLine>();
    public DbSet<ApprovalStep> ApprovalSteps => Set<ApprovalStep>();
    public DbSet<ProjectApprovalAssignee> ProjectApprovalAssignees => Set<ProjectApprovalAssignee>();
    public DbSet<DocumentApprovalAssignee> DocumentApprovalAssignees => Set<DocumentApprovalAssignee>();
    public DbSet<DocumentAttachment> Attachments => Set<DocumentAttachment>();
    public DbSet<SupplierOrder> SupplierOrders => Set<SupplierOrder>();
    public DbSet<DocumentChangeEntry> DocumentChanges => Set<DocumentChangeEntry>();
    public DbSet<MaterialTransferRequest> MaterialTransfers => Set<MaterialTransferRequest>();
    public DbSet<MaterialTransferLine> MaterialTransferLines => Set<MaterialTransferLine>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>(e =>
        {
            e.ToTable("users");
            e.HasKey(x => x.Id);
            e.Property(x => x.Email).HasMaxLength(256).IsRequired();
            e.Property(x => x.FullName).HasMaxLength(256).IsRequired();
            e.Property(x => x.Role).HasMaxLength(64).IsRequired();
            e.Property(x => x.EntraObjectId).HasMaxLength(64);
            e.HasIndex(x => x.Email).IsUnique();
            e.HasOne(x => x.Manager).WithMany().HasForeignKey(x => x.ManagerUserId);
        });

        modelBuilder.Entity<DefectAct>(e =>
        {
            e.ToTable("defect_acts");
            e.HasKey(x => x.Id);
            e.Property(x => x.Number).HasMaxLength(32).IsRequired();
            e.HasIndex(x => x.Number).IsUnique();
            e.Property(x => x.RepairType).HasMaxLength(32);
            e.Property(x => x.RepairCategory).HasMaxLength(32);
            e.Property(x => x.Odometer).HasPrecision(14, 2);
            e.Property(x => x.EngineHours).HasPrecision(14, 2);
            e.HasOne(x => x.CreatedBy).WithMany().HasForeignKey(x => x.CreatedByUserId);
        });

        modelBuilder.Entity<DefectActPart>(e =>
        {
            e.ToTable("defect_act_parts");
            e.HasKey(x => x.Id);
            e.Property(x => x.CatalogNumber).HasMaxLength(50);
            e.Property(x => x.Unit).HasMaxLength(32);
            e.Property(x => x.ActualStockQuantity).HasPrecision(18, 3);
            e.HasOne(x => x.DefectAct).WithMany(x => x.Parts).HasForeignKey(x => x.DefectActId);
        });

        modelBuilder.Entity<PurchaseRequest>(e =>
        {
            e.ToTable("purchase_requests");
            e.HasKey(x => x.Id);
            e.Property(x => x.Number).HasMaxLength(32).IsRequired();
            e.HasIndex(x => x.Number).IsUnique();
            e.Property(x => x.RepairType).HasMaxLength(32);
            e.Property(x => x.RepairCategory).HasMaxLength(32);
            e.Property(x => x.Odometer).HasPrecision(14, 2);
            e.Property(x => x.EngineHours).HasPrecision(14, 2);
            e.HasOne(x => x.CreatedBy).WithMany().HasForeignKey(x => x.CreatedByUserId);
            e.HasOne(x => x.AssignedExecutor).WithMany().HasForeignKey(x => x.AssignedExecutorUserId);
            e.HasOne(x => x.DefectAct).WithMany().HasForeignKey(x => x.DefectActId);
        });

        modelBuilder.Entity<PurchaseRequestLine>(e =>
        {
            e.ToTable("purchase_request_lines");
            e.HasKey(x => x.Id);
            e.Property(x => x.CatalogNumber).HasMaxLength(50);
            e.Property(x => x.Unit).HasMaxLength(32);
            e.Property(x => x.MaxQuantity).HasPrecision(18, 3);
            e.HasOne(x => x.PurchaseRequest).WithMany(x => x.Lines).HasForeignKey(x => x.PurchaseRequestId);
        });

        modelBuilder.Entity<ApprovalStep>(e =>
        {
            e.ToTable("approval_steps");
            e.HasKey(x => x.Id);
            e.Property(x => x.ApproverRole).HasMaxLength(64);
            e.Property(x => x.Status).HasMaxLength(32);
            e.HasOne(x => x.Approver).WithMany().HasForeignKey(x => x.ApproverUserId);
            e.HasOne(x => x.DefectAct).WithMany(x => x.ApprovalSteps).HasForeignKey(x => x.DefectActId);
            e.HasOne(x => x.PurchaseRequest).WithMany(x => x.ApprovalSteps).HasForeignKey(x => x.PurchaseRequestId);
        });

        modelBuilder.Entity<DocumentAttachment>(e =>
        {
            e.ToTable("attachments");
            e.HasKey(x => x.Id);
            e.Property(x => x.FileName).HasMaxLength(512);
            e.Property(x => x.Category).HasMaxLength(64);
            e.HasOne(x => x.DefectAct).WithMany(x => x.Attachments).HasForeignKey(x => x.DefectActId);
            e.HasOne(x => x.PurchaseRequest).WithMany(x => x.Attachments).HasForeignKey(x => x.PurchaseRequestId);
        });

        modelBuilder.Entity<ProjectApprovalAssignee>(e =>
        {
            e.ToTable("project_approval_assignees");
            e.HasKey(x => x.Id);
            e.Property(x => x.Role).HasMaxLength(64).IsRequired();
            e.HasIndex(x => new { x.ProjectId, x.Role }).IsUnique();
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
        });

        modelBuilder.Entity<DocumentApprovalAssignee>(e =>
        {
            e.ToTable("document_approval_assignees");
            e.HasKey(x => x.Id);
            e.Property(x => x.Role).HasMaxLength(64).IsRequired();
            e.HasIndex(x => new { x.DefectActId, x.Role }).IsUnique();
            e.HasIndex(x => new { x.PurchaseRequestId, x.Role }).IsUnique();
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasOne(x => x.DefectAct).WithMany().HasForeignKey(x => x.DefectActId);
            e.HasOne(x => x.PurchaseRequest).WithMany().HasForeignKey(x => x.PurchaseRequestId);
        });

        modelBuilder.Entity<SupplierOrder>(e =>
        {
            e.ToTable("supplier_orders");
            e.HasKey(x => x.Id);
            e.Property(x => x.Number).HasMaxLength(32).IsRequired();
            e.HasIndex(x => x.Number).IsUnique();
            e.HasIndex(x => x.PurchaseRequestId).IsUnique();
            e.HasOne(x => x.PurchaseRequest).WithMany().HasForeignKey(x => x.PurchaseRequestId);
            e.HasOne(x => x.CreatedBy).WithMany().HasForeignKey(x => x.CreatedByUserId);
        });

        modelBuilder.Entity<DocumentChangeEntry>(e =>
        {
            e.ToTable("document_changes");
            e.HasKey(x => x.Id);
            e.Property(x => x.DocumentType).HasMaxLength(64).IsRequired();
            e.Property(x => x.UserFullName).HasMaxLength(256);
            e.Property(x => x.Action).HasMaxLength(64).IsRequired();
            e.Property(x => x.Summary).HasMaxLength(2000);
            e.HasIndex(x => new { x.DocumentType, x.DocumentId, x.CreatedAt });
        });

        modelBuilder.Entity<MaterialTransferRequest>(e =>
        {
            e.ToTable("material_transfers");
            e.HasKey(x => x.Id);
            e.Property(x => x.Number).HasMaxLength(32).IsRequired();
            e.HasIndex(x => x.Number).IsUnique();
            e.Property(x => x.Status).HasMaxLength(32);
            e.Property(x => x.SourceWarehouse).HasMaxLength(256);
            e.Property(x => x.Destination).HasMaxLength(256);
            e.Property(x => x.DefectActNumber).HasMaxLength(32);
            e.HasIndex(x => x.DefectActId);
            e.HasOne(x => x.CreatedBy).WithMany().HasForeignKey(x => x.CreatedByUserId);
        });

        modelBuilder.Entity<MaterialTransferLine>(e =>
        {
            e.ToTable("material_transfer_lines");
            e.HasKey(x => x.Id);
            e.Property(x => x.CatalogNumber).HasMaxLength(50);
            e.Property(x => x.Unit).HasMaxLength(32);
            e.Property(x => x.Code).HasMaxLength(64);
            e.Property(x => x.Name).HasMaxLength(512);
            e.Property(x => x.NomenclatureId).HasMaxLength(64);
            e.Property(x => x.Quantity).HasPrecision(18, 3);
            e.Property(x => x.AvailableQuantity).HasPrecision(18, 3);
            e.HasOne(x => x.TransferRequest).WithMany(x => x.Lines)
                .HasForeignKey(x => x.TransferRequestId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
