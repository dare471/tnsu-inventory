<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NButton, NDataTable, NAlert, type DataTableColumns } from 'naive-ui';
import { inventoryApi, type MaterialTransferDto } from '@/api/inventory';
import { toApiError } from '@/api/client';

const router = useRouter();
const items = ref<MaterialTransferDto[]>([]);
const error = ref('');
const loading = ref(true);

const columns: DataTableColumns<MaterialTransferDto> = [
  { title: 'Номер', key: 'number' },
  { title: 'Статус', key: 'statusLabel' },
  { title: 'Откуда', key: 'sourceWarehouse' },
  { title: 'Куда', key: 'destination' },
  { title: 'Автор', key: 'createdByFullName' },
  {
    title: 'Дата',
    key: 'createdAt',
    render: (r) => new Date(r.createdAt).toLocaleString('ru-RU')
  }
];

onMounted(async () => {
  try {
    items.value = await inventoryApi.listTransfers();
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    loading.value = false;
  }
});

function rowProps(row: MaterialTransferDto) {
  return {
    style: 'cursor:pointer',
    onClick: () => router.push({ name: 'transfer-detail', params: { id: row.id } })
  };
}
</script>

<template>
  <NCard title="Заявки на перемещение ТМЦ">
    <NAlert v-if="error" type="error" style="margin-bottom:12px">{{ error }}</NAlert>
    <NButton type="primary" style="margin-bottom:12px" @click="router.push({ name: 'transfer-new' })">
      Новая заявка
    </NButton>
    <NDataTable :columns="columns" :data="items" :loading="loading" :row-props="rowProps" size="small" />
  </NCard>
</template>
