using System.Text;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Domain.Enums;

namespace Tnsu.Inventory.Application.DefectActs;

public static class DefectActPrintService
{
    public static async Task<string> BuildHtmlAsync(IInventoryDbContext db, Guid actId, CancellationToken ct)
    {
        var act = await db.DefectActs
            .Include(a => a.Parts)
            .Include(a => a.CreatedBy)
            .FirstAsync(a => a.Id == actId, ct);

        var approvals = await db.ApprovalSteps.AsNoTracking()
            .Include(s => s.Approver)
            .Where(s => s.DefectActId == actId && s.Status != ApprovalStepStatus.Skipped)
            .OrderBy(s => s.OrderNo)
            .ToListAsync(ct);

        var sb = new StringBuilder();
        sb.Append("""
            <!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"/>
            <title>Дефектный акт</title>
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

        sb.Append($"<h1>ДЕФЕКТНЫЙ АКТ № {Escape(act.Number)}</h1>");
        sb.Append($"<p style=\"text-align:center\">от {act.CreatedAt.LocalDateTime:dd.MM.yyyy}</p>");

        sb.Append("<table class=\"meta\"><tbody>");
        AppendRow(sb, "Проект", $"{Escape(act.ProjectCode)} — {Escape(act.ProjectName)}");
        AppendRow(sb, "Техника (ОС)", Escape(act.VehicleName));
        AppendRow(sb, "Группа", Escape(act.VehicleGroupName));
        AppendRow(sb, "Гос. номер", Escape(act.StateNumber));
        AppendRow(sb, "VIN", string.IsNullOrWhiteSpace(act.VinCode) ? "—" : Escape(act.VinCode));
        AppendRow(sb, "Год выпуска", act.VehicleYear?.ToString() ?? "—");
        AppendRow(sb, "Инициатор", Escape(act.CreatedBy?.FullName ?? "—"));
        AppendRow(sb, "Статус", Escape(WorkflowStatus.Label(act.Status)));
        sb.Append("</tbody></table>");

        sb.Append("<p><strong>Описание неисправности:</strong></p>");
        sb.Append($"<p>{Escape(act.MalfunctionDescription).Replace("\n", "<br/>")}</p>");

        sb.Append("<p><strong>Требуемые запчасти / материалы:</strong></p>");
        sb.Append("<table class=\"items\"><thead><tr><th>№</th><th>Наименование</th><th>Кат. №</th><th>Кол-во</th><th>Ед.</th></tr></thead><tbody>");
        foreach (var p in act.Parts.OrderBy(x => x.LineNo))
        {
            sb.Append($"<tr><td>{p.LineNo}</td><td>{Escape(p.Name)}</td><td>{Escape(p.CatalogNumber ?? "—")}</td><td>{p.Quantity}</td><td>{Escape(p.Unit ?? "—")}</td></tr>");
        }
        if (act.Parts.Count == 0)
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

public sealed record GetDefectActPrintQuery(Guid Id) : IRequest<string>;

public sealed class GetDefectActPrintHandler(IInventoryDbContext db)
    : IRequestHandler<GetDefectActPrintQuery, string>
{
    public Task<string> Handle(GetDefectActPrintQuery q, CancellationToken ct) =>
        DefectActPrintService.BuildHtmlAsync(db, q.Id, ct);
}
