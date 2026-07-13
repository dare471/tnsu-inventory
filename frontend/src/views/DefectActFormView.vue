<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NCard, NForm, NFormItem, NSelect, NInput, NInputNumber, NButton, NAlert, NSpace,
  NDataTable, NTag, NUpload, NModal, useMessage, type UploadFileInfo, type DataTableColumns
} from 'naive-ui';
import {
  inventoryApi, type ApprovalStepDto, type DefectActDto, type DefectActPartInput,
  type ProjectDto, type VehicleDto, type InboxItem, type AttachmentDto
} from '@/api/inventory';
import { toApiError } from '@/api/client';

const route = useRoute();
const router = useRouter();
const msg = useMessage();
const id = computed(() => route.params.id as string | undefined);
const isNew = computed(() => route.name === 'defect-act-new');

const projects = ref<ProjectDto[]>([]);
const vehicles = ref<VehicleDto[]>([]);
const act = ref<DefectActDto | null>(null);
const approvals = ref<ApprovalStepDto[]>([]);
const attachments = ref<AttachmentDto[]>([]);
const inboxItem = ref<InboxItem | null>(null);
const error = ref('');
const message = ref('');
const loading = ref(true);
const deleting = ref(false);
const decisionModalOpen = ref(false);
const decisionKind = ref<'approve' | 'return'>('approve');
const decisionComment = ref('');
const decisionSubmitting = ref(false);
const actingRoleLabel = computed(() => inboxItem.value?.approverRoleLabel ?? '—');

const projectId = ref('');
const projectCode = ref('');
const projectName = ref('');
const vehicleId = ref('');
const vehicleName = ref('');
const vehicleGroupName = ref('');
const stateNumber = ref('');
const vinCode = ref('');
const vehicleYear = ref<number | null>(null);
const malfunctionDescription = ref('');
const parts = ref<DefectActPartInput[]>([{ lineNo: 1, name: '', quantity: 1, unit: 'шт' }]);

const editable = computed(() => isNew.value || !!act.value?.canEdit);
const photoAttachments = computed(() => attachments.value.filter((a) => a.category === 'defect_photo'));
const otherAttachments = computed(() => attachments.value.filter((a) => a.category !== 'defect_photo'));

const projectOptions = computed(() =>
  projects.value.map((p) => ({ label: `${p.code} — ${p.projectName}`, value: p.id }))
);
const vehicleOptions = computed(() =>
  vehicles.value.map((v) => ({ label: v.name, value: v.id }))
);

const partColumns = computed<DataTableColumns<DefectActPartInput>>(() => [
  { title: '#', key: 'lineNo', width: 50 },
  {
    title: 'Наименование',
    key: 'name',
    render: (row, index) => h(NInput, {
      value: row.name,
      disabled: !editable.value,
      onUpdateValue: (v: string) => { parts.value[index].name = v; }
    })
  },
  {
    title: 'Кат. №',
    key: 'catalogNumber',
    render: (row, index) => h(NInput, {
      value: row.catalogNumber ?? '',
      disabled: !editable.value,
      onUpdateValue: (v: string) => { parts.value[index].catalogNumber = v; }
    })
  },
  {
    title: 'Кол-во',
    key: 'quantity',
    width: 100,
    render: (row, index) => h(NInputNumber, {
      value: row.quantity,
      min: 0,
      disabled: !editable.value,
      onUpdateValue: (v: number | null) => { parts.value[index].quantity = v ?? 0; }
    })
  },
  {
    title: 'Ед.',
    key: 'unit',
    width: 80,
    render: (row, index) => h(NInput, {
      value: row.unit ?? '',
      disabled: !editable.value,
      onUpdateValue: (v: string) => { parts.value[index].unit = v; }
    })
  },
  editable.value ? {
    title: '',
    key: 'actions',
    width: 60,
    render: (_row, index) => h(NButton, {
      size: 'small',
      type: 'error',
      tertiary: true,
      onClick: () => removePart(index)
    }, () => '×')
  } : { title: '', key: 'actions', width: 1 }
]);

const approvalColumns: DataTableColumns<ApprovalStepDto> = [
  { title: 'Шаг', key: 'orderNo', width: 60 },
  { title: 'Роль', key: 'approverRoleLabel' },
  { title: 'Согласующий', key: 'approverFullName' },
  { title: 'Статус', key: 'statusLabel' },
  {
    title: 'Дата',
    key: 'statusDate',
    render: (r) => (r.statusDate ? new Date(r.statusDate).toLocaleString('ru-RU') : '—')
  },
  { title: 'Комментарий', key: 'comment', render: (r) => r.comment ?? '—' }
];
const attachmentColumns: DataTableColumns<AttachmentDto> = [
  {
    title: 'Файл',
    key: 'fileName',
    render: (r) => h('a', { href: `/api/attachments/${r.id}`, target: '_blank' }, r.fileName)
  },
  {
    title: 'Дата',
    key: 'uploadedAt',
    render: (r) => new Date(r.uploadedAt).toLocaleString('ru-RU')
  }
];

onMounted(async () => {
  try {
    [projects.value, vehicles.value] = await Promise.all([
      inventoryApi.getProjects(),
      inventoryApi.getVehicles()
    ]);
    if (id.value) await loadAct(id.value);
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    loading.value = false;
  }
});

async function loadAct(actId: string) {
  act.value = await inventoryApi.getDefectAct(actId);
  approvals.value = await inventoryApi.getDefectApprovals(actId);
  attachments.value = await inventoryApi.listDefectAttachments(actId);
  const inbox = await inventoryApi.getInbox();
  inboxItem.value = inbox.find((x) => x.documentType === 'defect_act' && x.documentId === actId) ?? null;
  projectId.value = act.value.projectId;
  projectCode.value = act.value.projectCode;
  projectName.value = act.value.projectName;
  vehicleId.value = act.value.vehicleId;
  vehicleName.value = act.value.vehicleName;
  vehicleGroupName.value = act.value.vehicleGroupName;
  stateNumber.value = act.value.stateNumber;
  vinCode.value = act.value.vinCode;
  vehicleYear.value = act.value.vehicleYear ?? null;
  malfunctionDescription.value = act.value.malfunctionDescription;
  parts.value = act.value.parts.map((p) => ({
    lineNo: p.lineNo, name: p.name, catalogNumber: p.catalogNumber,
    quantity: p.quantity, unit: p.unit, notes: p.notes
  }));
}

async function uploadFiles(options: { file: UploadFileInfo }) {
  const raw = options.file.file;
  if (!raw || !id.value) return;
  try {
    await inventoryApi.uploadDefectAttachment(id.value, raw, 'general');
    attachments.value = await inventoryApi.listDefectAttachments(id.value);
    msg.success('Файл загружен');
  } catch (e) {
    error.value = toApiError(e).detail;
    msg.error(error.value);
  }
}

async function uploadPhoto(options: { file: UploadFileInfo }) {
  const raw = options.file.file;
  if (!raw || !id.value) return;
  if (!raw.type.startsWith('image/')) {
    msg.error('Допустимы только изображения (JPEG, PNG и т.д.)');
    return;
  }
  try {
    await inventoryApi.uploadDefectAttachment(id.value, raw, 'defect_photo');
    attachments.value = await inventoryApi.listDefectAttachments(id.value);
    msg.success('Фото загружено');
  } catch (e) {
    error.value = toApiError(e).detail;
    msg.error(error.value);
  }
}

function onProjectChange(v: string) {
  const p = projects.value.find((x) => x.id === v);
  if (!p) return;
  projectCode.value = p.code;
  projectName.value = p.projectName;
}

function onVehicleChange(v: string) {
  const veh = vehicles.value.find((x) => x.id === v);
  if (!veh) return;
  vehicleName.value = veh.name;
  vehicleGroupName.value = veh.groupName;
  stateNumber.value = veh.stateNumber;
  vinCode.value = veh.vinCode;
}

function addPart() {
  parts.value.push({ lineNo: parts.value.length + 1, name: '', quantity: 1, unit: 'шт' });
}

function removePart(idx: number) {
  parts.value.splice(idx, 1);
  parts.value.forEach((p, i) => { p.lineNo = i + 1; });
}

async function save() {
  error.value = '';
  message.value = '';
  try {
    if (isNew.value) {
      const dto = await inventoryApi.createDefectAct({
        projectId: projectId.value, projectCode: projectCode.value, projectName: projectName.value,
        vehicleId: vehicleId.value, vehicleName: vehicleName.value, vehicleGroupName: vehicleGroupName.value,
        stateNumber: stateNumber.value, vinCode: vinCode.value,
        vehicleYear: vehicleYear.value ?? undefined,
        malfunctionDescription: malfunctionDescription.value, parts: parts.value
      });
      router.replace({ name: 'defect-act-detail', params: { id: dto.id } });
      await loadAct(dto.id);
      message.value = 'Черновик сохранён';
    } else if (id.value) {
      act.value = await inventoryApi.updateDefectAct(id.value, {
        malfunctionDescription: malfunctionDescription.value, parts: parts.value
      });
      message.value = 'Изменения сохранены';
    }
  } catch (e) {
    error.value = toApiError(e).detail;
  }
}

async function submit() {
  if (!id.value) return;
  try {
    act.value = await inventoryApi.submitDefectAct(id.value);
    approvals.value = await inventoryApi.getDefectApprovals(id.value);
    message.value = 'Отправлено на согласование';
  } catch (e) {
    error.value = toApiError(e).detail;
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
    if (id.value) await loadAct(id.value);
  } catch (e) {
    msg.error(toApiError(e).detail);
  } finally {
    decisionSubmitting.value = false;
  }
}

async function createPurchase() {
  if (!id.value) return;
  try {
    const pr = await inventoryApi.createPurchaseFromDefect(id.value);
    router.push({ name: 'purchase-request-detail', params: { id: pr.id } });
  } catch (e) {
    error.value = toApiError(e).detail;
  }
}

function printAct() {
  if (!id.value) return;
  void inventoryApi.printDefectAct(id.value).catch((e) => {
    error.value = toApiError(e).detail;
  });
}

async function deleteDraft() {
  if (!act.value?.canDelete || !id.value) return;
  if (!window.confirm(`Удалить черновик ${act.value.number}?`)) return;
  deleting.value = true;
  error.value = '';
  try {
    await inventoryApi.deleteDefectAct(id.value);
    msg.success('Черновик удалён');
    await router.push({ name: 'defect-acts' });
  } catch (e) {
    error.value = toApiError(e).detail;
    msg.error(error.value);
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <NCard :title="isNew ? 'Новый дефектный акт' : `Дефектный акт ${act?.number ?? ''}`">
    <NSpace vertical :size="16">
      <NAlert v-if="error" type="error">{{ error }}</NAlert>
      <NAlert v-if="message" type="success">{{ message }}</NAlert>
      <NTag v-if="act?.statusLabel" type="info">{{ act.statusLabel }}</NTag>

      <div class="t-grid-2">
        <NFormItem label="Проект">
          <NSelect
            v-model:value="projectId"
            :options="projectOptions"
            :disabled="!editable"
            placeholder="Выберите проект"
            filterable
            @update:value="onProjectChange"
          />
        </NFormItem>
        <NFormItem label="Основное средство / техника">
          <NSelect
            v-model:value="vehicleId"
            :options="vehicleOptions"
            :disabled="!editable"
            placeholder="Выберите технику"
            filterable
            @update:value="onVehicleChange"
          />
        </NFormItem>
      </div>
      <div class="t-grid-2">
        <NFormItem label="Гос. номер">
          <NInput v-model:value="stateNumber" readonly />
        </NFormItem>
        <NFormItem label="VIN">
          <NInput v-model:value="vinCode" readonly />
        </NFormItem>
        <NFormItem label="Год">
          <NInputNumber v-model:value="vehicleYear" :disabled="!editable" style="width:100%" />
        </NFormItem>
        <NFormItem label="Группа">
          <NInput v-model:value="vehicleGroupName" readonly />
        </NFormItem>
      </div>

      <NFormItem label="Описание неисправности">
        <NInput v-model:value="malfunctionDescription" type="textarea" :rows="4" :disabled="!editable" />
      </NFormItem>

      <div>
        <h3 style="margin:0 0 12px">Запчасти / материалы</h3>
        <div class="t-table-wrap">
          <NDataTable :columns="partColumns" :data="parts" size="small" :bordered="false" />
        </div>
        <NButton v-if="editable" secondary style="margin-top:8px" @click="addPart">+ Строка</NButton>
      </div>

      <NSpace>
        <NButton v-if="editable" type="primary" @click="save">Сохранить черновик</NButton>
        <NButton v-if="act?.canSubmit" type="primary" @click="submit">Отправить на согласование</NButton>
        <NButton v-if="inboxItem" type="primary" @click="openDecision('approve')">Согласовать</NButton>
        <NButton v-if="inboxItem" secondary @click="openDecision('return')">Вернуть</NButton>
        <NButton v-if="act?.canCreatePurchaseRequest" type="primary" @click="createPurchase">Сформировать заявку</NButton>
        <NButton v-if="!isNew && act" secondary @click="printAct">Печать / PDF</NButton>
        <NButton
          v-if="act?.canDelete"
          type="error"
          secondary
          :loading="deleting"
          @click="deleteDraft"
        >
          Удалить черновик
        </NButton>
      </NSpace>

      <div v-if="id">
        <h3 style="margin:0 0 12px">Фото неисправности</h3>
        <p v-if="editable" style="margin:0 0 12px;color:var(--brand-text-muted)">
          Обязательно для отправки на согласование
        </p>
        <NSpace v-if="editable" style="margin-bottom:12px">
          <NUpload accept="image/*" :show-file-list="false" @change="uploadPhoto">
            <NButton secondary>Добавить фото</NButton>
          </NUpload>
        </NSpace>
        <div v-if="photoAttachments.length" class="t-table-wrap">
          <NDataTable :columns="attachmentColumns" :data="photoAttachments" size="small" :bordered="false" />
        </div>
        <p v-else style="color:var(--brand-text-muted)">Фото не прикреплены</p>
      </div>

      <div v-if="id">
        <h3 style="margin:0 0 12px">Прочие вложения</h3>
        <NSpace v-if="editable" style="margin-bottom:12px">
          <NUpload :show-file-list="false" @change="uploadFiles">
            <NButton secondary>Добавить вложение</NButton>
          </NUpload>
        </NSpace>
        <div v-if="otherAttachments.length" class="t-table-wrap">
          <NDataTable :columns="attachmentColumns" :data="otherAttachments" size="small" :bordered="false" />
        </div>
        <p v-else style="color:var(--brand-text-muted)">Вложений нет</p>
      </div>

      <div v-if="approvals.length">
        <h3 style="margin:0 0 12px">Маршрут согласования</h3>
        <div class="t-table-wrap">
          <NDataTable :columns="approvalColumns" :data="approvals" size="small" :bordered="false" />
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
        <NFormItem label="Комментарий">
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
  gap: 12px 16px;
}
@media (max-width: 900px) {
  .t-grid-2 { grid-template-columns: 1fr; }
}
</style>
