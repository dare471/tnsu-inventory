using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Tnsu.Inventory.Api.Auth;

public sealed class DevJwtTokenService(IConfiguration config)
{
    public const string Issuer = "tnsu-inventory-dev";
    public const string Audience = "tnsu-inventory-dev";

    private SymmetricSecurityKey SigningKey => new(Encoding.UTF8.GetBytes(
        config["DevAuth:JwtSecret"]
        ?? "tnsu-inventory-dev-secret-min-32-characters!!"));

    public TokenValidationParameters ValidationParameters => new()
    {
        ValidateIssuer = true,
        ValidIssuer = Issuer,
        ValidateAudience = true,
        ValidAudience = Audience,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = SigningKey,
        ClockSkew = TimeSpan.FromSeconds(30)
    };

    public (string AccessToken, DateTimeOffset ExpiresAt) IssueToken(string email, Guid userId)
    {
        var expires = DateTimeOffset.UtcNow.AddDays(7);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim("preferred_username", email)
        };
        var creds = new SigningCredentials(SigningKey, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            Issuer,
            Audience,
            claims,
            expires: expires.UtcDateTime,
            signingCredentials: creds);
        return (new JwtSecurityTokenHandler().WriteToken(token), expires);
    }

    public ClaimsPrincipal? Validate(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        try
        {
            return handler.ValidateToken(token, ValidationParameters, out _);
        }
        catch
        {
            return null;
        }
    }
}
