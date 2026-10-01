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
        var root = options.Value.AttachmentStoragePath;
        var direct = Path.GetFullPath(Path.Combine(root, storagePath));
        var rootFull = Path.GetFullPath(root);
        if (!direct.StartsWith(rootFull, StringComparison.Ordinal))
            throw new FileNotFoundException("Вложение не найдено.", storagePath);

        if (File.Exists(direct))
            return Task.FromResult<Stream>(File.OpenRead(direct));

        var fileName = Path.GetFileName(storagePath);
        if (!string.IsNullOrEmpty(fileName) && Directory.Exists(rootFull))
        {
            var match = Directory.EnumerateFiles(rootFull, "*" + fileName, SearchOption.AllDirectories)
                .FirstOrDefault(path => Path.GetFullPath(path).StartsWith(rootFull, StringComparison.Ordinal));
            if (match is not null)
                return Task.FromResult<Stream>(File.OpenRead(match));
        }

        throw new FileNotFoundException("Вложение не найдено.", storagePath);
    }
}
