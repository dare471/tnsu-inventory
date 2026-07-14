using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.Common;

internal static class DocumentListScope
{
    public static bool IsGlobalAdmin(ICurrentUser user) =>
        user.Role is MechanizationRole.ChiefMechanic
            or MechanizationRole.CommercialDirector
            or MechanizationRole.OmtsHead;
}
