using MediatR;
using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Exceptions;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Domain;
using Tnsu.Inventory.Domain.Entities;

namespace Tnsu.Inventory.Application.Attachments;

public sealed record AttachmentDto(
    Guid Id,
    string FileName,
    string Category,
    long SizeBytes,
    string? SharePointUrl,
    DateTimeOffset UploadedAt);

public sealed record UploadPurchaseAttachmentCommand(
    Guid PurchaseRequestId,
    string Category,
    string FileName,
    string ContentType,
    Stream Content) : IRequest<AttachmentDto>;

public sealed class UploadPurchaseAttachmentHandler(
    IInventoryDbContext db,
    IAttachmentStorage storage,
    ICurrentUser currentUser) : IRequestHandler<UploadPurchaseAttachmentCommand, AttachmentDto>
{
    public async Task<AttachmentDto> Handle(UploadPurchaseAttachmentCommand cmd, CancellationToken ct)
    {
        var userId = currentUser.UserId ?? throw new UnauthorizedException();
        var request = await db.PurchaseRequests.FirstOrDefaultAsync(r => r.Id == cmd.PurchaseRequestId, ct)
            ?? throw new NotFoundException("PurchaseRequest", cmd.PurchaseRequestId);

        if (request.Status is not Domain.Enums.WorkflowStatus.Draft
            and not Domain.Enums.WorkflowStatus.Returned)
            throw new ConflictException("not_editable", "Вложения можно добавлять только в черновике или после возврата.");

        if (currentUser.UserId != request.CreatedByUserId)
            throw new ForbiddenException("Только автор может прикреплять файлы.");

        using var buffer = new MemoryStream();
        await cmd.Content.CopyToAsync(buffer, ct);
        buffer.Position = 0;
        var sizeBytes = buffer.Length;

        var storagePath = await storage.SaveAsync(buffer, cmd.FileName, ct);
        buffer.Position = 0;

        var sharePointUrl = storage is ISharePointAwareStorage sp
            ? await sp.GetPublicUrlAsync(storagePath, ct)
            : null;

        var attachment = new DocumentAttachment
        {
            DocumentType = DocumentTypes.PurchaseRequest,
            PurchaseRequestId = request.Id,
            Category = cmd.Category,
            FileName = cmd.FileName,
            ContentType = cmd.ContentType,
            SizeBytes = sizeBytes,
            StoragePath = storagePath,
            SharePointUrl = sharePointUrl,
            UploadedByUserId = userId
        };

        if (cmd.Category == AttachmentCategories.ServiceNote)
            request.HasServiceNoteAttachment = true;

        db.Attachments.Add(attachment);
        request.UpdatedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);

        return new AttachmentDto(attachment.Id, attachment.FileName, attachment.Category,
            attachment.SizeBytes, attachment.SharePointUrl, attachment.UploadedAt);
    }
}

public sealed record ListPurchaseAttachmentsQuery(Guid PurchaseRequestId) : IRequest<IReadOnlyList<AttachmentDto>>;

public sealed class ListPurchaseAttachmentsHandler(IInventoryDbContext db)
    : IRequestHandler<ListPurchaseAttachmentsQuery, IReadOnlyList<AttachmentDto>>
{
    public async Task<IReadOnlyList<AttachmentDto>> Handle(ListPurchaseAttachmentsQuery q, CancellationToken ct) =>
        await db.Attachments.AsNoTracking()
            .Where(a => a.PurchaseRequestId == q.PurchaseRequestId)
            .OrderByDescending(a => a.UploadedAt)
            .Select(a => new AttachmentDto(a.Id, a.FileName, a.Category, a.SizeBytes, a.SharePointUrl, a.UploadedAt))
            .ToListAsync(ct);
}

public sealed record DownloadAttachmentQuery(Guid Id) : IRequest<(Stream Stream, string FileName, string ContentType)>;

public sealed class DownloadAttachmentHandler(IInventoryDbContext db, IAttachmentStorage storage)
    : IRequestHandler<DownloadAttachmentQuery, (Stream, string, string)>
{
    public async Task<(Stream, string, string)> Handle(DownloadAttachmentQuery q, CancellationToken ct)
    {
        var att = await db.Attachments.AsNoTracking().FirstOrDefaultAsync(a => a.Id == q.Id, ct)
            ?? throw new NotFoundException("Attachment", q.Id);

        var stream = await storage.OpenReadAsync(att.StoragePath, ct);
        return (stream, att.FileName, att.ContentType);
    }
}
