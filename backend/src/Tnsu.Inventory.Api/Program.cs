using Tnsu.Inventory.Api.Auth;
using Tnsu.Inventory.Api.Endpoints;
using Tnsu.Inventory.Api.Middleware;
using Tnsu.Inventory.Application;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Infrastructure;
using Tnsu.Inventory.Infrastructure.Persistence;

using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(o =>
{
    o.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    o.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.AddInventoryInfrastructure(builder.Configuration);
builder.Services.AddInventoryApplication();
builder.Services.AddInventoryAuth(builder.Configuration, builder.Environment);
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, CurrentUserAccessor>();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddOpenApi();
builder.Services.AddHealthChecks();

var app = builder.Build();

await DbInitializer.InitializeAsync(app.Services);

app.UseMiddleware<ExceptionMiddleware>();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.Use(async (ctx, next) =>
{
    if (ctx.User.Identity?.IsAuthenticated == true)
    {
        await using var scope = app.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<InventoryDbContext>();
        await AuthSetup.ProvisionUserAsync(ctx, db, ctx.RequestAborted);
    }
    await next();
});

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.MapHealthChecks("/health");
app.MapAuthEndpoints(app.Environment);
app.MapInventoryEndpoints();

app.Run();

public partial class Program;
