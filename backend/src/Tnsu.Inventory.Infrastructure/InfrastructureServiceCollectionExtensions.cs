using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Infrastructure.Approvals;
using Tnsu.Inventory.Infrastructure.Dictionary1C;
using Tnsu.Inventory.Infrastructure.Notifications;
using Tnsu.Inventory.Infrastructure.Persistence;
using Tnsu.Inventory.Infrastructure.Procurement;
using Tnsu.Inventory.Infrastructure.Storage;

namespace Tnsu.Inventory.Infrastructure;

public static class InfrastructureServiceCollectionExtensions
{
    public static IServiceCollection AddInventoryInfrastructure(
        this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<AppOptions>(configuration.GetSection(AppOptions.SectionName));
        services.Configure<NotificationsOptions>(configuration.GetSection(NotificationsOptions.SectionName));
        services.Configure<Dictionary1COptions>(configuration.GetSection(Dictionary1COptions.SectionName));
        services.Configure<SharePointOptions>(configuration.GetSection(SharePointOptions.SectionName));
        services.Configure<TeamsOptions>(configuration.GetSection(TeamsOptions.SectionName));
        services.Configure<ProcurementOptions>(configuration.GetSection(ProcurementOptions.SectionName));

        services.AddDbContext<InventoryDbContext>(opt =>
            opt.UseNpgsql(configuration.GetConnectionString("Postgres")));

        services.AddScoped<IInventoryDbContext>(sp => sp.GetRequiredService<InventoryDbContext>());
        services.AddSingleton<Dictionary1CTokenProvider>();
        services.AddHttpClient<IDictionary1CClient, HttpDictionary1CClient>();
        services.AddHttpClient<IZupEmployeeClient, HttpZupEmployeeClient>();
        services.AddHttpClient<Dictionary1CTokenProvider>();
        services.AddSingleton<LocalAttachmentStorage>();
        services.AddHttpClient<SharePointAttachmentStorage>();
        services.AddScoped<IAttachmentStorage>(sp =>
        {
            var spOpts = sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<SharePointOptions>>().Value;
            return spOpts.IsConfigured
                ? sp.GetRequiredService<SharePointAttachmentStorage>()
                : sp.GetRequiredService<LocalAttachmentStorage>();
        });
        services.AddSingleton<NotificationUrlResolver>();
        services.AddSingleton<SmtpNotificationService>();
        services.AddHttpClient<TeamsNotificationService>();
        services.AddHttpClient<PowerAutomateNotificationService>();
        services.AddSingleton<INotificationService, CompositeNotificationService>();
        services.AddHttpClient<HttpProcurementBridge>();
        services.AddScoped<IProcurementBridge>(sp =>
        {
            var opts = sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<ProcurementOptions>>().Value;
            return opts.IsConfigured
                ? sp.GetRequiredService<HttpProcurementBridge>()
                : sp.GetRequiredService<LocalProcurementBridge>();
        });
        services.AddSingleton<LocalProcurementBridge>();
        services.AddHostedService<ApprovalSlaMonitorHostedService>();

        return services;
    }
}
