<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard, NFormItem, NSelect, NInput, NInputNumber, NButton, NAlert, NSpace,
  NDataTable, type DataTableColumns
} from 'naive-ui';
import {
  inventoryApi, type ProjectDto, type VehicleDto, type PurchaseRequestLineInput
} from '@/api/inventory';
import { toApiError } from '@/api/client';

const router = useRouter();

const projects = ref<ProjectDto[]>([]);
const vehicles = ref<VehicleDto[]>([]);
const error = ref('');
const message = ref('');
const loading = ref(true);
const saving = ref(false);

const projectId = ref('');
const projectCode = ref('');
const projectName = ref('');
const vehicleId = ref('');
const vehicleName = ref('');
const vehicleGroupName = ref('');
const stateNumber = ref('');
const vinCode = ref('');
const vehicleYear = ref<number | null>(null);
const description = ref('');
const lines = ref<PurchaseRequestLineInput[]>([{ lineNo: 1, name: '', quantity: 1, unit: 'шт' }]);

const projectOptions = computed(() =>
  projects.value.map((p) => ({ label: `${p.code} — ${p.projectName}`, value: p.id }))
);
const vehicleOptions = computed(() =>
  vehicles.value.map((v) => ({ label: v.name, value: v.id }))
);

const lineColumns = computed<DataTableColumns<PurchaseRequestLineInput>>(() => [
  { title: '#', key: 'lineNo', width: 50 },
  {
    title: 'Наименование',
    key: 'name',
    render: (row, index) => h(NInput, {
      value: row.name,
      onUpdateValue: (v: string) => { lines.value[index].name = v; }
    })
  },
  {
    title: 'Кат. №',
    key: 'catalogNumber',
    render: (row, index) => h(NInput, {
      value: row.catalogNumber ?? '',
      onUpdateValue: (v: string) => { lines.value[index].catalogNumber = v; }
    })
  },
  {
    title: 'Кол-во',
    key: 'quantity',
    width: 100,
    render: (row, index) => h(NInputNumber, {
      value: row.quantity,
      min: 0,
      onUpdateValue: (v: number | null) => { lines.value[index].quantity = v ?? 0; }
    })
  },
  {
    title: 'Ед.',
    key: 'unit',
    width: 80,
    render: (row, index) => h(NInput, {
      value: row.unit ?? '',
      onUpdateValue: (v: string) => { lines.value[index].unit = v; }
    })
  },
  {
    title: '',
    key: 'actions',
    width: 60,
    render: (_row, index) => h(NButton, {
      size: 'small',
      type: 'error',
      tertiary: true,
      onClick: () => removeLine(index)
    }, () => '×')
  }
]);

onMounted(async () => {
  try {
    [projects.value, vehicles.value] = await Promise.all([
      inventoryApi.getProjects(),
      inventoryApi.getVehicles()
    ]);
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    loading.value = false;
  }
});

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

function addLine() {
  lines.value.push({ lineNo: lines.value.length + 1, name: '', quantity: 1, unit: 'шт' });
}

function removeLine(idx: number) {
  lines.value.splice(idx, 1);
  lines.value.forEach((p, i) => { p.lineNo = i + 1; });
}

async function save() {
  error.value = '';
  message.value = '';
  if (!projectId.value || !vehicleId.value) {
    error.value = 'Выберите проект и технику.';
    return;
  }
  if (!description.value.trim()) {
    error.value = 'Укажите описание заявки.';
    return;
  }
  if (!lines.value.some((l) => l.name.trim())) {
    error.value = 'Добавьте хотя бы одну позицию.';
    return;
  }

  saving.value = true;
  try {
    const dto = await inventoryApi.createPurchaseRequest({
      projectId: projectId.value,
      projectCode: projectCode.value,
      projectName: projectName.value,
      vehicleId: vehicleId.value,
      vehicleName: vehicleName.value,
      vehicleGroupName: vehicleGroupName.value,
      stateNumber: stateNumber.value,
      vinCode: vinCode.value,
      vehicleYear: vehicleYear.value ?? undefined,
      description: description.value.trim(),
      lines: lines.value.filter((l) => l.name.trim())
    });
    message.value = 'Черновик заявки сохранён';
    router.replace({ name: 'purchase-request-detail', params: { id: dto.id } });
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <NCard title="Новая заявка на закупку">
    <NSpace vertical :size="16">
      <NAlert v-if="error" type="error">{{ error }}</NAlert>
      <NAlert v-if="message" type="success">{{ message }}</NAlert>

      <div class="t-grid-2">
        <NFormItem label="Проект">
          <NSelect
            v-model:value="projectId"
            :options="projectOptions"
            :loading="loading"
            placeholder="Выберите проект"
            filterable
            @update:value="onProjectChange"
          />
        </NFormItem>
        <NFormItem label="Основное средство / техника">
          <NSelect
            v-model:value="vehicleId"
            :options="vehicleOptions"
            :loading="loading"
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
          <NInputNumber v-model:value="vehicleYear" style="width:100%" />
        </NFormItem>
        <NFormItem label="Группа">
          <NInput v-model:value="vehicleGroupName" readonly />
        </NFormItem>
      </div>

      <NFormItem label="Описание / обоснование">
        <NInput v-model:value="description" type="textarea" :rows="4" />
      </NFormItem>

      <div>
        <h3 style="margin:0 0 12px">Позиции заявки</h3>
        <div class="t-table-wrap">
          <NDataTable :columns="lineColumns" :data="lines" size="small" :bordered="false" />
        </div>
        <NButton secondary style="margin-top:8px" @click="addLine">+ Строка</NButton>
      </div>

      <NSpace>
        <NButton type="primary" :loading="saving" @click="save">Сохранить черновик</NButton>
        <NButton secondary @click="router.push({ name: 'purchase-requests' })">Отмена</NButton>
      </NSpace>
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
