<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NDataTable, NAlert, NSpace, NSpin, type DataTableColumns } from 'naive-ui';
import { inventoryApi, type PurchaseRequestListItem } from '@/api/inventory';
import { toApiError } from '@/api/client';

const router = useRouter();
const items = ref<PurchaseRequestListItem[]>([]);
const error = ref('');
const loading = ref(true);

const columns: DataTableColumns<PurchaseRequestListItem> = [
  {
    title: 'Номер',
    key: 'number',
    render: (row) => h('a', {
      style: 'cursor:pointer;color:var(--brand-orange);font-weight:600',
      onClick: () => router.push({ name: 'purchase-request-detail', params: { id: row.id } })
    }, row.number)
  },
  { title: 'Статус', key: 'statusLabel' },
  { title: 'Проект', key: 'projectName' },
  { title: 'Техника', key: 'vehicleName' },
  {
    title: 'Сумма, ₸',
    key: 'estimatedAmount',
    render: (row) => row.estimatedAmount.toLocaleString('ru-RU')
  },
  {
    title: 'Дата',
    key: 'createdAt',
    render: (row) => new Date(row.createdAt).toLocaleString('ru-RU')
  }
];

onMounted(async () => {
  try {
    items.value = await inventoryApi.listPurchaseRequests();
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <NCard title="Заявки на закупку">
    <NSpace vertical>
      <NAlert v-if="error" type="error">{{ error }}</NAlert>
      <NSpin :show="loading">
        <div class="t-table-wrap">
          <NDataTable
            class="t-data-table"
            :columns="columns"
            :data="items"
            :bordered="false"
            size="small"
            :row-key="(r: PurchaseRequestListItem) => r.id"
          />
        </div>
        <p v-if="!loading && !items.length" style="color:var(--brand-text-muted)">Нет заявок</p>
      </NSpin>
    </NSpace>
  </NCard>
</template>
