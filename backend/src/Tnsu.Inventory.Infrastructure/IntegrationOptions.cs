namespace Tnsu.Inventory.Infrastructure;

public sealed class SharePointOptions
{
    public const string SectionName = "SharePoint";

    public bool Enabled { get; set; }
    public string SiteUrl { get; set; } = "https://tnsukz.sharepoint.com/sites/kps";
    public string DocumentLibrary { get; set; } = "MechanizationAttachments";
    public string TenantId { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;

    /// <summary>Имя списка SharePoint: «Справочник запчастей по технике» (URL Lists/List8).</summary>
    public string SparePartsListName { get; set; } = "List8";

    /// <summary>
    /// Внутренние имена колонок (StaticName). Если пусто — подбор по DisplayName:
    /// Наименование ТМЦ, Нормализованная модель, Группа, Ед. изм.
    /// </summary>
    public string? SparePartsNameField { get; set; }
    public string? SparePartsCatalogNumberField { get; set; }
    public string? SparePartsCodeField { get; set; }
    public string? SparePartsUnitField { get; set; }
    public string? SparePartsVehicleField { get; set; }
    public string? SparePartsGroupField { get; set; }

    public bool IsConfigured =>
        Enabled &&
        !string.IsNullOrWhiteSpace(TenantId) &&
        !string.IsNullOrWhiteSpace(ClientId) &&
        !string.IsNullOrWhiteSpace(ClientSecret);
}

public sealed class NotificationsOptions
{
    public const string SectionName = "Notifications";

    public NotificationEmailOptions Email { get; set; } = new();
    public PowerAutomateOptions PowerAutomate { get; set; } = new();
}

public sealed class NotificationEmailOptions
{
    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 1025;
    public bool UseStartTls { get; set; }
    public string FromEmail { get; set; } = "portal@tnsu.kz";
    public string FromName { get; set; } = "TNSU Portal";
    public string? Username { get; set; }
    public string? Password { get; set; }

    public bool HasCredentials =>
        !string.IsNullOrWhiteSpace(Username) && !string.IsNullOrWhiteSpace(Password);
}

public sealed class TeamsOptions
{
    public const string SectionName = "Teams";

    public string? WebhookUrl { get; set; }
    public bool IsConfigured => !string.IsNullOrWhiteSpace(WebhookUrl);
}

public sealed class PowerAutomateOptions
{
    public string? FlowUrl { get; set; }
    public string? FlowId { get; set; }
    public string? EnvironmentId { get; set; }

    public string? TenantId { get; set; }
    public string? ClientId { get; set; }
    public string? ClientSecret { get; set; }

    // Двойной слэш обязателен: audience должен получиться "https://service.flow.microsoft.com/"
    // с завершающим слэшем, иначе flow отвечает MisMatchingOAuthClaims.
    public string Scope { get; set; } = "https://service.flow.microsoft.com//.default";

    public bool IsConfigured => !string.IsNullOrWhiteSpace(FlowUrl);

    public bool RequiresOAuth =>
        !string.IsNullOrWhiteSpace(TenantId) &&
        !string.IsNullOrWhiteSpace(ClientId) &&
        !string.IsNullOrWhiteSpace(ClientSecret);
}

public static class PowerAutomateNotificationStatus
{
    public const string Assigned = "На согласовании";
    public const string AwaitingExecution = "На исполнение";
    public const string Approved = "Согласовано";
    public const string Rejected = "Отклонено";
    public const string Returned = "Возврат на доработку";
}

public sealed class ProcurementOptions
{
    public const string SectionName = "Procurement";

    public string? BaseUrl { get; set; }
    public bool IsConfigured => !string.IsNullOrWhiteSpace(BaseUrl);
}
