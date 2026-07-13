<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard, NButton, NDataTable, NAlert, NSpace, NSpin, useMessage,
  type DataTableColumns
} from 'naive-ui';
import { inventoryApi, type DefectActListItem } from '@/api/inventory';
import { toApiError } from '@/api/client';

const router = useRouter();
const msg = useMessage();
const items = ref<DefectActListItem[]>([]);
const error = ref('');
const loading = ref(true);
const deletingId = ref<string | null>(null);

async function load() {
  loading.value = true;
  error.value = '';
  try {
    items.value = await inventoryApi.listDefectActs();
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    loading.value = false;
  }
}

async function deleteDraft(row: DefectActListItem) {
  if (!window.confirm(`Удалить черновик ${row.number}?`)) return;
  deletingId.value = row.id;
  try {
    await inventoryApi.deleteDefectAct(row.id);
    items.value = items.value.filter((x) => x.id !== row.id);
    msg.success('Черновик удалён');
  } catch (e) {
    error.value = toApiError(e).detail;
    msg.error(error.value);
  } finally {
    deletingId.value = null;
  }
}

const columns: DataTableColumns<DefectActListItem> = [
  {
    title: 'Номер',
    key: 'number',
    width: 120,
    ellipsis: { tooltip: true },
    render: (row) => h('a', {
      style: 'cursor:pointer;color:var(--brand-orange);font-weight:600',
      onClick: () => router.push({ name: 'defect-act-detail', params: { id: row.id } })
    }, row.number)
  },
  { title: 'Статус', key: 'statusLabel', width: 130, ellipsis: { tooltip: true } },
  { title: 'Проект', key: 'projectName', width: 220, ellipsis: { tooltip: true } },
  { title: 'Техника', key: 'vehicleName', width: 200, ellipsis: { tooltip: true } },
  { title: 'Инициатор', key: 'initiatorFullName', width: 150, ellipsis: { tooltip: true } },
  { title: 'Гос. №', key: 'stateNumber', width: 100, ellipsis: { tooltip: true } },
  {
    title: 'Дата',
    key: 'createdAt',
    width: 160,
    render: (row) => new Date(row.createdAt).toLocaleString('ru-RU')
  },
  {
    title: '',
    key: 'actions',
    width: 110,
    fixed: 'right',
    render: (row) => {
      const canDelete = row.canDelete || row.status === 'draft';
      if (!canDelete) return null;
      return h(NButton, {
        size: 'small',
        type: 'error',
        tertiary: true,
        loading: deletingId.value === row.id,
        onClick: () => void deleteDraft(row)
      }, () => 'Удалить');
    }
  }
];

onMounted(() => {
  void load();
});
</script>

<template>
  <NCard title="Дефектные акты">
    <NSpace vertical>
      <NAlert v-if="error" type="error">{{ error }}</NAlert>
      <NSpace justify="space-between">
        <span />
        <NButton type="primary" @click="router.push({ name: 'defect-act-new' })">+ Новый акт</NButton>
      </NSpace>
      <NSpin :show="loading">
        <div class="t-table-wrap">
          <NDataTable
            class="t-data-table"
            :columns="columns"
            :data="items"
            :bordered="false"
            size="small"
            :row-key="(r: DefectActListItem) => r.id"
          />
        </div>
        <p v-if="!loading && !items.length" style="color:var(--brand-text-muted)">Нет документов</p>
      </NSpin>
    </NSpace>
  </NCard>
</template>
