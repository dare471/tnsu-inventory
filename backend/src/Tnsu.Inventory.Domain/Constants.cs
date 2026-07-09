namespace Tnsu.Inventory.Domain;

public static class DocumentTypes
{
    public const string DefectAct = "defect_act";
    public const string PurchaseRequest = "purchase_request";
}

public static class AttachmentCategories
{
    public const string General = "general";
    public const string ServiceNote = "service_note";
    public const string DefectPhoto = "defect_photo";
}

public static class BusinessRules
{
    public const decimal PurchaseLimitKzt = 500_000m;
    public const int SlaWorkingDays = 1;

    public const string LimitExceededMessage =
        "Сумма заявки превышает 500 000 ₸. Прикрепите СТ (служебную записку) с обоснованием — без неё отправка запрещена регламентом.";
}
