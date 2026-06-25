using System.Text.Json;
using Tnsu.Inventory.Application.Common.Exceptions;

namespace Tnsu.Inventory.Api.Middleware;

public sealed class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext ctx)
    {
        try
        {
            await next(ctx);
        }
        catch (AppException ex)
        {
            var status = ex switch
            {
                UnauthorizedException => StatusCodes.Status401Unauthorized,
                ForbiddenException => StatusCodes.Status403Forbidden,
                NotFoundException => StatusCodes.Status404NotFound,
                ConflictException => StatusCodes.Status409Conflict,
                ValidationFailedException => StatusCodes.Status422UnprocessableEntity,
                _ => StatusCodes.Status400BadRequest
            };
            ctx.Response.StatusCode = status;
            ctx.Response.ContentType = "application/json";
            await ctx.Response.WriteAsync(JsonSerializer.Serialize(new { code = ex.Code, message = ex.Message }));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            ctx.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await ctx.Response.WriteAsync(JsonSerializer.Serialize(new { code = "internal_error", message = "Внутренняя ошибка сервера." }));
        }
    }
}
