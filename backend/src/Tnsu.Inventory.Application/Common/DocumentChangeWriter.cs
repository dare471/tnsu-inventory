using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Domain.Entities;

namespace Tnsu.Inventory.Application.Common;

internal static class DocumentChangeWriter
{
    public static async Task AddAsync(
        IInventoryDbContext db,
        ICurrentUser currentUser,
        string documentType,
        Guid documentId,
        string action,
        string summary,
        CancellationToken ct)
    {
        var name = "—";
        if (currentUser.UserId is Guid userId)
        {
            name = await db.Users.AsNoTracking()
                .Where(u => u.Id == userId)
                .Select(u => u.FullName)
                .FirstOrDefaultAsync(ct) ?? currentUser.Email ?? "—";
        }

        db.DocumentChanges.Add(new DocumentChangeEntry
        {
            DocumentType = documentType,
            DocumentId = documentId,
            UserId = currentUser.UserId,
            UserFullName = name,
            Action = action,
            Summary = summary.Length > 2000 ? summary[..2000] : summary
        });
    }
}
