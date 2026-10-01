<script setup lang="ts">
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NInput, NButton, NSpace, NDataTable, NAlert, type DataTableColumns } from 'naive-ui';
import { inventoryApi, type StockBalanceDto } from '@/api/inventory';
import { toApiError } from '@/api/client';

const router = useRouter();
const search = ref('');
const items = ref<StockBalanceDto[]>([]);
const selected = ref<string[]>([]);
const error = ref('');
const loading = ref(false);

const columns: DataTableColumns<StockBalanceDto> = [
  { type: 'selection' },
  { title: 'Склад', key: 'warehouse' },
  { title: 'Код', key: 'code', width: 140 },
  { title: 'Наименование', key: 'name' },
  { title: 'Ед.', key: 'unit', width: 90, render: (r) => r.unit || '—' },
  { title: 'Остаток', key: 'quantity', width: 110, render: (r) => r.quantity ?? '—' }
];

async function load() {
  loading.value = true;
  error.value = '';
  try {
    items.value = await inventoryApi.searchStock(search.value.trim() || undefined);
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    loading.value = false;
  }
}

function createTransfer() {
  const lines = items.value.filter((item) => selected.value.includes(item.id));
  router.push({
    name: 'transfer-new',
    state: {
      lines: lines.map((item, index) => ({
        lineNo: index + 1,
        code: item.code,
        name: item.name,
        quantity: 1,
        unit: item.unit || 'шт.',
        availableQuantity: item.quantity ?? null
      })),
      sourceWarehouse: lines[0]?.warehouse ?? ''
    }
  });
}
</script>

<template>
  <NCard title="Складские остатки">
    <NSpace vertical :size="16">
      <NAlert v-if="error" type="error">{{ error }}</NAlert>
      <NSpace>
        <NInput v-model:value="search" placeholder="Код или наименование" clearable style="width:320px" @keyup.enter="load" />
        <NButton type="primary" :loading="loading" @click="load">Найти</NButton>
        <NButton :disabled="!selected.length" @click="createTransfer">Создать перемещение</NButton>
      </NSpace>
      <NDataTable
        :columns="columns"
        :data="items"
        :loading="loading"
        :row-key="(row: StockBalanceDto) => row.id"
        v-model:checked-row-keys="selected"
        size="small"
      />
    </NSpace>
  </NCard>
</template>
