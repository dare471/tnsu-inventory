import { apiClient, openPrintDocument } from '@/api/client';

export const inventoryApi = {
  getProjects: () => apiClient.get<ProjectDto[]>('/api/dictionaries/projects').then((r) => r.data),
  getVehicles: () => apiClient.get<VehicleDto[]>('/api/dictionaries/vehicles').then((r) => r.data),
  listDefectActs: (search?: string) =>
    apiClient
      .get<DefectActListItem[]>(`/api/defect-acts${search ? `?search=${encodeURIComponent(search)}` : ''}`)
      .then((r) => r.data),
  getDefectAct: (id: string) => apiClient.get<DefectActDto>(`/api/defect-acts/${id}`).then((r) => r.data),
  createDefectAct: (body: CreateDefectActRequest) =>
    apiClient.post<DefectActDto>('/api/defect-acts', body).then((r) => r.data),
  updateDefectAct: (id: string, body: UpdateDefectActRequest) =>
    apiClient.put<DefectActDto>(`/api/defect-acts/${id}`, body).then((r) => r.data),
  submitDefectAct: (id: string) =>
    apiClient.post<DefectActDto>(`/api/defect-acts/${id}/submit`).then((r) => r.data),
  createPurchaseFromDefect: (id: string) =>
    apiClient.post<PurchaseRequestDto>(`/api/defect-acts/${id}/purchase-request`).then((r) => r.data),
  listPurchaseRequests: (search?: string) =>
    apiClient
      .get<PurchaseRequestListItem[]>(`/api/purchase-requests${search ? `?search=${encodeURIComponent(search)}` : ''}`)
      .then((r) => r.data),
  getPurchaseRequest: (id: string) =>
    apiClient.get<PurchaseRequestDto>(`/api/purchase-requests/${id}`).then((r) => r.data),
  createPurchaseRequest: (body: CreatePurchaseRequestRequest) =>
    apiClient.post<PurchaseRequestDto>('/api/purchase-requests', body).then((r) => r.data),
  updatePurchaseRequest: (id: string, body: UpdatePurchaseRequestRequest) =>
    apiClient.put<PurchaseRequestDto>(`/api/purchase-requests/${id}`, body).then((r) => r.data),
  submitPurchaseRequest: (id: string) =>
    apiClient.post<PurchaseRequestDto>(`/api/purchase-requests/${id}/submit`).then((r) => r.data),
  getInbox: () => apiClient.get<InboxItem[]>('/api/approvals/inbox').then((r) => r.data),
  approveStep: (stepId: string, comment?: string, digitalSignatureRef?: string) =>
    apiClient.post(`/api/approvals/${stepId}/approve`, { comment, digitalSignatureRef }),
  returnStep: (stepId: string, comment: string) =>
    apiClient.post(`/api/approvals/${stepId}/return`, { comment }),
  rejectStep: (stepId: string, comment: string) =>
    apiClient.post(`/api/approvals/${stepId}/reject`, { comment }),
  getDefectApprovals: (id: string) =>
    apiClient.get<ApprovalStepDto[]>(`/api/defect-acts/${id}/approvals`).then((r) => r.data),
  listDefectAttachments: (id: string) =>
    apiClient.get<AttachmentDto[]>(`/api/defect-acts/${id}/attachments`).then((r) => r.data),
  uploadDefectAttachment: async (id: string, file: File, category: string) => {
    const form = new FormData();
    form.append('file', file);
    form.append('category', category);
    const res = await apiClient.post<AttachmentDto>(`/api/defect-acts/${id}/attachments`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  getPurchaseApprovals: (id: string) =>
    apiClient.get<ApprovalStepDto[]>(`/api/purchase-requests/${id}/approvals`).then((r) => r.data),
  printDefectAct: (id: string) => openPrintDocument(`/api/defect-acts/${id}/print`),
  printPurchaseRequest: async (id: string) => openPrintDocument(`/api/purchase-requests/${id}/print`),
  getProjectSections: (projectId: string) =>
    apiClient.get<ProjectSectionDto[]>(`/api/dictionaries/project-sections?projectId=${projectId}`).then((r) => r.data),
  getWorkTypes: () => apiClient.get<WorkTypeDto[]>('/api/dictionaries/work-types').then((r) => r.data),
  searchNomenclature: (search?: string) =>
    apiClient
      .get<NomenclatureDto[]>(`/api/dictionaries/nomenclature${search ? `?search=${encodeURIComponent(search)}` : ''}`)
      .then((r) => r.data),
  searchContractors: (search?: string) =>
    apiClient
      .get<ContractorDto[]>(`/api/dictionaries/contractors${search ? `?search=${encodeURIComponent(search)}` : ''}`)
      .then((r) => r.data),
  searchSpareParts: (params?: { vehicleName?: string; search?: string }) =>
    apiClient
      .get<SparePartDto[]>('/api/dictionaries/spare-parts', { params })
      .then((r) => r.data),
  deleteDefectAct: (id: string) => apiClient.delete(`/api/defect-acts/${id}`),
  deletePurchaseRequest: (id: string) => apiClient.delete(`/api/purchase-requests/${id}`),
  listAttachments: (purchaseId: string) =>
    apiClient.get<AttachmentDto[]>(`/api/purchase-requests/${purchaseId}/attachments`).then((r) => r.data),
  uploadAttachment: async (purchaseId: string, file: File, category: string) => {
    const form = new FormData();
    form.append('file', file);
    form.append('category', category);
    const res = await apiClient.post<AttachmentDto>(`/api/purchase-requests/${purchaseId}/attachments`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  createSupplierOrder: (purchaseId: string) =>
    apiClient.post<SupplierOrderDto>(`/api/purchase-requests/${purchaseId}/supplier-order`).then((r) => r.data),
  getSupplierOrder: (purchaseId: string) =>
    apiClient.get<SupplierOrderDto | null>(`/api/purchase-requests/${purchaseId}/supplier-order`).then((r) => r.data),
  listAdminUsers: async (params?: {
    search?: string;
    role?: string;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
  }) => {
    const { data } = await apiClient.get<AdminUsersPageDto | AdminUserDto[]>('/api/admin/users', { params });
    if (Array.isArray(data)) {
      return {
        items: data,
        total: data.length,
        page: 1,
        pageSize: data.length || params?.pageSize || 50
      };
    }
    return {
      items: data.items ?? [],
      total: data.total ?? data.items?.length ?? 0,
      page: data.page ?? 1,
      pageSize: data.pageSize ?? params?.pageSize ?? 50
    };
  },
  listZupEmployees: (company: string) =>
    apiClient.get<ZupEmployeeDto[]>('/api/admin/zup/employees', { params: { company } }).then((r) => r.data),
  createAdminUser: (body: CreateAdminUserRequest) =>
    apiClient.post<AdminUserDto>('/api/admin/users', body).then((r) => r.data),
  updateAdminUser: (id: string, body: UpdateAdminUserRequest) =>
    apiClient.put<AdminUserDto>(`/api/admin/users/${id}`, body).then((r) => r.data),
  getApprovalRoute: () => apiClient.get<ApprovalRouteDto>('/api/admin/approval-route').then((r) => r.data),
  updateApprovalRoute: (body: UpdateApprovalRouteRequest) =>
    apiClient.put('/api/admin/approval-route', body),
  getProjectApprovalRoute: (projectId: string) =>
    apiClient.get<ApprovalRouteDto>('/api/admin/project-approval-route', { params: { projectId } }).then((r) => r.data),
  updateProjectApprovalRoute: (projectId: string, body: UpdateApprovalRouteRequest) =>
    apiClient.put('/api/admin/project-approval-route', body, { params: { projectId } }),
  getDocumentApprovers: (documentType: string, documentId: string) =>
    apiClient.get<DocumentApproverSettingsDto>(`/api/admin/documents/${documentType}/${documentId}/approvers`).then((r) => r.data),
  listAdminDocuments: (type: 'defect_act' | 'purchase_request', search?: string) =>
    apiClient.get<AdminDocumentOptionDto[]>('/api/admin/documents', { params: { type, search } }).then((r) => r.data),
  updateDocumentApprovers: (documentType: string, documentId: string, body: UpdateApprovalRouteRequest) =>
    apiClient.put(`/api/admin/documents/${documentType}/${documentId}/approvers`, body)
};

export interface ProjectDto { id: string; code: string; projectName: string }
export interface VehicleDto {
  id: string; groupName: string; name: string;
  stateNumber: string; vinCode: string; fullPath: string;
}
export interface DefectActPartInput {
  lineNo: number; name: string; catalogNumber?: string;
  quantity: number; unit?: string; notes?: string;
}
export interface CreateDefectActRequest {
  projectId: string; projectCode: string; projectName: string;
  vehicleId: string; vehicleName: string; vehicleGroupName: string;
  stateNumber: string; vinCode: string; vehicleYear?: number;
  malfunctionDescription: string; parts: DefectActPartInput[];
}
export interface UpdateDefectActRequest {
  malfunctionDescription: string; parts: DefectActPartInput[];
}
export interface DefectActListItem {
  id: string; number: string; status: string; statusLabel: string;
  projectName: string; vehicleName: string; initiatorFullName: string; stateNumber: string; createdAt: string;
}
export interface DefectActDto extends DefectActListItem {
  projectId: string; projectCode: string; vehicleId: string;
  vehicleGroupName: string; vinCode: string; vehicleYear?: number;
  malfunctionDescription: string; createdByFullName: string; signedAt?: string;
  parts: Array<{ id: string; lineNo: number; name: string; catalogNumber?: string; quantity: number; unit?: string; notes?: string }>;
  canEdit: boolean; canSubmit: boolean; canCreatePurchaseRequest: boolean; canDelete: boolean;
}
export interface PurchaseRequestLineInput {
  lineNo: number; code?: string; name: string; catalogNumber?: string;
  quantity: number; unit?: string; estimatedUnitPrice?: number; notes?: string;
}
export interface CreatePurchaseRequestRequest {
  defectActId?: string; projectId: string; projectCode: string; projectName: string;
  vehicleId: string; vehicleName: string; vehicleGroupName: string;
  stateNumber: string; vinCode: string;
  vehicleYear?: number; description: string; lines: PurchaseRequestLineInput[];
}
export interface UpdatePurchaseRequestRequest {
  description: string; lines: PurchaseRequestLineInput[];
}
export interface PurchaseRequestListItem {
  id: string; number: string; status: string; statusLabel: string;
  projectName: string; vehicleName: string; initiatorFullName: string;
  currentApproverFullName?: string;
  estimatedAmount: number; createdAt: string;
}
export interface PurchaseRequestDto extends PurchaseRequestListItem {
  defectActId?: string; defectActNumber?: string;
  projectId: string; projectCode: string; vehicleId: string;
  vehicleGroupName: string;
  stateNumber: string; vinCode: string; vehicleYear?: number;
  description: string; hasServiceNoteAttachment: boolean;
  createdByFullName: string; assignedExecutorFullName?: string;
  lines: Array<{ id: string; lineNo: number; code: string; name: string; catalogNumber?: string; quantity: number; unit?: string; estimatedUnitPrice?: number; estimatedAmount?: number; notes?: string }>;
  canEdit: boolean; canSubmit: boolean; canCancel: boolean; canDelete: boolean;
}
export interface InboxItem {
  stepId: string; documentType: string; documentId: string;
  documentNumber: string; title: string; approverRoleLabel: string;
  orderNo: number; assignedAt?: string; pendingWorkingDays: number;
}
export interface ApprovalStepDto {
  id: string; orderNo: number; approverRoleLabel: string;
  approverFullName: string; status: string; statusLabel: string; action?: string;
  comment?: string; assignedAt?: string; decidedAt?: string; statusDate?: string;
}
export interface ProjectSectionDto { id: string; projectId: string; code: string; name: string }
export interface WorkTypeDto { id: string; code: string; name: string }
export interface NomenclatureDto { id: string; code: string; name: string; unit?: string }
export interface ContractorDto { id: string; code: string; name: string; inn?: string }
export interface SparePartDto {
  id: string;
  name: string;
  catalogNumber?: string;
  code?: string;
  unit?: string;
  vehicleName?: string;
}
export interface AttachmentDto {
  id: string; fileName: string; category: string; sizeBytes: number;
  sharePointUrl?: string; uploadedAt: string;
}
export interface SupplierOrderDto {
  id: string; number: string; status: string; purchaseRequestId: string;
  purchaseRequestNumber: string; externalSystemRef?: string;
  createdAt: string; submittedAt?: string;
}
export interface AdminUserDto {
  id: string;
  email: string;
  fullName: string;
  role: string;
  roleLabel: string;
  isActive: boolean;
}
export interface AdminUsersPageDto {
  items: AdminUserDto[];
  total: number;
  page: number;
  pageSize: number;
}
export interface CreateAdminUserRequest {
  employerCompany: string;
  zupEmployeeId: string;
  role: string;
  isActive: boolean;
}
export interface ZupEmployeeDto {
  externalId: string;
  fullName: string;
  position: string;
  email: string;
  department?: string;
  mobile?: string;
}
export interface UpdateAdminUserRequest {
  fullName: string;
  role: string;
  isActive: boolean;
}
export interface ApprovalRouteAssignmentDto {
  role: string;
  roleLabel: string;
  userId?: string;
}
export interface AdminUserOptionDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
  roleLabel: string;
}
export interface ApprovalRouteDto {
  assignments: ApprovalRouteAssignmentDto[];
  users: AdminUserOptionDto[];
}
export interface UpdateApprovalRouteRequest {
  assignments: Array<{ role: string; userId: string }>;
}
export interface AdminDocumentOptionDto {
  id: string;
  documentType: string;
  number: string;
  statusLabel: string;
}
export interface DocumentApproverSettingsDto {
  documentType: string;
  documentId: string;
  projectId: string;
  status: string;
  assignments: ApprovalRouteAssignmentDto[];
  users: AdminUserOptionDto[];
}
