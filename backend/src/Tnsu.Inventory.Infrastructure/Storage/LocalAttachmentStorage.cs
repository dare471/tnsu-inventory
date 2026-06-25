using Microsoft.Extensions.Options;
using Tnsu.Inventory.Application.Common.Interfaces;

namespace Tnsu.Inventory.Infrastructure.Storage;

public sealed class LocalAttachmentStorage(IOptions<AppOptions> options) : IAttachmentStorage
{
    public async Task<string> SaveAsync(Stream content, string fileName, CancellationToken ct)
    {
        var root = options.Value.AttachmentStoragePath;
        Directory.CreateDirectory(root);
        var safeName = $"{Guid.NewGuid():N}_{Path.GetFileName(fileName)}";
        var path = Path.Combine(root, safeName);
        await using var fs = File.Create(path);
        await content.CopyToAsync(fs, ct);
        return safeName;
    }

    public Task<Stream> OpenReadAsync(string storagePath, CancellationToken ct)
    {
        var path = Path.Combine(options.Value.AttachmentStoragePath, storagePath);
        Stream stream = File.OpenRead(path);
        return Task.FromResult(stream);
    }
}
