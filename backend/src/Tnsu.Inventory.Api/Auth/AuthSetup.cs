using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Tnsu.Inventory.Infrastructure.Persistence;

namespace Tnsu.Inventory.Api.Auth;

public static class AuthSetup
{
    public static IServiceCollection AddInventoryAuth(
        this IServiceCollection services,
        IConfiguration config,
        IHostEnvironment env)
    {
        var tenantId = config["Entra:TenantId"];
        var audience = config["Entra:Audience"];
        var entraConfigured = !string.IsNullOrWhiteSpace(tenantId) && !string.IsNullOrWhiteSpace(audience);

        if (entraConfigured && env.IsDevelopment())
        {
            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = AuthSchemes.SmartBearer;
                    options.DefaultChallengeScheme = AuthSchemes.SmartBearer;
                })
                .AddPolicyScheme(AuthSchemes.SmartBearer, AuthSchemes.SmartBearer, options =>
                {
                    options.ForwardDefaultSelector = context =>
                    {
                        var authHeader = context.Request.Headers.Authorization.ToString();
                        if (string.IsNullOrWhiteSpace(authHeader)
                            || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                        {
                            return AuthSchemes.DevJwt;
                        }

                        var token = authHeader["Bearer ".Length..].Trim();
                        return IsEntraAccessToken(token) ? AuthSchemes.Entra : AuthSchemes.DevJwt;
                    };
                })
                .AddJwtBearer(AuthSchemes.DevJwt, options => ConfigureDevJwt(options, config))
                .AddJwtBearer(AuthSchemes.Entra, options => ConfigureEntraJwt(options, config, tenantId!, audience!));
        }
        else if (entraConfigured)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => ConfigureEntraJwt(options, config, tenantId!, audience!));
        }
        else
        {
            services.AddAuthentication(AuthSchemes.Dev)
                .AddScheme<DevAuthOptions, DevAuthHandler>(AuthSchemes.Dev, _ => { });
        }

        services.AddAuthorization();
        services.AddSingleton<DevJwtTokenService>();
        services.AddScoped<EntraUserProvisioner>();
        return services;
    }

    public static async Task ProvisionUserAsync(HttpContext ctx, InventoryDbContext db, CancellationToken ct)
    {
        if (ctx.User.Identity?.IsAuthenticated != true) return;

        var scheme = ctx.User.Identity.AuthenticationType;
        if (scheme == AuthSchemes.Entra || scheme == JwtBearerDefaults.AuthenticationScheme)
            return;

        var email = ctx.User.FindFirstValue(ClaimTypes.Email)
                    ?? ctx.User.FindFirstValue("preferred_username")
                    ?? ctx.User.FindFirstValue(ClaimTypes.Upn);
        if (string.IsNullOrWhiteSpace(email)) return;

        var user = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.Trim().ToLower(), ct);
        if (user is null) return;

        var identity = (ClaimsIdentity)ctx.User.Identity!;
        ReplaceClaim(identity, "app_user_id", user.Id.ToString());
        ReplaceClaim(identity, "mech_role", user.Role);
    }

    private static void ConfigureDevJwt(JwtBearerOptions options, IConfiguration config)
    {
        var jwt = new DevJwtTokenService(config);
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = jwt.ValidationParameters;
    }

    private static void ConfigureEntraJwt(
        JwtBearerOptions options,
        IConfiguration config,
        string tenantId,
        string audience)
    {
        options.Authority = $"https://login.microsoftonline.com/{tenantId}/v2.0";
        var validAudiences = BuildValidEntraAudiences(audience);
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuers = BuildValidEntraIssuers(tenantId),
            ValidAudiences = validAudiences,
            ClockSkew = TimeSpan.FromSeconds(30)
        };
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var provisioner = context.HttpContext.RequestServices
                    .GetRequiredService<EntraUserProvisioner>();
                await provisioner.ProvisionAsync(context);
            },
            OnChallenge = async context =>
            {
                context.HandleResponse();
                if (context.Response.HasStarted) return;

                var detail = context.AuthenticateFailure?.Message
                             ?? context.ErrorDescription
                             ?? "Требуется авторизация.";

                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/problem+json";
                await context.Response.WriteAsJsonAsync(new
                {
                    type = "about:blank",
                    title = "unauthorized",
                    status = 401,
                    code = "unauthorized",
                    detail
                });
            }
        };
    }

    private static void ReplaceClaim(ClaimsIdentity identity, string type, string value)
    {
        var existing = identity.FindFirst(type);
        if (existing is not null) identity.RemoveClaim(existing);
        identity.AddClaim(new Claim(type, value));
    }

    private static bool IsEntraAccessToken(string token)
    {
        try
        {
            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(token))
                return false;

            var issuer = handler.ReadJwtToken(token).Issuer;
            return issuer.Contains("login.microsoftonline.com", StringComparison.OrdinalIgnoreCase)
                   || issuer.Contains("sts.windows.net", StringComparison.OrdinalIgnoreCase);
        }
        catch
        {
            return false;
        }
    }

    private static IEnumerable<string> BuildValidEntraAudiences(string configuredAudience)
    {
        var aud = configuredAudience.Trim();
        if (string.IsNullOrWhiteSpace(aud))
            return Array.Empty<string>();

        if (!aud.StartsWith("api://", StringComparison.OrdinalIgnoreCase))
            return new[] { aud };

        var guidAudience = aud["api://".Length..];
        return string.IsNullOrWhiteSpace(guidAudience)
            ? new[] { aud }
            : new[] { aud, guidAudience };
    }

    private static IEnumerable<string> BuildValidEntraIssuers(string tenantId)
    {
        var tid = tenantId.Trim();
        return new[]
        {
            $"https://login.microsoftonline.com/{tid}/v2.0",
            $"https://sts.windows.net/{tid}/",
            $"https://sts.windows.net/{tid}"
        };
    }
}

public sealed class DevAuthOptions : AuthenticationSchemeOptions;

public sealed class DevAuthHandler(
    IOptionsMonitor<DevAuthOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder,
    IConfiguration config,
    DevJwtTokenService jwt)
    : AuthenticationHandler<DevAuthOptions>(options, logger, encoder)
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var authHeader = Request.Headers.Authorization.FirstOrDefault();
        if (authHeader?.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase) == true)
        {
            var token = authHeader["Bearer ".Length..].Trim();
            if (!string.IsNullOrEmpty(token))
            {
                var principal = jwt.Validate(token);
                if (principal is not null)
                {
                    return Task.FromResult(AuthenticateResult.Success(
                        new AuthenticationTicket(principal, Scheme.Name)));
                }
            }
        }

        var email = Request.Headers["X-Dev-User-Email"].FirstOrDefault()
                    ?? config["DevAuth:Email"]
                    ?? "mechanic@tansu.local";

        var claims = new[]
        {
            new Claim(ClaimTypes.Email, email),
            new Claim("preferred_username", email),
            new Claim(ClaimTypes.Name, email)
        };
        var identity = new ClaimsIdentity(claims, Scheme.Name);
        return Task.FromResult(AuthenticateResult.Success(
            new AuthenticationTicket(new ClaimsPrincipal(identity), Scheme.Name)));
    }
}
