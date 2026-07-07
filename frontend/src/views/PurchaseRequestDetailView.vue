<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  NCard, NButton, NAlert, NSpace, NDataTable, NTag, NUpload, NInput, NFormItem, NModal, useMessage,
  type DataTableColumns, type UploadFileInfo
} from 'naive-ui';
import {
  inventoryApi, type ApprovalStepDto, type AttachmentDto,
  type PurchaseRequestDto, type SupplierOrderDto, type InboxItem
} from '@/api/inventory';
import { toApiError } from '@/api/client';
import { computed } from 'vue';

const route = useRoute();
const msg = useMessage();

const request = ref<PurchaseRequestDto | null>(null);
const approvals = ref<ApprovalStepDto[]>([]);
const attachments = ref<AttachmentDto[]>([]);
const supplierOrder = ref<SupplierOrderDto | null>(null);
const inboxItem = ref<InboxItem | null>(null);
const error = ref('');
const message = ref('');
const loading = ref(true);
const decisionModalOpen = ref(false);
const decisionKind = ref<'approve' | 'return'>('approve');
const decisionComment = ref('');
const decisionSubmitting = ref(false);
const currentApprovalStepId = ref<string | null>(null);
const actingRoleLabel = computed(() => inboxItem.value?.approverRoleLabel ?? '—');

const lineColumns: DataTableColumns<PurchaseRequestDto['lines'][number]> = [
  { title: '#', key: 'lineNo', width: 50 },
  { title: 'Наименование', key: 'name' },
  { title: 'Кат. №', key: 'catalogNumber', render: (r) => r.catalogNumber ?? '—' },
  { title: 'Кол-во', key: 'quantity' },
  { title: 'Ед.', key: 'unit', render: (r) => r.unit ?? '—' }
];

const attachmentColumns: DataTableColumns<AttachmentDto> = [
  {
    title: 'Файл',
    key: 'fileName',
    render: (r) => h('a', { href: `/api/attachments/${r.id}`, target: '_blank' }, r.fileName)
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

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const id = route.params.id as string;
    request.value = await inventoryApi.getPurchaseRequest(id);
    approvals.value = await inventoryApi.getPurchaseApprovals(id);
    const activeStep = approvals.value
      .filter((s) => s.status === 'pending' && !!s.assignedAt && !s.decidedAt)
      .sort((a, b) => a.orderNo - b.orderNo)[0];
    currentApprovalStepId.value = activeStep?.id ?? null;
    attachments.value = await inventoryApi.listAttachments(id);
    supplierOrder.value = await inventoryApi.getSupplierOrder(id);
    const inbox = await inventoryApi.getInbox();
    inboxItem.value = inbox.find((x) => x.documentType === 'purchase_request' && x.documentId === id) ?? null;
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    loading.value = false;
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
    request.value = await inventoryApi.submitPurchaseRequest(route.params.id as string);
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
</script>

<template>
  <NCard v-if="request" :title="`Заявка ${request.number}`">
    <NSpace vertical :size="16">
      <NTag type="info">{{ request.statusLabel }}</NTag>
      <NAlert v-if="error" type="error">{{ error }}</NAlert>
      <NAlert v-if="message" type="success">{{ message }}</NAlert>

      <div class="t-grid-2">
        <div><strong>Проект:</strong> {{ request.projectName }}</div>
        <div><strong>Техника:</strong> {{ request.vehicleName }} ({{ request.stateNumber }})</div>
      </div>
      <div class="t-grid-2">
        <div><strong>Гос. номер:</strong> {{ request.stateNumber || '—' }}</div>
        <div><strong>VIN:</strong> {{ request.vinCode || '—' }}</div>
        <div><strong>Год:</strong> {{ request.vehicleYear ?? '—' }}</div>
        <div><strong>Группа:</strong> {{ request.vehicleName }}</div>
        <div v-if="request.defectActNumber"><strong>Дефектный акт:</strong> {{ request.defectActNumber }}</div>
        <div><strong>Инициатор:</strong> {{ request.createdByFullName }}</div>
      </div>

      <p style="margin:0">{{ request.description }}</p>

      <div class="t-table-wrap">
        <NDataTable :columns="lineColumns" :data="request.lines" size="small" :bordered="false" />
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
        <NButton v-if="request.canSubmit" type="primary" @click="submit">Отправить на согласование</NButton>
        <NButton v-if="inboxItem" type="primary" @click="openDecision('approve')">Согласовать</NButton>
        <NButton v-if="inboxItem" secondary @click="openDecision('return')">Вернуть</NButton>
        <NButton secondary @click="printRequest">Печать</NButton>
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
      <NAlert v-if="inboxItem" type="warning">
        Действие будет выполнено за роль: <strong>{{ actingRoleLabel }}</strong>
      </NAlert>
    </NSpace>
    <NModal v-model:show="decisionModalOpen">
      <NCard
        style="max-width:560px;margin:80px auto 0;"
        :title="decisionKind === 'approve' ? 'Согласовать документ' : 'Вернуть на доработку'"
        :bordered="false"
      >
        <NAlert type="warning" style="margin-bottom:12px">
          Вы подтверждаете действие за роль: <strong>{{ actingRoleLabel }}</strong>
        </NAlert>
        <NFormItem :label="decisionKind === 'approve' ? 'Комментарий (необязательно)' : 'Комментарий'">
          <NInput v-model:value="decisionComment" type="textarea" :rows="4" />
        </NFormItem>
        <NSpace justify="end">
          <NButton @click="decisionModalOpen = false">Отмена</NButton>
          <NButton type="primary" :loading="decisionSubmitting" @click="applyDecision">Подтвердить</NButton>
        </NSpace>
      </NCard>
    </NModal>
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
