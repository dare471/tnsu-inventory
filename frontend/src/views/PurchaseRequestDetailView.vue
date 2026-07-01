<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  NCard, NButton, NAlert, NSpace, NDataTable, NTag, NUpload, useMessage,
  type DataTableColumns, type UploadFileInfo
} from 'naive-ui';
import {
  inventoryApi, type ApprovalStepDto, type AttachmentDto,
  type PurchaseRequestDto, type SupplierOrderDto
} from '@/api/inventory';
import { toApiError } from '@/api/client';

const route = useRoute();
const msg = useMessage();

const request = ref<PurchaseRequestDto | null>(null);
const approvals = ref<ApprovalStepDto[]>([]);
const attachments = ref<AttachmentDto[]>([]);
const supplierOrder = ref<SupplierOrderDto | null>(null);
const error = ref('');
const message = ref('');
const loading = ref(true);

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
  { title: 'Роль', key: 'approverRoleLabel' },
  { title: 'ФИО', key: 'approverFullName' },
  { title: 'Статус', key: 'status' },
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
    attachments.value = await inventoryApi.listAttachments(id);
    supplierOrder.value = await inventoryApi.getSupplierOrder(id);
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    loading.value = false;
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

function printRequest() {
  inventoryApi.printPurchaseRequest(route.params.id as string);
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
        <div><strong>VIN:</strong> {{ request.vinCode || '—' }}</div>
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
          <NDataTable :columns="approvalColumns" :data="approvals" size="small" :bordered="false" />
        </div>
      </div>
    </NSpace>
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
</style>
