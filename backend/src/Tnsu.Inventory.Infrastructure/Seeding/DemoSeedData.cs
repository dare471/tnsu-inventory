namespace Tnsu.Inventory.Infrastructure.Seeding;

public static class DemoSeedData
{
    public const string DaurenEmail = "onglassyn.dauren@tnsukz.onmicrosoft.com";
    public const string DaurenFullName = "Дәурен Оңласын";

    public const string TrishinaEmail = "m.trishina@kgnt.kz";
    public const string TrishinaFullName = "Тришина M.";

    public const string MechanicEmail = "mechanic@tansu.local";
    public const string MechanicFullName = "Механик участка";

    public const string SeedDefectActNumber = "DA-00001";
    public const string SeedPurchaseDraftNumber = "PR-00001";
    public const string SeedPurchaseApprovalNumber = "PR-00002";

    public static readonly Guid DemoProjectId =
        Guid.Parse("ec3c9aa7-29ef-4725-11ee-50903dd59e16");

    public const string DemoProjectCode = "БК0000001";
    public const string DemoProjectName =
        "Строительство завода по производству меди Беркара ARX-0015-01-21";

    public static readonly Guid DemoVehicleId =
        Guid.Parse("5000b296-4856-b5c4-11ed-97fcfbcaa218");

    public const string DemoVehicleGroup = "МАЛАЯ МЕХАНИЗАЦИЯ";
    public const string DemoVehicleName = "ГЕНЕРАТОР ДИЗЕЛЬНЫЙ AKSA APD145C / БК0001037";
    public const string DemoStateNumber = "БК0001037";
}
