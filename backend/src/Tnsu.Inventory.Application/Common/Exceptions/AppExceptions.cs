namespace Tnsu.Inventory.Application.Common.Exceptions;

public abstract class AppException(string code, string message) : Exception(message)
{
    public string Code { get; } = code;
}

public sealed class NotFoundException(string entity, Guid id)
    : AppException("not_found", $"{entity} {id} не найден.");

public sealed class ForbiddenException(string message)
    : AppException("forbidden", message);

public sealed class UnauthorizedException()
    : AppException("unauthorized", "Требуется авторизация.");

public sealed class ValidationFailedException(string message)
    : AppException("validation_failed", message);

public sealed class ConflictException(string code, string message)
    : AppException(code, message);
