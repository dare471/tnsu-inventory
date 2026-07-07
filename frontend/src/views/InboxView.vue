<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NDataTable, NAlert, NSpace, NSpin, type DataTableColumns } from 'naive-ui';
import { inventoryApi, type InboxItem } from '@/api/inventory';
import { toApiError } from '@/api/client';

const router = useRouter();
const items = ref<InboxItem[]>([]);
const error = ref('');
const loading = ref(true);

const columns: DataTableColumns<InboxItem> = [
  {
    title: 'Документ',
    key: 'documentNumber',
    render: (row) => h('a', {
      style: 'cursor:pointer;color:var(--brand-orange);font-weight:600',
      onClick: () => docLink(row)
    }, `${row.documentNumber} — ${row.title}`)
  },
  {
    title: 'Тип',
    key: 'documentType',
    render: (row) => (row.documentType === 'defect_act' ? 'Дефектный акт' : 'Заявка')
  },
  { title: 'Роль', key: 'approverRoleLabel' },
  { title: 'Шаг', key: 'orderNo', width: 70 },
  { title: 'Просрочка, раб. дн.', key: 'pendingWorkingDays', width: 140 }
];

onMounted(load);

async function load() {
  loading.value = true;
  error.value = '';
  try {
    items.value = await inventoryApi.getInbox();
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    loading.value = false;
  }
}

function docLink(item: InboxItem) {
  if (item.documentType === 'defect_act') {
    router.push({ name: 'defect-act-detail', params: { id: item.documentId } });
  } else {
    router.push({ name: 'purchase-request-detail', params: { id: item.documentId } });
  }
}

</script>

<template>
  <NCard title="Входящие согласования">
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
            :row-key="(r: InboxItem) => r.stepId"
          />
        </div>
        <p v-if="!loading && !items.length" style="color:var(--brand-text-muted)">Нет задач на согласование</p>
      </NSpin>
    </NSpace>
  </NCard>
</template>
