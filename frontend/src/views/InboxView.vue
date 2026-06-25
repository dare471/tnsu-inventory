<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard, NButton, NDataTable, NAlert, NSpace, NSpin, useDialog, useMessage,
  type DataTableColumns
} from 'naive-ui';
import { inventoryApi, type InboxItem } from '@/api/inventory';
import { toApiError } from '@/api/client';

const router = useRouter();
const dialog = useDialog();
const msg = useMessage();

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
  { title: 'Просрочка, раб. дн.', key: 'pendingWorkingDays', width: 140 },
  {
    title: 'Действия',
    key: 'actions',
    width: 220,
    render: (row) => h(NSpace, { size: 8 }, () => [
      h(NButton, { size: 'small', type: 'primary', onClick: () => approve(row.stepId) }, () => 'Согласовать'),
      h(NButton, { size: 'small', secondary: true, onClick: () => returnDoc(row.stepId) }, () => 'Вернуть')
    ])
  }
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

function approve(stepId: string) {
  dialog.create({
    title: 'Согласование',
    content: 'Подтвердите согласование документа.',
    positiveText: 'Согласовать',
    negativeText: 'Отмена',
    onPositiveClick: async () => {
      try {
        await inventoryApi.approveStep(stepId);
        msg.success('Документ согласован');
        await load();
      } catch (e) {
        msg.error(toApiError(e).detail);
        return false;
      }
    }
  });
}

function returnDoc(stepId: string) {
  dialog.warning({
    title: 'Возврат документа',
    content: 'Укажите причину возврата в комментарии при следующем шаге.',
    positiveText: 'Вернуть',
    negativeText: 'Отмена',
    onPositiveClick: async () => {
      const comment = window.prompt('Комментарий (обязателен)');
      if (!comment) {
        msg.warning('Комментарий обязателен');
        return false;
      }
      try {
        await inventoryApi.returnStep(stepId, comment);
        msg.success('Документ возвращён');
        await load();
      } catch (e) {
        msg.error(toApiError(e).detail);
        return false;
      }
    }
  });
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
