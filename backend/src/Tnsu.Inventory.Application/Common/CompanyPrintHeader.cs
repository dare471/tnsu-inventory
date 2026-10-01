using Tnsu.Inventory.Domain;

namespace Tnsu.Inventory.Application.Common;

internal static class CompanyPrintHeader
{
    public static string Html() =>
        $"""
        <p style="margin:0 0 12px;font-size:11pt">
          <strong>{System.Net.WebUtility.HtmlEncode(CompanyRequisites.LegalName)}</strong>
        </p>
        """;
}
