using System.Text;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.PurchaseRequests;

public static class PurchaseRequestPrintService
{
    public static async Task<string> BuildHtmlAsync(IInventoryDbContext db, Guid requestId, CancellationToken ct)
    {
        var request = await db.PurchaseRequests
            .Include(r => r.Lines)
            .Include(r => r.CreatedBy)
            .Include(r => r.AssignedExecutor)
            .Include(r => r.DefectAct)
            .FirstAsync(r => r.Id == requestId, ct);

        var approvals = await db.ApprovalSteps.AsNoTracking()
            .Include(s => s.Approver)
            .Where(s => s.PurchaseRequestId == requestId && s.Status != ApprovalStepStatus.Skipped)
            .OrderBy(s => s.OrderNo)
            .ToListAsync(ct);

        var sb = new StringBuilder();
        sb.Append("""
            <!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"/>
            <title>Заявка на закупку</title>
            <style>
              body{font-family:"Times New Roman",serif;font-size:12pt;margin:24px;color:#000}
              h1{text-align:center;font-size:14pt;margin-bottom:4px}
              .meta{width:100%;border-collapse:collapse;margin:16px 0}
              .meta td,.meta th{border:1px solid #000;padding:6px 8px;vertical-align:top}
              .meta th{width:28%;font-weight:normal;text-align:left;background:#f5f5f5}
              table.items{width:100%;border-collapse:collapse;margin-top:12px}
              table.items th,table.items td{border:1px solid #000;padding:5px 8px}
              table.items th{background:#eee}
              .sign{margin-top:24px}
              @media print{body{margin:12mm}}
            </style></head><body>
            """);

        sb.Append($"<h1>ЗАЯВКА НА ЗАКУПКУ ТМЦ № {Escape(request.Number)}</h1>");
        sb.Append($"<p style=\"text-align:center\">от {request.CreatedAt.LocalDateTime:dd.MM.yyyy}</p>");

        sb.Append("<table class=\"meta\"><tbody>");
        AppendRow(sb, "Проект", $"{Escape(request.ProjectCode)} — {Escape(request.ProjectName)}");
        AppendRow(sb, "Техника", Escape(request.VehicleName));
        AppendRow(sb, "Группа", Escape(request.VehicleGroupName));
        AppendRow(sb, "Гос. номер", Escape(request.StateNumber));
        AppendRow(sb, "VIN", string.IsNullOrWhiteSpace(request.VinCode) ? "—" : Escape(request.VinCode));
        AppendRow(sb, "Год выпуска", request.VehicleYear?.ToString() ?? "—");
        if (request.DefectAct is not null)
            AppendRow(sb, "Дефектный акт", Escape(request.DefectAct.Number));
        AppendRow(sb, "Инициатор", Escape(request.CreatedBy?.FullName ?? "—"));
        AppendRow(sb, "Статус", Escape(WorkflowStatus.Label(request.Status)));
        if (request.AssignedExecutor is not null)
            AppendRow(sb, "Исполнитель ОМТС", Escape(request.AssignedExecutor.FullName));
        sb.Append("</tbody></table>");

        sb.Append("<p><strong>Описание / обоснование:</strong></p>");
        sb.Append($"<p>{Escape(request.Description).Replace("\n", "<br/>")}</p>");

        sb.Append("<p><strong>Позиции:</strong></p>");
        sb.Append("<table class=\"items\"><thead><tr><th>№</th><th>Наименование</th><th>Кат. №</th><th>Кол-во</th><th>Ед.</th></tr></thead><tbody>");
        foreach (var line in request.Lines.OrderBy(x => x.LineNo))
        {
            sb.Append($"<tr><td>{line.LineNo}</td><td>{Escape(line.Name)}</td><td>{Escape(line.CatalogNumber ?? "—")}</td><td>{line.Quantity}</td><td>{Escape(line.Unit ?? "—")}</td></tr>");
        }
        if (request.Lines.Count == 0)
            sb.Append("<tr><td colspan=\"5\">—</td></tr>");
        sb.Append("</tbody></table>");

        if (approvals.Count > 0)
        {
            sb.Append("<p><strong>Согласование:</strong></p><table class=\"items\"><thead><tr><th>Шаг</th><th>Роль</th><th>ФИО</th><th>Решение</th><th>Дата</th></tr></thead><tbody>");
            foreach (var s in approvals)
            {
                var decisionLabel = s.Action is null
                    ? ApprovalStepStatus.Label(s.Status)
                    : ApprovalAction.Label(s.Action);
                sb.Append($"<tr><td>{s.OrderNo}</td><td>{Escape(MechanizationRole.Label(s.ApproverRole))}</td><td>{Escape(s.Approver?.FullName ?? "—")}</td><td>{Escape(decisionLabel)}</td><td>{s.DecidedAt?.LocalDateTime.ToString("dd.MM.yyyy HH:mm") ?? "—"}</td></tr>");
            }
            sb.Append("</tbody></table>");
        }

        sb.Append("""
            <div class="sign">
              <p>Механик участка: ___________________ / ___________________</p>
              <p>Главный механик: ___________________ / ___________________</p>
            </div>
            <script>window.onload=()=>window.print()</script>
            </body></html>
            """);

        return sb.ToString();
    }

    private static void AppendRow(StringBuilder sb, string label, string value) =>
        sb.Append($"<tr><th>{Escape(label)}</th><td>{value}</td></tr>");

    private static string Escape(string? v) =>
        System.Net.WebUtility.HtmlEncode(v ?? "");
}

public sealed record GetPurchaseRequestPrintQuery(Guid Id) : IRequest<string>;

public sealed class GetPurchaseRequestPrintHandler(IInventoryDbContext db)
    : IRequestHandler<GetPurchaseRequestPrintQuery, string>
{
    public Task<string> Handle(GetPurchaseRequestPrintQuery q, CancellationToken ct) =>
        PurchaseRequestPrintService.BuildHtmlAsync(db, q.Id, ct);
}
