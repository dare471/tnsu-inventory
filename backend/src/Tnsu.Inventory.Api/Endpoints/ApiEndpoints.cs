using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tnsu.Inventory.Application.Common.Interfaces;
using Tnsu.Inventory.Application.Approvals.Commands;
using Tnsu.Inventory.Application.Attachments;
using Tnsu.Inventory.Application.DefectActs;
using Tnsu.Inventory.Application.DefectActs.Commands;
using Tnsu.Inventory.Application.Dictionaries.Queries;
using Tnsu.Inventory.Application.Procurement;
using Tnsu.Inventory.Application.PurchaseRequests;
using Tnsu.Inventory.Application.PurchaseRequests.Commands;
using Tnsu.Inventory.Domain;
using Tnsu.Inventory.Domain.Enums;
using Tnsu.Inventory.Infrastructure.Persistence;

namespace Tnsu.Inventory.Api.Endpoints;

public static class ApiEndpoints
{
    public static IEndpointRouteBuilder MapInventoryEndpoints(this IEndpointRouteBuilder app)
    {
        var api = app.MapGroup("/api").RequireAuthorization();

        api.MapGet("/dictionaries/projects", async (IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListProjectsQuery(), ct)));
        api.MapGet("/dictionaries/vehicles", async (IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListVehiclesQuery(), ct)));
        api.MapGet("/dictionaries/project-sections", async ([FromQuery] Guid projectId, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListProjectSectionsQuery(projectId), ct)));
        api.MapGet("/dictionaries/work-types", async (IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListWorkTypesQuery(), ct)));
        api.MapGet("/dictionaries/nomenclature", async ([FromQuery] string? search, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListNomenclatureQuery(search), ct)));
        api.MapGet("/dictionaries/contractors", async ([FromQuery] string? search, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListContractorsQuery(search), ct)));

        var defects = api.MapGroup("/defect-acts");
        defects.MapGet("", async ([FromQuery] string? search, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListDefectActsQuery(search), ct)));
        defects.MapPost("", async ([FromBody] CreateDefectActRequest body, IMediator m, CancellationToken ct) =>
        {
            var dto = await m.Send(new CreateDefectActCommand(body), ct);
            return Results.Created($"/api/defect-acts/{dto.Id}", dto);
        });
        defects.MapGet("/{id:guid}", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new GetDefectActQuery(id), ct)));
        defects.MapGet("/{id:guid}/print", async (Guid id, IMediator m, CancellationToken ct) =>
        {
            var html = await m.Send(new GetDefectActPrintQuery(id), ct);
            return Results.Content(html, "text/html; charset=utf-8");
        });
        defects.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateDefectActRequest body, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new UpdateDefectActCommand(id, body), ct)));
        defects.MapPost("/{id:guid}/submit", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new SubmitDefectActCommand(id), ct)));
        defects.MapPost("/{id:guid}/cancel", async (Guid id, [FromBody] CancelRequest body, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new CancelDefectActCommand(id, body.Comment), ct)));
        defects.MapGet("/{id:guid}/approvals", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new GetDefectActApprovalsQuery(id), ct)));
        defects.MapGet("/{id:guid}/attachments", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListDefectAttachmentsQuery(id), ct)));
        defects.MapPost("/{id:guid}/attachments", async (
            Guid id, HttpRequest request, IMediator m, CancellationToken ct) =>
        {
            if (!request.HasFormContentType)
                return Results.BadRequest(new { message = "Ожидается multipart/form-data" });

            var form = await request.ReadFormAsync(ct);
            var file = form.Files.FirstOrDefault();
            if (file is null) return Results.BadRequest(new { message = "Файл не передан" });

            var category = form["category"].FirstOrDefault() ?? AttachmentCategories.General;
            await using var stream = file.OpenReadStream();
            var dto = await m.Send(new UploadDefectAttachmentCommand(
                id, category, file.FileName, file.ContentType, stream), ct);
            return Results.Created($"/api/attachments/{dto.Id}", dto);
        }).DisableAntiforgery();
        defects.MapPost("/{id:guid}/purchase-request", async (Guid id, IMediator m, CancellationToken ct) =>
        {
            var dto = await m.Send(new CreatePurchaseFromDefectActCommand(id), ct);
            return Results.Created($"/api/purchase-requests/{dto.Id}", dto);
        });

        var purchases = api.MapGroup("/purchase-requests");
        purchases.MapGet("", async ([FromQuery] string? search, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListPurchaseRequestsQuery(search), ct)));
        purchases.MapPost("", async ([FromBody] CreatePurchaseRequestRequest body, IMediator m, CancellationToken ct) =>
        {
            var dto = await m.Send(new CreatePurchaseRequestCommand(body), ct);
            return Results.Created($"/api/purchase-requests/{dto.Id}", dto);
        });
        purchases.MapGet("/{id:guid}", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new GetPurchaseRequestQuery(id), ct)));
        purchases.MapGet("/{id:guid}/print", async (Guid id, IMediator m, CancellationToken ct) =>
        {
            var html = await m.Send(new GetPurchaseRequestPrintQuery(id), ct);
            return Results.Content(html, "text/html; charset=utf-8");
        });
        purchases.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdatePurchaseRequestRequest body, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new UpdatePurchaseRequestCommand(id, body), ct)));
        purchases.MapPost("/{id:guid}/submit", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new SubmitPurchaseRequestCommand(id), ct)));
        purchases.MapPost("/{id:guid}/cancel", async (Guid id, [FromBody] CancelRequest body, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new CancelPurchaseRequestCommand(id, body.Comment), ct)));
        purchases.MapGet("/{id:guid}/approvals", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new GetPurchaseRequestApprovalsQuery(id), ct)));
        purchases.MapGet("/{id:guid}/attachments", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ListPurchaseAttachmentsQuery(id), ct)));
        purchases.MapPost("/{id:guid}/attachments", async (
            Guid id, HttpRequest request, IMediator m, CancellationToken ct) =>
        {
            if (!request.HasFormContentType)
                return Results.BadRequest(new { message = "Ожидается multipart/form-data" });

            var form = await request.ReadFormAsync(ct);
            var file = form.Files.FirstOrDefault();
            if (file is null) return Results.BadRequest(new { message = "Файл не передан" });

            var category = form["category"].FirstOrDefault() ?? AttachmentCategories.General;
            await using var stream = file.OpenReadStream();
            var dto = await m.Send(new UploadPurchaseAttachmentCommand(
                id, category, file.FileName, file.ContentType, stream), ct);
            return Results.Created($"/api/attachments/{dto.Id}", dto);
        }).DisableAntiforgery();
        purchases.MapPost("/{id:guid}/assign-executor", async (Guid id, [FromBody] AssignExecutorRequest body, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new AssignExecutorCommand(id, body), ct)));
        purchases.MapPost("/{id:guid}/start", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new StartPurchaseExecutionCommand(id), ct)));
        purchases.MapPost("/{id:guid}/close", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new ClosePurchaseRequestCommand(id), ct)));
        purchases.MapPost("/{id:guid}/supplier-order", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new CreateSupplierOrderCommand(id), ct)));
        purchases.MapGet("/{id:guid}/supplier-order", async (Guid id, IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new GetSupplierOrderByPurchaseQuery(id), ct)));

        api.MapGet("/attachments/{id:guid}", async (Guid id, IMediator m, CancellationToken ct) =>
        {
            var (stream, fileName, contentType) = await m.Send(new DownloadAttachmentQuery(id), ct);
            return Results.File(stream, contentType, fileName);
        });

        var approvals = api.MapGroup("/approvals");
        approvals.MapGet("/inbox", async (IMediator m, CancellationToken ct) =>
            Results.Ok(await m.Send(new GetApprovalInboxQuery(), ct)));
        approvals.MapPost("/{stepId:guid}/approve", async (Guid stepId, [FromBody] DecisionRequest? body, IMediator m, CancellationToken ct) =>
        {
            await m.Send(new ApproveStepCommand(stepId, body?.Comment, body?.DigitalSignatureRef), ct);
            return Results.NoContent();
        });
        approvals.MapPost("/{stepId:guid}/return", async (Guid stepId, [FromBody] DecisionRequest body, IMediator m, CancellationToken ct) =>
        {
            await m.Send(new ReturnStepCommand(stepId, body.Comment ?? ""), ct);
            return Results.NoContent();
        });
        approvals.MapPost("/{stepId:guid}/reject", async (Guid stepId, [FromBody] DecisionRequest body, IMediator m, CancellationToken ct) =>
        {
            await m.Send(new RejectStepCommand(stepId, body.Comment ?? ""), ct);
            return Results.NoContent();
        });

        var admin = api.MapGroup("/admin");
        admin.MapGet("/users", async (
            ICurrentUser current,
            InventoryDbContext db,
            [FromQuery] string? search,
            [FromQuery] string? role,
            [FromQuery] bool? isActive,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50,
            CancellationToken ct = default) =>
        {
            if (!IsAdminRole(current.Role)) return Results.Forbid();

            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 10, 200);

            var query = db.Users.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = $"%{search.Trim().ToLowerInvariant()}%";
                query = query.Where(u =>
                    EF.Functions.ILike(u.Email, term) ||
                    EF.Functions.ILike(u.FullName, term));
            }

            if (!string.IsNullOrWhiteSpace(role))
                query = query.Where(u => u.Role == role);

            if (isActive.HasValue)
                query = query.Where(u => u.IsActive == isActive.Value);

            var total = await query.CountAsync(ct);
            var users = await query
                .OrderBy(u => u.FullName)
                .ThenBy(u => u.Email)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new AdminUserDto(
                    u.Id,
                    u.Email,
                    u.FullName,
                    u.Role,
                    MechanizationRole.Label(u.Role),
                    u.IsActive))
                .ToListAsync(ct);

            return Results.Ok(new AdminUsersPageDto(users, total, page, pageSize));
        });

        admin.MapGet("/zup/employees", async (
            ICurrentUser current,
            [FromQuery] string company,
            IZupEmployeeClient zup,
            CancellationToken ct) =>
        {
            if (!IsAdminRole(current.Role)) return Results.Forbid();
            if (!EmployerCompany.IsValid(company))
                return Results.BadRequest(new { message = "Некорректная компания." });

            var employees = await zup.ListEmployeesAsync(company, ct);
            return Results.Ok(employees);
        });

        admin.MapPost("/users", async (
            ICurrentUser current,
            CreateAdminUserRequest body,
            InventoryDbContext db,
            IZupEmployeeClient zup,
            CancellationToken ct) =>
        {
            if (!IsAdminRole(current.Role)) return Results.Forbid();

            if (!EmployerCompany.IsValid(body.EmployerCompany))
                return Results.BadRequest(new { message = "Выберите компанию из ЗУП." });

            var zupEmployeeId = body.ZupEmployeeId?.Trim();
            if (string.IsNullOrWhiteSpace(zupEmployeeId))
                return Results.BadRequest(new { message = "Выберите сотрудника из ЗУП." });

            if (!MechanizationRole.All.Contains(body.Role))
                return Results.BadRequest(new { message = "Неизвестная роль." });

            var employees = await zup.ListEmployeesAsync(body.EmployerCompany, ct);
            var employee = employees.FirstOrDefault(e => e.ExternalId == zupEmployeeId);
            if (employee is null)
                return Results.BadRequest(new { message = "Сотрудник не найден в ЗУП. Обновите список." });

            if (string.IsNullOrWhiteSpace(employee.Email) || !employee.Email.Contains('@'))
                return Results.BadRequest(new { message = "У сотрудника в ЗУП не указан корректный email." });

            var email = employee.Email.Trim().ToLowerInvariant();

            var exists = await db.Users.AnyAsync(u => u.Email.ToLower() == email, ct);
            if (exists)
                return Results.Conflict(new { message = "Пользователь с таким email уже существует." });

            var user = new Tnsu.Inventory.Domain.Entities.AppUser
            {
                Email = email,
                FullName = employee.FullName.Trim(),
                Role = body.Role,
                IsActive = body.IsActive
            };

            db.Users.Add(user);
            await db.SaveChangesAsync(ct);

            return Results.Created($"/api/admin/users/{user.Id}", new AdminUserDto(
                user.Id,
                user.Email,
                user.FullName,
                user.Role,
                MechanizationRole.Label(user.Role),
                user.IsActive));
        });

        admin.MapPut("/users/{id:guid}", async (
            Guid id,
            ICurrentUser current,
            UpdateAdminUserRequest body,
            InventoryDbContext db,
            CancellationToken ct) =>
        {
            if (!IsAdminRole(current.Role)) return Results.Forbid();

            if (!MechanizationRole.All.Contains(body.Role))
                return Results.BadRequest(new { message = "Неизвестная роль." });

            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id, ct);
            if (user is null) return Results.NotFound();

            user.FullName = body.FullName.Trim();
            user.Role = body.Role;
            user.IsActive = body.IsActive;
            await db.SaveChangesAsync(ct);

            return Results.Ok(new AdminUserDto(
                user.Id,
                user.Email,
                user.FullName,
                user.Role,
                MechanizationRole.Label(user.Role),
                user.IsActive));
        });

        admin.MapGet("/approval-route", async (ICurrentUser current, InventoryDbContext db, CancellationToken ct) =>
        {
            if (!IsAdminRole(current.Role)) return Results.Forbid();

            var users = await db.Users
                .AsNoTracking()
                .Where(u => u.IsActive)
                .OrderBy(u => u.FullName)
                .Select(u => new AdminUserOptionDto(u.Id, u.FullName, u.Email, u.Role, MechanizationRole.Label(u.Role)))
                .ToListAsync(ct);

            var assignments = new List<ApprovalRouteAssignmentDto>();
            foreach (var role in MechanizationRole.PurchaseApprovalRoles)
            {
                var assigned = users.FirstOrDefault(u => u.Role == role);
                assignments.Add(new ApprovalRouteAssignmentDto(
                    role,
                    MechanizationRole.Label(role),
                    assigned?.Id));
            }

            return Results.Ok(new ApprovalRouteDto(assignments, users));
        });

        admin.MapPut("/approval-route", async (
            ICurrentUser current,
            UpdateApprovalRouteRequest body,
            InventoryDbContext db,
            CancellationToken ct) =>
        {
            if (!IsAdminRole(current.Role)) return Results.Forbid();
            if (body.Assignments is null || body.Assignments.Count == 0)
                return Results.BadRequest(new { message = "Маршрут не передан." });

            var allowedRoles = MechanizationRole.PurchaseApprovalRoles.ToHashSet();
            var duplicatedRole = body.Assignments
                .GroupBy(a => a.Role)
                .FirstOrDefault(g => g.Count() > 1);
            if (duplicatedRole is not null)
                return Results.BadRequest(new { message = $"Роль «{MechanizationRole.Label(duplicatedRole.Key)}» задана несколько раз." });

            if (body.Assignments.Any(a => !allowedRoles.Contains(a.Role)))
                return Results.BadRequest(new { message = "В маршруте есть неподдерживаемая роль." });

            var selectedUserIds = body.Assignments.Select(a => a.UserId).ToList();
            if (selectedUserIds.Count != selectedUserIds.Distinct().Count())
                return Results.BadRequest(new { message = "Один и тот же пользователь не может быть назначен на несколько шагов маршрута." });

            var selectedUsers = await db.Users
                .Where(u => selectedUserIds.Contains(u.Id) && u.IsActive)
                .ToListAsync(ct);

            if (selectedUsers.Count != selectedUserIds.Count)
                return Results.BadRequest(new { message = "Часть выбранных пользователей не найдена или неактивна." });

            var selectedById = selectedUsers.ToDictionary(u => u.Id);

            var currentRouteUsers = await db.Users
                .Where(u => u.IsActive && allowedRoles.Contains(u.Role))
                .ToListAsync(ct);

            foreach (var user in currentRouteUsers)
            {
                if (!selectedUserIds.Contains(user.Id))
                    user.Role = MechanizationRole.SiteMechanic;
            }

            foreach (var assignment in body.Assignments)
            {
                selectedById[assignment.UserId].Role = assignment.Role;
            }

            await db.SaveChangesAsync(ct);
            return Results.NoContent();
        });

        admin.MapGet("/project-approval-route", async (
            ICurrentUser current,
            [FromQuery] Guid projectId,
            InventoryDbContext db,
            CancellationToken ct) =>
        {
            if (!IsAdminRole(current.Role)) return Results.Forbid();

            var users = await db.Users
                .AsNoTracking()
                .Where(u => u.IsActive)
                .OrderBy(u => u.FullName)
                .Select(u => new AdminUserOptionDto(u.Id, u.FullName, u.Email, u.Role, MechanizationRole.Label(u.Role)))
                .ToListAsync(ct);

            var allowedRoles = new[] { MechanizationRole.Security, MechanizationRole.ProjectManager };
            var currentAssignments = await db.ProjectApprovalAssignees
                .AsNoTracking()
                .Where(x => x.ProjectId == projectId && allowedRoles.Contains(x.Role))
                .ToListAsync(ct);

            var assignments = allowedRoles
                .Select(role => new ApprovalRouteAssignmentDto(
                    role,
                    MechanizationRole.Label(role),
                    currentAssignments.FirstOrDefault(x => x.Role == role)?.UserId))
                .ToList();

            return Results.Ok(new ApprovalRouteDto(assignments, users));
        });

        admin.MapPut("/project-approval-route", async (
            ICurrentUser current,
            [FromQuery] Guid projectId,
            UpdateApprovalRouteRequest body,
            InventoryDbContext db,
            CancellationToken ct) =>
        {
            if (!IsAdminRole(current.Role)) return Results.Forbid();
            var allowedRoles = new HashSet<string> { MechanizationRole.Security, MechanizationRole.ProjectManager };
            if (body.Assignments.Any(a => !allowedRoles.Contains(a.Role)))
                return Results.BadRequest(new { message = "Допустимы только роли РП/Начальник участка и СБ." });

            var selectedIds = body.Assignments.Select(a => a.UserId).ToList();
            var users = await db.Users.Where(u => u.IsActive && selectedIds.Contains(u.Id)).ToListAsync(ct);
            if (users.Count != selectedIds.Count)
                return Results.BadRequest(new { message = "Часть выбранных пользователей недоступна." });

            var existing = await db.ProjectApprovalAssignees
                .Where(x => x.ProjectId == projectId && allowedRoles.Contains(x.Role))
                .ToListAsync(ct);

            foreach (var assignment in body.Assignments)
            {
                var row = existing.FirstOrDefault(x => x.Role == assignment.Role);
                if (row is null)
                {
                    db.ProjectApprovalAssignees.Add(new Tnsu.Inventory.Domain.Entities.ProjectApprovalAssignee
                    {
                        ProjectId = projectId,
                        Role = assignment.Role,
                        UserId = assignment.UserId
                    });
                }
                else
                {
                    row.UserId = assignment.UserId;
                    row.UpdatedAt = DateTimeOffset.UtcNow;
                }
            }

            await db.SaveChangesAsync(ct);
            return Results.NoContent();
        });

        admin.MapGet("/documents/{documentType}/{id:guid}/approvers", async (
            string documentType,
            Guid id,
            ICurrentUser current,
            InventoryDbContext db,
            CancellationToken ct) =>
        {
            if (!IsAdminRole(current.Role)) return Results.Forbid();
            if (documentType is not DocumentTypes.DefectAct and not DocumentTypes.PurchaseRequest)
                return Results.BadRequest(new { message = "Неподдерживаемый тип документа." });

            Guid projectId;
            string status;
            if (documentType == DocumentTypes.DefectAct)
            {
                var doc = await db.DefectActs.FirstOrDefaultAsync(x => x.Id == id, ct);
                if (doc is null) return Results.NotFound();
                projectId = doc.ProjectId;
                status = doc.Status;
            }
            else
            {
                var doc = await db.PurchaseRequests.FirstOrDefaultAsync(x => x.Id == id, ct);
                if (doc is null) return Results.NotFound();
                projectId = doc.ProjectId;
                status = doc.Status;
            }

            var roles = MechanizationRole.PurchaseApprovalRoles;
            var users = await db.Users
                .AsNoTracking()
                .Where(u => u.IsActive)
                .OrderBy(u => u.FullName)
                .Select(u => new AdminUserOptionDto(u.Id, u.FullName, u.Email, u.Role, MechanizationRole.Label(u.Role)))
                .ToListAsync(ct);

            var pendingSteps = await db.ApprovalSteps
                .AsNoTracking()
                .Where(s => (documentType == DocumentTypes.DefectAct ? s.DefectActId == id : s.PurchaseRequestId == id)
                            && s.Status == ApprovalStepStatus.Pending)
                .ToListAsync(ct);

            var projectOverrides = await db.ProjectApprovalAssignees
                .AsNoTracking()
                .Where(x => x.ProjectId == projectId && roles.Contains(x.Role))
                .ToListAsync(ct);
            var docOverrides = await db.DocumentApprovalAssignees
                .AsNoTracking()
                .Where(x => documentType == DocumentTypes.DefectAct ? x.DefectActId == id : x.PurchaseRequestId == id)
                .ToListAsync(ct);

            var assignments = roles.Select(role =>
            {
                var pending = pendingSteps.FirstOrDefault(s => s.ApproverRole == role);
                var userId = pending?.ApproverUserId
                             ?? docOverrides.FirstOrDefault(x => x.Role == role)?.UserId
                             ?? projectOverrides.FirstOrDefault(x => x.Role == role)?.UserId
                             ?? users.FirstOrDefault(u => u.Role == role)?.Id;
                return new ApprovalRouteAssignmentDto(role, MechanizationRole.Label(role), userId);
            }).ToList();

            return Results.Ok(new DocumentApproverSettingsDto(documentType, id, projectId, status, assignments, users));
        });

        admin.MapPut("/documents/{documentType}/{id:guid}/approvers", async (
            string documentType,
            Guid id,
            ICurrentUser current,
            UpdateApprovalRouteRequest body,
            InventoryDbContext db,
            CancellationToken ct) =>
        {
            if (!IsAdminRole(current.Role)) return Results.Forbid();
            if (documentType is not DocumentTypes.DefectAct and not DocumentTypes.PurchaseRequest)
                return Results.BadRequest(new { message = "Неподдерживаемый тип документа." });
            var allowedRoles = MechanizationRole.PurchaseApprovalRoles.ToHashSet();
            if (body.Assignments.Any(a => !allowedRoles.Contains(a.Role)))
                return Results.BadRequest(new { message = "Передана неподдерживаемая роль." });

            var selectedIds = body.Assignments.Select(a => a.UserId).ToList();
            var users = await db.Users.Where(u => u.IsActive && selectedIds.Contains(u.Id)).ToListAsync(ct);
            if (users.Count != selectedIds.Count)
                return Results.BadRequest(new { message = "Часть выбранных пользователей недоступна." });

            string status;
            if (documentType == DocumentTypes.DefectAct)
            {
                var doc = await db.DefectActs.FirstOrDefaultAsync(x => x.Id == id, ct);
                if (doc is null) return Results.NotFound();
                status = doc.Status;
            }
            else
            {
                var doc = await db.PurchaseRequests.FirstOrDefaultAsync(x => x.Id == id, ct);
                if (doc is null) return Results.NotFound();
                status = doc.Status;
            }

            var editableStatuses = new HashSet<string>
            {
                WorkflowStatus.Draft, WorkflowStatus.Returned, WorkflowStatus.OnCoordination, WorkflowStatus.OnFinalApproval
            };
            if (!editableStatuses.Contains(status))
                return Results.BadRequest(new { message = "Смена согласующего доступна только для черновика, возврата или документов на согласовании." });

            var existing = await db.DocumentApprovalAssignees
                .Where(x => documentType == DocumentTypes.DefectAct ? x.DefectActId == id : x.PurchaseRequestId == id)
                .ToListAsync(ct);

            foreach (var assignment in body.Assignments)
            {
                var row = existing.FirstOrDefault(x => x.Role == assignment.Role);
                if (row is null)
                {
                    db.DocumentApprovalAssignees.Add(new Tnsu.Inventory.Domain.Entities.DocumentApprovalAssignee
                    {
                        DefectActId = documentType == DocumentTypes.DefectAct ? id : null,
                        PurchaseRequestId = documentType == DocumentTypes.PurchaseRequest ? id : null,
                        Role = assignment.Role,
                        UserId = assignment.UserId
                    });
                }
                else
                {
                    row.UserId = assignment.UserId;
                    row.UpdatedAt = DateTimeOffset.UtcNow;
                }
            }

            var pendingSteps = await db.ApprovalSteps
                .Where(s => (documentType == DocumentTypes.DefectAct ? s.DefectActId == id : s.PurchaseRequestId == id)
                            && s.Status == ApprovalStepStatus.Pending)
                .ToListAsync(ct);
            foreach (var step in pendingSteps)
            {
                var assignment = body.Assignments.FirstOrDefault(a => a.Role == step.ApproverRole);
                if (assignment is null) continue;
                step.ApproverUserId = assignment.UserId;
            }

            await db.SaveChangesAsync(ct);
            return Results.NoContent();
        });

        return app;
    }

    private static bool IsAdminRole(string? role) =>
        role is MechanizationRole.ChiefMechanic or MechanizationRole.OmtsHead;
}

public sealed record CancelRequest(string Comment);
public sealed record AdminUserDto(
    Guid Id,
    string Email,
    string FullName,
    string Role,
    string RoleLabel,
    bool IsActive);
public sealed record AdminUsersPageDto(
    IReadOnlyList<AdminUserDto> Items,
    int Total,
    int Page,
    int PageSize);
public sealed record CreateAdminUserRequest(string EmployerCompany, string ZupEmployeeId, string Role, bool IsActive);
public sealed record UpdateAdminUserRequest(string FullName, string Role, bool IsActive);
public sealed record AdminUserOptionDto(Guid Id, string FullName, string Email, string Role, string RoleLabel);
public sealed record ApprovalRouteAssignmentDto(string Role, string RoleLabel, Guid? UserId);
public sealed record ApprovalRouteDto(
    IReadOnlyList<ApprovalRouteAssignmentDto> Assignments,
    IReadOnlyList<AdminUserOptionDto> Users);
public sealed record UpdateApprovalRouteAssignmentRequest(string Role, Guid UserId);
public sealed record UpdateApprovalRouteRequest(IReadOnlyList<UpdateApprovalRouteAssignmentRequest> Assignments);
public sealed record DocumentApproverSettingsDto(
    string DocumentType,
    Guid DocumentId,
    Guid ProjectId,
    string Status,
    IReadOnlyList<ApprovalRouteAssignmentDto> Assignments,
    IReadOnlyList<AdminUserOptionDto> Users);
