<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NButton, NDataTable, NAlert, NSpace, NSpin, type DataTableColumns } from 'naive-ui';
import { inventoryApi, type DefectActListItem } from '@/api/inventory';
import { toApiError } from '@/api/client';

const router = useRouter();
const items = ref<DefectActListItem[]>([]);
const error = ref('');
const loading = ref(true);

const columns: DataTableColumns<DefectActListItem> = [
  {
    title: 'Номер',
    key: 'number',
    render: (row) => h('a', {
      style: 'cursor:pointer;color:var(--brand-orange);font-weight:600',
      onClick: () => router.push({ name: 'defect-act-detail', params: { id: row.id } })
    }, row.number)
  },
  { title: 'Статус', key: 'statusLabel' },
  { title: 'Проект', key: 'projectName' },
  { title: 'Техника', key: 'vehicleName' },
  { title: 'Гос. №', key: 'stateNumber' },
  {
    title: 'Дата',
    key: 'createdAt',
    render: (row) => new Date(row.createdAt).toLocaleString('ru-RU')
  }
];

onMounted(async () => {
  try {
    items.value = await inventoryApi.listDefectActs();
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    loading.value = false;
  }
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
