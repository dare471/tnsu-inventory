<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NDataTable, NAlert, NSpace, NSpin, NButton, NTag, type DataTableColumns } from 'naive-ui';
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
    width: 150,
    ellipsis: { tooltip: true },
    render: (row) => h('a', {
      style: 'cursor:pointer;color:var(--brand-orange);font-weight:600',
      onClick: () => router.push({ name: 'purchase-request-detail', params: { id: row.id } })
    }, row.number)
  },
  { title: 'Статус', key: 'statusLabel', width: 160, ellipsis: { tooltip: true } },
  {
    title: 'На согласовании у',
    key: 'currentApproverFullName',
    width: 200,
    ellipsis: { tooltip: true },
    render: (row) => row.currentApproverFullName
      ? h(NTag, { type: 'warning', size: 'small' }, () => row.currentApproverFullName)
      : '—'
  },
  { title: 'Проект', key: 'projectName', width: 300, ellipsis: { tooltip: true } },
  { title: 'Техника', key: 'vehicleName', width: 260, ellipsis: { tooltip: true } },
  { title: 'Инициатор', key: 'initiatorFullName', width: 180, ellipsis: { tooltip: true } },
  {
    title: 'Дата',
    key: 'createdAt',
    width: 170,
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
      <NSpace>
        <NButton type="primary" @click="router.push({ name: 'purchase-request-new' })">
          Создать заявку
        </NButton>
      </NSpace>
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
