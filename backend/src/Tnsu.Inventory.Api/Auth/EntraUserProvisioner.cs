using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Tnsu.Inventory.Domain.Entities;
using Tnsu.Inventory.Domain.Enums;
using Tnsu.Inventory.Infrastructure.Persistence;

namespace Tnsu.Inventory.Api.Auth;

public sealed class EntraUserProvisioner(
    InventoryDbContext db,
    IConfiguration config,
    IHostEnvironment env,
    ILogger<EntraUserProvisioner> logger)
{
    private const string UserNotFoundMessage =
        "Данного пользователя нет в базе механизации. Обратитесь к администратору.";

    public async Task ProvisionAsync(TokenValidatedContext context)
    {
        var principal = context.Principal;
        if (principal is null) return;

        var tenantId = FindClaim(principal, "tid")
                       ?? config["Entra:TenantId"]?.Trim();
        var objectId = FindClaim(principal, "oid", ClaimTypes.NameIdentifier);
        var email = FindClaim(principal,
            "preferred_username",
            ClaimTypes.Email,
            "email",
            ClaimTypes.Upn,
            "unique_name");
        var name = principal.FindFirstValue("name") ?? email;

        if (string.IsNullOrWhiteSpace(objectId))
        {
            context.Fail("В токене Microsoft Entra ID отсутствует oid.");
            return;
        }

        objectId = objectId.Trim().ToLowerInvariant();
        email = string.IsNullOrWhiteSpace(email) ? null : email.Trim().ToLowerInvariant();

        var user = await db.Users.FirstOrDefaultAsync(u =>
            u.EntraObjectId != null && u.EntraObjectId.ToLower() == objectId);

        if (user is null && !string.IsNullOrWhiteSpace(email))
        {
            user = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);
        }

        if (user is null && env.IsDevelopment())
        {
            user = new AppUser
            {
                Email = email ?? $"{objectId}@entra.local",
                FullName = name ?? email ?? "Entra user",
                EntraObjectId = objectId,
                Role = MechanizationRole.SiteMechanic
            };
            db.Users.Add(user);
            await db.SaveChangesAsync(context.HttpContext.RequestAborted);
            logger.LogInformation("Auto-provisioned Entra user {Email} for development.", user.Email);
        }

        if (user is null)
        {
            logger.LogWarning("Entra user not found. Email={Email}, Oid={Oid}", email, objectId);
            context.Fail(UserNotFoundMessage);
            return;
        }

        if (!user.IsActive)
        {
            context.Fail("Учётная запись отключена.");
            return;
        }

        if (string.IsNullOrWhiteSpace(user.EntraObjectId))
        {
            user.EntraObjectId = objectId;
            await db.SaveChangesAsync(context.HttpContext.RequestAborted);
        }

        if (!string.IsNullOrWhiteSpace(name) && user.FullName != name)
        {
            user.FullName = name;
            await db.SaveChangesAsync(context.HttpContext.RequestAborted);
        }

        if (principal.Identity is not ClaimsIdentity identity) return;

        ReplaceClaim(identity, "app_user_id", user.Id.ToString());
        ReplaceClaim(identity, "mech_role", user.Role);
        if (!string.IsNullOrWhiteSpace(user.Email))
            ReplaceClaim(identity, ClaimTypes.Email, user.Email);
        if (!string.IsNullOrWhiteSpace(name))
            ReplaceClaim(identity, ClaimTypes.Name, name);
        if (!string.IsNullOrWhiteSpace(tenantId))
            ReplaceClaim(identity, "entra_tid", tenantId);
        ReplaceClaim(identity, "entra_oid", objectId);
    }

    private static string? FindClaim(ClaimsPrincipal principal, params string[] claimTypes)
    {
        foreach (var claimType in claimTypes)
        {
            var value = principal.FindFirstValue(claimType);
            if (!string.IsNullOrWhiteSpace(value))
                return value;
        }

        return null;
    }

    private static void ReplaceClaim(ClaimsIdentity identity, string type, string value)
    {
        var existing = identity.FindFirst(type);
        if (existing is not null) identity.RemoveClaim(existing);
        identity.AddClaim(new Claim(type, value));
    }
}
