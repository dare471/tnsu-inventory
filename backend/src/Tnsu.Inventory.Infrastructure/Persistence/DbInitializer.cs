using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Tnsu.Inventory.Domain.Entities;
using Tnsu.Inventory.Domain.Enums;
using Tnsu.Inventory.Infrastructure.Seeding;

namespace Tnsu.Inventory.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider services, CancellationToken ct = default)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<InventoryDbContext>();
        await db.Database.EnsureCreatedAsync(ct);

        if (!await db.Users.AnyAsync(ct))
            await SeedDemoUsersAsync(db, ct);
        else
            await EnsureEntraUsersAsync(db, ct);

        await ReassignLegacyMechanicDocumentsAsync(db, ct);
        await DemoDocumentSeeder.SeedAsync(db, ct);
    }

    private static async Task EnsureEntraUsersAsync(InventoryDbContext db, CancellationToken ct)
    {
        await UpsertUserAsync(db, DemoSeedData.DaurenEmail, DemoSeedData.DaurenFullName,
            MechanizationRole.ChiefMechanic, "seed-dauren-onglassyn", ct);
        await UpsertUserAsync(db, DemoSeedData.MechanicEmail, DemoSeedData.MechanicFullName,
            MechanizationRole.SiteMechanic, "demo-site-mechanic-local", ct);

        var oldChief = await db.Users.FirstOrDefaultAsync(
            u => u.Email == "chief.mechanic@tansu.local", ct);
        if (oldChief is not null)
            oldChief.IsActive = false;

        var entraMechanicPlaceholder = await db.Users.FirstOrDefaultAsync(
            u => u.Email.ToLower() == "mechanic@tnsukz.onmicrosoft.com", ct);
        if (entraMechanicPlaceholder is not null)
            entraMechanicPlaceholder.IsActive = false;

        foreach (var legacyMechanic in await db.Users
            .Where(u => u.Role == MechanizationRole.SiteMechanic
                        && u.Email.ToLower() != DemoSeedData.MechanicEmail.ToLower())
            .ToListAsync(ct))
        {
            legacyMechanic.IsActive = false;
        }

        foreach (var seedUser in await db.Users
            .Where(u => u.Email.ToLower() == DemoSeedData.DaurenEmail.ToLower()
                        || u.Email.ToLower() == DemoSeedData.MechanicEmail.ToLower())
            .ToListAsync(ct))
        {
            seedUser.IsActive = true;
        }

        await db.SaveChangesAsync(ct);
    }

    private static async Task ReassignLegacyMechanicDocumentsAsync(InventoryDbContext db, CancellationToken ct)
    {
        var devMechanic = await db.Users.FirstOrDefaultAsync(
            u => u.Email.ToLower() == DemoSeedData.MechanicEmail.ToLower(), ct);
        if (devMechanic is null) return;

        var legacyMechanic = await db.Users.FirstOrDefaultAsync(
            u => u.Email.ToLower() == "mechanic@tnsukz.onmicrosoft.com", ct);
        if (legacyMechanic is null || legacyMechanic.Id == devMechanic.Id) return;

        await db.DefectActs
            .Where(d => d.CreatedByUserId == legacyMechanic.Id)
            .ExecuteUpdateAsync(s => s.SetProperty(d => d.CreatedByUserId, devMechanic.Id), ct);

        await db.PurchaseRequests
            .Where(p => p.CreatedByUserId == legacyMechanic.Id)
            .ExecuteUpdateAsync(s => s.SetProperty(p => p.CreatedByUserId, devMechanic.Id), ct);
    }

    private static async Task UpsertUserAsync(
        InventoryDbContext db,
        string email,
        string fullName,
        string role,
        string entraObjectId,
        CancellationToken ct)
    {
        var normalized = email.Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalized, ct);
        if (user is null)
        {
            db.Users.Add(new AppUser
            {
                Email = email.Trim(),
                FullName = fullName,
                Role = role,
                EntraObjectId = entraObjectId
            });
            return;
        }

        user.FullName = fullName;
        user.Role = role;
        user.IsActive = true;
        if (string.IsNullOrWhiteSpace(user.EntraObjectId) || user.EntraObjectId.StartsWith("demo-"))
            user.EntraObjectId = entraObjectId;
    }

    private static async Task SeedDemoUsersAsync(InventoryDbContext db, CancellationToken ct)
    {
        var dauren = new AppUser
        {
            Email = DemoSeedData.DaurenEmail,
            FullName = DemoSeedData.DaurenFullName,
            Role = MechanizationRole.ChiefMechanic,
            EntraObjectId = "seed-dauren-onglassyn"
        };
        var omtsHead = new AppUser
        {
            Email = "omts.head@tansu.local",
            FullName = "Руководитель ОМТС (демо)",
            Role = MechanizationRole.OmtsHead,
            EntraObjectId = "demo-omts-head"
        };

        db.Users.AddRange(dauren, omtsHead);
        await db.SaveChangesAsync(ct);

        var mechanic = new AppUser
        {
            Email = DemoSeedData.MechanicEmail,
            FullName = DemoSeedData.MechanicFullName,
            Role = MechanizationRole.SiteMechanic,
            EntraObjectId = "demo-site-mechanic-local"
        };
        var storekeeper = new AppUser
        {
            Email = "storekeeper@tansu.local",
            FullName = "Кладовщик проекта (демо)",
            Role = MechanizationRole.ProjectStorekeeper,
            EntraObjectId = "demo-storekeeper",
            ManagerUserId = dauren.Id
        };
        var security = new AppUser
        {
            Email = "security@tansu.local",
            FullName = "СБ (демо)",
            Role = MechanizationRole.Security,
            EntraObjectId = "demo-security",
            ManagerUserId = dauren.Id
        };
        var pm = new AppUser
        {
            Email = "pm@tansu.local",
            FullName = "РП участка (демо)",
            Role = MechanizationRole.ProjectManager,
            EntraObjectId = "demo-pm",
            ManagerUserId = dauren.Id
        };
        var coordinator = new AppUser
        {
            Email = "warehouse@tansu.local",
            FullName = "Координатор СХ (демо)",
            Role = MechanizationRole.WarehouseCoordinator,
            EntraObjectId = "demo-coordinator",
            ManagerUserId = dauren.Id
        };
        var omtsSpec = new AppUser
        {
            Email = "omts@tansu.local",
            FullName = "Специалист ОМТС (демо)",
            Role = MechanizationRole.OmtsSpecialist,
            EntraObjectId = "demo-omts-spec",
            ManagerUserId = omtsHead.Id
        };

        db.Users.AddRange(mechanic, storekeeper, security, pm, coordinator, omtsSpec);
        await db.SaveChangesAsync(ct);
    }
}
