<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NCard, NForm, NFormItem, NSelect, NInput, NInputNumber, NButton, NAlert, NSpace,
  NDataTable, NTag, type DataTableColumns
} from 'naive-ui';
import {
  inventoryApi, type ApprovalStepDto, type DefectActDto, type DefectActPartInput,
  type ProjectDto, type VehicleDto
} from '@/api/inventory';
import { toApiError } from '@/api/client';

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id as string | undefined);
const isNew = computed(() => route.name === 'defect-act-new');

const projects = ref<ProjectDto[]>([]);
const vehicles = ref<VehicleDto[]>([]);
const act = ref<DefectActDto | null>(null);
const approvals = ref<ApprovalStepDto[]>([]);
const error = ref('');
const message = ref('');
const loading = ref(true);

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
  { title: 'Статус', key: 'status' },
  { title: 'Комментарий', key: 'comment', render: (r) => r.comment ?? '—' }
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
  if (id.value) inventoryApi.printDefectAct(id.value);
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
        <NButton v-if="act?.canCreatePurchaseRequest" type="primary" @click="createPurchase">Сформировать заявку</NButton>
        <NButton v-if="!isNew && act" secondary @click="printAct">Печать</NButton>
      </NSpace>

      <div v-if="approvals.length">
        <h3 style="margin:0 0 12px">Маршрут согласования</h3>
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
  gap: 12px 16px;
}
@media (max-width: 900px) {
  .t-grid-2 { grid-template-columns: 1fr; }
}
</style>
