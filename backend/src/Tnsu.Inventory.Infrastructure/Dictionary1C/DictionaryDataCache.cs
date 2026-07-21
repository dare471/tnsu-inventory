using System.Collections.Concurrent;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Tnsu.Inventory.Infrastructure.Dictionary1C;

public sealed class DictionaryDataCache(
    IServiceScopeFactory scopeFactory,
    ILogger<DictionaryDataCache> logger)
{
    private sealed record Entry(DateTimeOffset FreshUntil, object Value);

    private static readonly TimeSpan FreshTtl = TimeSpan.FromMinutes(15);
    private static readonly TimeSpan EmptyTtl = TimeSpan.FromMinutes(1);

    private readonly ConcurrentDictionary<string, Entry> _entries = new();
    private readonly ConcurrentDictionary<string, byte> _refreshing = new();

    public async Task<IReadOnlyList<T>> GetOrLoadAsync<T>(
        string key,
        Func<IServiceProvider, CancellationToken, Task<IReadOnlyList<T>>> factory,
        CancellationToken ct)
    {
        if (_entries.TryGetValue(key, out var entry) && entry.Value is IReadOnlyList<T> cached)
        {
            if (entry.FreshUntil > DateTimeOffset.UtcNow)
                return cached;

            // Просрочено: отдаём старые данные сразу, обновляем в фоне (один рефреш на ключ).
            if (_refreshing.TryAdd(key, 0))
            {
                _ = Task.Run(async () =>
                {
                    try
                    {
                        using var scope = scopeFactory.CreateScope();
                        var fresh = await factory(scope.ServiceProvider, CancellationToken.None);
                        if (fresh.Count > 0)
                            Store(key, fresh);
                    }
                    catch (Exception ex)
                    {
                        logger.LogWarning(ex, "Dictionary cache refresh failed for {Key}", key);
                    }
                    finally
                    {
                        _refreshing.TryRemove(key, out _);
                    }
                });
            }

            return cached;
        }

        using var loadScope = scopeFactory.CreateScope();
        var value = await factory(loadScope.ServiceProvider, ct);
        Store(key, value);
        return value;
    }

    private void Store<T>(string key, IReadOnlyList<T> value)
    {
        var ttl = value.Count == 0 ? EmptyTtl : FreshTtl;
        _entries[key] = new Entry(DateTimeOffset.UtcNow.Add(ttl), value);
    }
}
