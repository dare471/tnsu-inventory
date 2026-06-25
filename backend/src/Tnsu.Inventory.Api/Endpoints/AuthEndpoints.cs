using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Api.Auth;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Domain.Enums;
using Tnsu.Inventory.Infrastructure.Persistence;

namespace Tnsu.Inventory.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app, IHostEnvironment env)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth");

        if (env.IsDevelopment())
        {
            group.MapPost("/dev-login", async (
                [FromBody] DevLoginRequest req,
                InventoryDbContext db,
                DevJwtTokenService jwt,
                CancellationToken ct) =>
            {
                var email = req.Email.Trim().ToLowerInvariant();
                var user = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email, ct);
                if (user is null || !user.IsActive)
                    return Results.Unauthorized();

                var (token, expiresAt) = jwt.IssueToken(user.Email, user.Id);
                return Results.Ok(new LoginResponse(
                    token,
                    expiresAt,
                    user.Id,
                    user.Email,
                    user.FullName,
                    user.Role,
                    MechanizationRole.Label(user.Role)));
            })
            .AllowAnonymous()
            .WithSummary("Локальный вход по email (только Development).");
        }

        group.MapGet("/me", async (ICurrentUser currentUser, InventoryDbContext db, CancellationToken ct) =>
        {
            var userId = currentUser.UserId;
            if (userId is null)
                return Results.Unauthorized();

            var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId, ct);
            if (user is null || !user.IsActive)
                return Results.Unauthorized();

            return Results.Ok(new MeResponse(
                user.Id,
                user.Email,
                user.FullName,
                user.Role,
                MechanizationRole.Label(user.Role)));
        })
        .RequireAuthorization()
        .WithSummary("Текущий пользователь.");

        return app;
    }
}

public sealed record DevLoginRequest(string Email);

public sealed record LoginResponse(
    string AccessToken,
    DateTimeOffset ExpiresAt,
    Guid UserId,
    string Email,
    string FullName,
    string Role,
    string RoleLabel);

public sealed record MeResponse(
    Guid Id,
    string Email,
    string FullName,
    string Role,
    string RoleLabel);
