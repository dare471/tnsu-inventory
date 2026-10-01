<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NCard, NButton, NAlert, NSpace, NDataTable, NTag, NUpload, NInput, NFormItem, NModal, NInputNumber, NSelect, NDatePicker, NRadioGroup, NRadio, NAutoComplete, useMessage,
  type DataTableColumns, type UploadFileInfo
} from 'naive-ui';
import {
  inventoryApi, type ApprovalStepDto, type AttachmentDto,
  type PurchaseRequestDto, type SupplierOrderDto, type InboxItem, type PurchaseRequestLineInput,
  type AdminUserOptionDto, type DocumentChangeDto
} from '@/api/inventory';
import { openAttachment, toApiError } from '@/api/client';
import { repairCategoryOptions, repairTypeOptions, unitOptions } from '@/config/units';
import { STOCK_ROLES } from '@/config/roles';
import { useAuthStore } from '@/stores/auth';

import SparePartNameField from '@/components/SparePartNameField.vue';
import WarehouseStockModal from '@/components/WarehouseStockModal.vue';

const route = useRoute();
const router = useRouter();
const msg = useMessage();
const auth = useAuthStore();

const request = ref<PurchaseRequestDto | null>(null);
const approvals = ref<ApprovalStepDto[]>([]);
const changes = ref<DocumentChangeDto[]>([]);
const attachments = ref<AttachmentDto[]>([]);
const supplierOrder = ref<SupplierOrderDto | null>(null);
const inboxItem = ref<InboxItem | null>(null);
const executors = ref<AdminUserOptionDto[]>([]);
const selectedExecutorId = ref<string | null>(null);
const assigning = ref(false);
const starting = ref(false);
const closing = ref(false);
const error = ref('');
const message = ref('');
const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const decisionModalOpen = ref(false);
const decisionKind = ref<'approve' | 'return'>('approve');
const decisionComment = ref('');
const decisionSubmitting = ref(false);
const currentApprovalStepId = ref<string | null>(null);
const description = ref('');
const repairType = ref('planned');
const repairCategory = ref('current');
const odometer = ref<number | null>(null);
const engineHours = ref<number | null>(null);
const deliveryDate = ref<number | null>(null);
const lines = ref<PurchaseRequestLineInput[]>([]);
const cancelOpen = ref(false);
const cancelComment = ref('');
const cancelling = ref(false);

function parseDateOnly(value?: string | null): number | null {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

function formatDateOnly(ts: number | null): string | undefined {
  if (ts == null) return undefined;
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateOnlyDisplay(value?: string | null): string {
  if (!value) return '—';
  const [y, m, d] = value.split('-');
  return `${d}.${m}.${y}`;
}
const actingRoleLabel = computed(() => inboxItem.value?.approverRoleLabel ?? '—');
const editable = computed(() => !!request.value?.canEdit);
const headerLocked = computed(() => !!request.value?.lockedToDefectAct);
const canSearchWarehouse = computed(() =>
  !!request.value?.defectActId && STOCK_ROLES.has(auth.user?.role ?? ''));
const stockOpen = ref(false);
const stockLines = computed(() => activeLines.value
  .filter((line) => line.name.trim())
  .map((line) => ({
    id: line.sourceDefectActPartId,
    name: line.name,
    catalogNumber: line.catalogNumber,
    unit: line.unit,
    quantity: line.quantity
  })));
const headerEditable = computed(() => editable.value && !headerLocked.value);
const activeLines = computed(() => lines.value.filter((l) => !l.isRemoved));
const removedLines = computed(() => lines.value.filter((l) => l.isRemoved));

const lineColumns = computed<DataTableColumns<PurchaseRequestLineInput>>(() => [
  { title: '#', key: 'lineNo', width: 50 },
  {
    title: 'Код',
    key: 'code',
    width: 150,
    render: (row) => row.code
      ?? (request.value?.number ? `${request.value.number}-${String(row.lineNo).padStart(2, '0')}` : '—')
  },
  {
    title: 'Наименование',
    key: 'name',
    minWidth: 320,
    render: (row) => headerEditable.value
      ? h(SparePartNameField, {
          modelValue: row.name,
          catalogNumber: row.catalogNumber,
          unit: row.unit,
          vehicleName: request.value?.vehicleName || null,
          'onUpdate:modelValue': (v: string) => { row.name = v; },
          'onUpdate:catalogNumber': (v: string) => { row.catalogNumber = v; },
          'onUpdate:unit': (v: string) => { row.unit = v; }
        })
      : row.name
  },
  {
    title: 'Партномер',
    key: 'catalogNumber',
    render: (row) => h(NInput, {
      value: row.catalogNumber ?? '',
      maxlength: 50,
      disabled: !headerEditable.value,
      onUpdateValue: (v: string) => { row.catalogNumber = v.slice(0, 50); }
    })
  },
  {
    title: 'Кол-во',
    key: 'quantity',
    width: 100,
    render: (row) => h(NInputNumber, {
      value: row.quantity,
      min: 0,
      max: headerLocked.value ? row.maxQuantity : undefined,
      disabled: !editable.value,
      onUpdateValue: (v: number | null) => {
        const next = v ?? 0;
        row.quantity = headerLocked.value && row.maxQuantity != null
          ? Math.min(next, row.maxQuantity)
          : next;
      }
    })
  },
  {
    title: 'Ед.',
    key: 'unit',
    width: 80,
    render: (row) => h(NAutoComplete, {
      value: row.unit ?? '',
      options: unitOptions.map((o) => o.value),
      disabled: !headerEditable.value,
      onUpdateValue: (v: string) => { row.unit = v; }
    })
  },
  editable.value ? {
    title: '',
    key: 'actions',
    width: 90,
    render: (row) => h(NButton, {
      size: 'small',
      type: 'error',
      tertiary: true,
      onClick: () => removeLine(row)
    }, () => 'Удалить')
  } : { title: '', key: 'actions', width: 1 }
]);

const attachmentColumns: DataTableColumns<AttachmentDto> = [
  {
    title: 'Файл',
    key: 'fileName',
    render: (r) => h('a', {
      href: '#',
      onClick: (event: Event) => {
        event.preventDefault();
        void openAttachment(r.id, r.fileName).catch((e) => msg.error(toApiError(e).detail));
      }
    }, r.fileName)
  },
  {
    title: 'Размер',
    key: 'sizeBytes',
    render: (r) => formatSize(r.sizeBytes)
  },
  {
    title: 'SharePoint',
    key: 'sharePointUrl',
    render: (r) => r.sharePointUrl
      ? h('a', { href: r.sharePointUrl, target: '_blank' }, 'Открыть')
      : 'локально'
  }
];

const approvalColumns: DataTableColumns<ApprovalStepDto> = [
  { title: 'Запуск', key: 'roundNo', width: 80 },
  { title: 'Шаг', key: 'orderNo', width: 60 },
  {
    title: '',
    key: 'currentStep',
    width: 120,
    render: (r) => r.id === currentApprovalStepId.value
      ? h(NTag, { type: 'warning', size: 'small' }, () => 'Текущий шаг')
      : '—'
  },
  { title: 'Роль', key: 'approverRoleLabel' },
  { title: 'ФИО', key: 'approverFullName' },
  { title: 'Статус', key: 'statusLabel' },
  {
    title: 'Дата',
    key: 'statusDate',
    render: (r) => (r.statusDate ? new Date(r.statusDate).toLocaleString('ru-RU') : '—')
  },
  { title: 'Комментарий', key: 'comment', render: (r) => r.comment ?? '—' }
];

onMounted(load);

function bindRequest(dto: PurchaseRequestDto) {
  request.value = dto;
  description.value = dto.description;
  repairType.value = dto.repairType || 'planned';
  repairCategory.value = dto.repairCategory || 'current';
  odometer.value = dto.odometer ?? null;
  engineHours.value = dto.engineHours ?? null;
  deliveryDate.value = parseDateOnly(dto.deliveryDate);
  lines.value = dto.lines.map((l) => ({
    id: l.id,
    lineNo: l.lineNo,
    code: l.code,
    name: l.name,
    catalogNumber: l.catalogNumber,
    quantity: l.quantity,
    unit: l.unit,
    estimatedUnitPrice: l.estimatedUnitPrice,
    notes: l.notes,
    sourceDefectActPartId: l.sourceDefectActPartId,
    maxQuantity: l.maxQuantity,
    isRemoved: l.isRemoved
  }));
}

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const id = route.params.id as string;
    bindRequest(await inventoryApi.getPurchaseRequest(id));
    approvals.value = await inventoryApi.getPurchaseApprovals(id);
    const activeStep = approvals.value
      .filter((s) => s.status === 'pending' && !!s.assignedAt && !s.decidedAt)
      .sort((a, b) => a.orderNo - b.orderNo)[0];
    currentApprovalStepId.value = activeStep?.id ?? null;
    attachments.value = await inventoryApi.listAttachments(id);
    changes.value = await inventoryApi.getPurchaseChanges(id);
    supplierOrder.value = await inventoryApi.getSupplierOrder(id);
    const inbox = await inventoryApi.getInbox();
    inboxItem.value = inbox.find((x) => x.documentType === 'purchase_request' && x.documentId === id) ?? null;
    await loadExecutors();
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    loading.value = false;
  }
}

function addLine() {
  if (headerLocked.value) return;
  lines.value.push({ lineNo: lines.value.length + 1, name: '', quantity: 1, unit: 'шт.' });
}

function removeLine(row: PurchaseRequestLineInput) {
  if (headerLocked.value) {
    row.isRemoved = true;
    return;
  }
  const idx = lines.value.indexOf(row);
  if (idx >= 0) lines.value.splice(idx, 1);
  lines.value.forEach((p, i) => { p.lineNo = i + 1; });
}

function restoreLine(row: PurchaseRequestLineInput) {
  row.isRemoved = false;
  if (row.maxQuantity != null && row.quantity > row.maxQuantity)
    row.quantity = row.maxQuantity;
}

async function save() {
  if (!request.value) return;
  if (!description.value.trim()) {
    error.value = 'Укажите описание заявки.';
    return;
  }
  if (!lines.value.some((l) => !l.isRemoved && l.name.trim())) {
    error.value = 'Добавьте хотя бы одну позицию.';
    return;
  }
  saving.value = true;
  error.value = '';
  try {
    const payloadLines = headerLocked.value
      ? lines.value
      : lines.value.filter((l) => !l.isRemoved && l.name.trim());
    bindRequest(await inventoryApi.updatePurchaseRequest(request.value.id, {
      repairType: repairType.value,
      repairCategory: repairCategory.value,
      odometer: odometer.value ?? undefined,
      engineHours: engineHours.value ?? undefined,
      description: description.value.trim(),
      deliveryDate: formatDateOnly(deliveryDate.value),
      lines: payloadLines
    }));
    changes.value = await inventoryApi.getPurchaseChanges(request.value.id);
    message.value = 'Изменения сохранены';
    msg.success(message.value);
  } catch (e) {
    error.value = toApiError(e).detail;
    msg.error(error.value);
  } finally {
    saving.value = false;
  }
}

function openDecision(kind: 'approve' | 'return') {
  decisionKind.value = kind;
  decisionComment.value = '';
  decisionModalOpen.value = true;
}

async function applyDecision() {
  if (!inboxItem.value) return;
  if (decisionKind.value === 'return' && !decisionComment.value.trim()) {
    msg.warning('Комментарий обязателен при возврате');
    return;
  }
  decisionSubmitting.value = true;
  try {
    if (decisionKind.value === 'approve') {
      await inventoryApi.approveStep(inboxItem.value.stepId, decisionComment.value.trim() || undefined);
      msg.success('Документ согласован');
    } else {
      await inventoryApi.returnStep(inboxItem.value.stepId, decisionComment.value.trim());
      msg.success('Документ возвращён');
    }
    decisionModalOpen.value = false;
    await load();
  } catch (e) {
    msg.error(toApiError(e).detail);
  } finally {
    decisionSubmitting.value = false;
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function uploadFiles(options: { file: UploadFileInfo }) {
  const raw = options.file.file;
  if (!raw) return;
  try {
    await inventoryApi.uploadAttachment(route.params.id as string, raw, 'general');
    await load();
    message.value = 'Файл загружен';
    msg.success('Файл загружен');
  } catch (e) {
    error.value = toApiError(e).detail;
    msg.error(error.value);
  }
}

async function submit() {
  try {
    bindRequest(await inventoryApi.submitPurchaseRequest(route.params.id as string));
    approvals.value = await inventoryApi.getPurchaseApprovals(route.params.id as string);
    message.value = 'Заявка отправлена на согласование';
    msg.success(message.value);
  } catch (e) {
    error.value = toApiError(e).detail;
    msg.error(error.value);
  }
}

async function createOrder() {
  try {
    supplierOrder.value = await inventoryApi.createSupplierOrder(route.params.id as string);
    message.value = 'Заказ поставщику создан';
    msg.success(message.value);
  } catch (e) {
    error.value = toApiError(e).detail;
    msg.error(error.value);
  }
}

async function printRequest() {
  error.value = '';
  try {
    await inventoryApi.printPurchaseRequest(route.params.id as string);
  } catch (e) {
    error.value = toApiError(e).detail;
    msg.error(error.value);
  }
}

async function deleteDraft() {
  if (!request.value?.canDelete && request.value?.status !== 'draft') return;
  if (!window.confirm(`Удалить черновик ${request.value.number}?`)) return;
  deleting.value = true;
  error.value = '';
  try {
    await inventoryApi.deletePurchaseRequest(request.value.id);
    msg.success('Черновик удалён');
    await router.push({ name: 'purchase-requests' });
  } catch (e) {
    error.value = toApiError(e).detail;
    msg.error(error.value);
  } finally {
    deleting.value = false;
  }
}

async function loadExecutors() {
  try {
    executors.value = await inventoryApi.listExecutors();
  } catch {
    executors.value = [];
  }
}

const executorOptions = computed(() =>
  executors.value.map((u) => ({
    label: `${u.fullName} (${u.roleLabel})`,
    value: u.id
  }))
);

async function assignExecutor() {
  if (!request.value || !selectedExecutorId.value) {
    error.value = 'Выберите исполнителя.';
    return;
  }
  assigning.value = true;
  error.value = '';
  try {
    bindRequest(await inventoryApi.assignExecutor(request.value.id, selectedExecutorId.value));
    message.value = 'Исполнитель назначен.';
    msg.success(message.value);
  } catch (e) {
    error.value = toApiError(e).detail;
    msg.error(error.value);
  } finally {
    assigning.value = false;
  }
}

async function startExecution() {
  if (!request.value) return;
  starting.value = true;
  error.value = '';
  try {
    bindRequest(await inventoryApi.startPurchaseExecution(request.value.id));
    message.value = 'Заявка взята в работу.';
    msg.success(message.value);
  } catch (e) {
    error.value = toApiError(e).detail;
    msg.error(error.value);
  } finally {
    starting.value = false;
  }
}

async function cancelRequest() {
  if (!request.value || !cancelComment.value.trim()) {
    msg.warning('Укажите причину аннулирования');
    return;
  }
  cancelling.value = true;
  try {
    bindRequest(await inventoryApi.cancelPurchaseRequest(request.value.id, cancelComment.value.trim()));
    changes.value = await inventoryApi.getPurchaseChanges(request.value.id);
    cancelOpen.value = false;
    message.value = 'Заявка аннулирована';
    msg.success(message.value);
  } catch (e) {
    msg.error(toApiError(e).detail);
  } finally {
    cancelling.value = false;
  }
}

async function closeRequest() {
  if (!request.value) return;
  if (!window.confirm(`Закрыть заявку ${request.value.number}?`)) return;
  closing.value = true;
  error.value = '';
  try {
    bindRequest(await inventoryApi.closePurchaseRequest(request.value.id));
    message.value = 'Заявка закрыта.';
    msg.success(message.value);
  } catch (e) {
    error.value = toApiError(e).detail;
    msg.error(error.value);
  } finally {
    closing.value = false;
  }
}
</script>

<template>
  <NCard v-if="request" :title="`Заявка ${request.number}`">
    <NSpace vertical :size="16">
      <NTag type="info">{{ request.statusLabel }}</NTag>
      <NAlert v-if="error" type="error">{{ error }}</NAlert>
      <NAlert v-if="message" type="success">{{ message }}</NAlert>

      <div class="t-grid-2">
        <div><strong>Проект:</strong> {{ request.projectName }}</div>
        <div><strong>Техника:</strong> {{ request.vehicleName }}</div>
        <div><strong>Гос. номер:</strong> {{ request.stateNumber || '—' }}</div>
        <div><strong>VIN:</strong> {{ request.vinCode || '—' }}</div>
        <div><strong>Год выпуска:</strong> {{ request.vehicleYear ?? '—' }}</div>
        <div><strong>Подразделение МОЛ:</strong> {{ request.vehicleGroupName || '—' }}</div>
        <div><strong>Одометр:</strong> {{ request.odometer ?? '—' }}</div>
        <div><strong>Моточасы:</strong> {{ request.engineHours ?? '—' }}</div>
        <div><strong>Категория ремонта:</strong> {{ request.repairCategoryLabel || '—' }}</div>
        <div v-if="request.defectActId && request.defectActNumber">
          <strong>Дефектный акт:</strong>
          <a
            href="#"
            style="margin-left:6px;color:var(--brand-orange);font-weight:600"
            @click.prevent="router.push({ name: 'defect-act-detail', params: { id: request.defectActId } })"
          >{{ request.defectActNumber }}</a>
        </div>
        <div><strong>Инициатор:</strong> {{ request.createdByFullName }}</div>
        <div><strong>Исполнитель:</strong> {{ request.assignedExecutorFullName || '—' }}</div>
        <div v-if="!editable"><strong>Тип ремонта:</strong> {{ request.repairTypeLabel || '—' }}</div>
        <div v-if="!editable"><strong>Дата поставки:</strong> {{ formatDateOnlyDisplay(request.deliveryDate) }}</div>
      </div>

      <NAlert v-if="headerLocked && editable" type="info">
        Заявка создана из дефектного акта: можно уменьшить количество или исключить позицию. Исключённую позицию можно вернуть.
      </NAlert>

      <div v-if="headerEditable" class="t-grid-2">
        <NFormItem label="Тип ремонта">
          <NRadioGroup v-model:value="repairType">
            <NSpace>
              <NRadio v-for="opt in repairTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</NRadio>
            </NSpace>
          </NRadioGroup>
        </NFormItem>
        <NFormItem label="Дата поставки">
          <NDatePicker v-model:value="deliveryDate" type="date" style="width:100%" />
        </NFormItem>
        <NFormItem label="Капитальный / текущий ремонт">
          <NRadioGroup v-model:value="repairCategory">
            <NSpace>
              <NRadio v-for="opt in repairCategoryOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</NRadio>
            </NSpace>
          </NRadioGroup>
        </NFormItem>
      </div>

      <div v-if="request.canAssignExecutor" class="t-assign-executor">
        <h3 style="margin:0 0 12px">Назначение исполнителя</h3>
        <NSpace align="end">
          <NFormItem label="Исполнитель" style="min-width:320px;margin-bottom:0">
            <NSelect
              v-model:value="selectedExecutorId"
              filterable
              clearable
              :options="executorOptions"
              placeholder="Выберите исполнителя"
            />
          </NFormItem>
          <NButton type="primary" :loading="assigning" @click="assignExecutor">Назначить</NButton>
        </NSpace>
      </div>

      <NFormItem label="Описание / обоснование">
        <NInput v-model:value="description" type="textarea" :rows="4" :disabled="!headerEditable" />
      </NFormItem>

      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px">
          <h3 style="margin:0">Позиции</h3>
          <NButton v-if="canSearchWarehouse" secondary @click="stockOpen = true">
            Проверить остатки на складах
          </NButton>
        </div>
        <div class="t-table-wrap">
          <NDataTable :columns="lineColumns" :data="activeLines" size="small" :bordered="false" />
        </div>
        <NButton v-if="headerEditable" secondary style="margin-top:8px" @click="addLine">+ Строка</NButton>
        <div v-if="removedLines.length" style="margin-top:16px">
          <h4 style="margin:0 0 8px">Исключённые позиции</h4>
          <div v-for="line in removedLines" :key="line.id ?? line.lineNo" style="display:flex;gap:12px;align-items:center;margin-bottom:6px">
            <span>{{ line.name }} — {{ line.maxQuantity ?? line.quantity }} {{ line.unit }}</span>
            <NButton v-if="editable" size="small" secondary @click="restoreLine(line)">Вернуть</NButton>
          </div>
        </div>
      </div>

      <div>
        <h3 style="margin:0 0 12px">Вложения</h3>
        <NSpace v-if="request.canEdit" style="margin-bottom:12px">
          <NUpload :show-file-list="false" @change="uploadFiles">
            <NButton secondary>Добавить вложение</NButton>
          </NUpload>
        </NSpace>
        <div v-if="attachments.length" class="t-table-wrap">
          <NDataTable :columns="attachmentColumns" :data="attachments" size="small" :bordered="false" />
        </div>
        <p v-else style="color:var(--brand-text-muted)">Вложений нет</p>
      </div>

      <NSpace>
        <NButton v-if="editable" type="primary" :loading="saving" @click="save">Сохранить</NButton>
        <NButton v-if="request.canSubmit" type="primary" @click="submit">Отправить на согласование</NButton>
        <NButton v-if="inboxItem" type="primary" @click="openDecision('approve')">Согласовать</NButton>
        <NButton v-if="inboxItem" secondary @click="openDecision('return')">Вернуть</NButton>
        <NButton secondary @click="printRequest">Печать / PDF</NButton>
        <NButton
          v-if="request.canStartExecution"
          type="primary"
          :loading="starting"
          @click="startExecution"
        >
          Взять в работу
        </NButton>
        <NButton
          v-if="request.canClose"
          type="primary"
          :loading="closing"
          @click="closeRequest"
        >
          Закрыть заявку
        </NButton>
        <NButton
          v-if="request.canDelete || request.status === 'draft'"
          type="error"
          secondary
          :loading="deleting"
          @click="deleteDraft"
        >
          Удалить черновик
        </NButton>
        <NButton v-if="request.canCancel" type="error" secondary @click="cancelOpen = true; cancelComment = ''">
          Аннулировать
        </NButton>
        <NButton v-if="request.status === 'in_progress'" type="primary" @click="createOrder">
          Сформировать заказ поставщику
        </NButton>
      </NSpace>

      <div v-if="supplierOrder">
        <h3 style="margin:0 0 8px">Заказ поставщику</h3>
        <p style="margin:0"><strong>{{ supplierOrder.number }}</strong> — {{ supplierOrder.status }}</p>
        <p v-if="supplierOrder.externalSystemRef" style="color:var(--brand-text-muted);margin:4px 0 0">
          Внешний ID: {{ supplierOrder.externalSystemRef }}
        </p>
      </div>

      <div v-if="changes.length">
        <h3 style="margin:0 0 12px">Журнал изменений</h3>
        <div class="t-table-wrap">
          <NDataTable
            :columns="[
              { title: 'Дата', key: 'createdAt', render: (r: DocumentChangeDto) => new Date(r.createdAt).toLocaleString('ru-RU') },
              { title: 'Кто', key: 'userFullName' },
              { title: 'Событие', key: 'summary' }
            ]"
            :data="changes"
            size="small"
            :bordered="false"
          />
        </div>
      </div>

      <div v-if="approvals.length">
        <h3 style="margin:0 0 12px">Согласование</h3>
        <div class="t-table-wrap">
          <NDataTable
            :columns="approvalColumns"
            :data="approvals"
            size="small"
            :bordered="false"
            :row-class-name="(row: ApprovalStepDto) => row.id === currentApprovalStepId ? 't-current-approval-row' : ''"
          />
        </div>
      </div>
    </NSpace>
    <NModal v-model:show="decisionModalOpen">
      <NCard
        style="max-width:560px;margin:80px auto 0;"
        :title="decisionKind === 'approve' ? 'Согласование' : 'Возврат'"
        :bordered="false"
      >
        <NFormItem label="Роль">
          <NInput :value="actingRoleLabel" readonly />
        </NFormItem>
        <NFormItem :label="decisionKind === 'approve' ? 'Комментарий (необязательно)' : 'Комментарий'">
          <NInput v-model:value="decisionComment" type="textarea" :rows="4" placeholder="Комментарий к решению" />
        </NFormItem>
        <NSpace justify="end">
          <NButton @click="decisionModalOpen = false">Отмена</NButton>
          <NButton type="primary" :loading="decisionSubmitting" @click="applyDecision">Подтвердить</NButton>
        </NSpace>
      </NCard>
    </NModal>
    <NModal v-model:show="cancelOpen">
      <NCard style="max-width:560px;margin:80px auto 0;" title="Аннулировать заявку" :bordered="false">
        <NFormItem label="Причина">
          <NInput v-model:value="cancelComment" type="textarea" :rows="4" />
        </NFormItem>
        <NSpace justify="end">
          <NButton @click="cancelOpen = false">Отмена</NButton>
          <NButton type="error" :loading="cancelling" @click="cancelRequest">Аннулировать</NButton>
        </NSpace>
      </NCard>
    </NModal>
    <WarehouseStockModal
      v-if="request.defectActId"
      v-model:show="stockOpen"
      :lines="stockLines"
      :can-create-transfer="canSearchWarehouse"
      :defect-act-id="request.defectActId"
      :purchase-request-id="request.id"
      :destination="[request.projectName, request.vehicleName].filter(Boolean).join(', ')"
    />
  </NCard>
</template>

<style scoped>
.t-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 16px;
}
@media (max-width: 900px) {
  .t-grid-2 { grid-template-columns: 1fr; }
}

:deep(.t-current-approval-row td) {
  background: rgba(250, 173, 20, 0.12);
}
</style>
