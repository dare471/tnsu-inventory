using System.Security.Claims;
using Tnsu.Inventory.Application.Common.Interfaces;

namespace Tnsu.Inventory.Api.Auth;

public sealed class CurrentUserAccessor(IHttpContextAccessor http) : ICurrentUser
{
    public Guid? UserId
    {
        get
        {
            var id = http.HttpContext?.User.FindFirstValue("app_user_id");
            return Guid.TryParse(id, out var guid) ? guid : null;
        }
    }

    public string? Email => http.HttpContext?.User.FindFirstValue(ClaimTypes.Email)
                            ?? http.HttpContext?.User.FindFirstValue("preferred_username");

    public string? Role => http.HttpContext?.User.FindFirstValue("mech_role");
}
