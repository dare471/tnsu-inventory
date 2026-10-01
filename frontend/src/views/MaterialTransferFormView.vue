<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NCard, NFormItem, NInput, NInputNumber, NButton, NSpace, NAlert, NDataTable, NAutoComplete, type DataTableColumns
} from 'naive-ui';
import { inventoryApi, type MaterialTransferLineInput } from '@/api/inventory';
import { toApiError } from '@/api/client';
import { unitOptions } from '@/config/units';

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id as string | undefined);
const isNew = computed(() => route.name === 'transfer-new');

const sourceWarehouse = ref('');
const destination = ref('');
const comment = ref('');
const lines = ref<MaterialTransferLineInput[]>([]);
const statusLabel = ref('');
const canEdit = ref(true);
const error = ref('');
const message = ref('');
const saving = ref(false);

const columns = computed<DataTableColumns<MaterialTransferLineInput>>(() => [
  { title: '#', key: 'lineNo', width: 50 },
  { title: 'Код', key: 'code', width: 120 },
  { title: 'Наименование', key: 'name' },
  {
    title: 'Кол-во',
    key: 'quantity',
    width: 120,
    render: (row, index) => h(NInputNumber, {
      value: row.quantity,
      min: 0,
      disabled: !canEdit.value,
      onUpdateValue: (v: number | null) => { lines.value[index].quantity = v ?? 0; }
    })
  },
  {
    title: 'Ед.',
    key: 'unit',
    width: 140,
    render: (row, index) => h(NAutoComplete, {
      value: row.unit,
      options: unitOptions.map((o) => o.value),
      disabled: !canEdit.value,
      onUpdateValue: (v: string) => { lines.value[index].unit = v; }
    })
  },
  { title: 'Остаток', key: 'availableQuantity', width: 100, render: (row) => row.availableQuantity ?? '—' }
]);

onMounted(async () => {
  if (id.value) {
    try {
      const dto = await inventoryApi.getTransfer(id.value);
      sourceWarehouse.value = dto.sourceWarehouse;
      destination.value = dto.destination;
      comment.value = dto.comment ?? '';
      lines.value = dto.lines.map((l) => ({ ...l }));
      statusLabel.value = dto.statusLabel;
      canEdit.value = dto.canEdit;
    } catch (e) {
      error.value = toApiError(e).detail;
    }
    return;
  }

  const state = history.state as { lines?: MaterialTransferLineInput[]; sourceWarehouse?: string } | null;
  if (state?.lines?.length) {
    lines.value = state.lines;
    sourceWarehouse.value = state.sourceWarehouse ?? '';
  }
});

function payload() {
  return {
    sourceWarehouse: sourceWarehouse.value.trim(),
    destination: destination.value.trim(),
    comment: comment.value.trim() || undefined,
    lines: lines.value
  };
}

async function save() {
  saving.value = true;
  error.value = '';
  try {
    if (isNew.value) {
      const dto = await inventoryApi.createTransfer(payload());
      router.replace({ name: 'transfer-detail', params: { id: dto.id } });
      message.value = 'Черновик сохранён';
      canEdit.value = dto.canEdit;
      statusLabel.value = dto.statusLabel;
    } else if (id.value) {
      const dto = await inventoryApi.updateTransfer(id.value, payload());
      message.value = 'Изменения сохранены';
      canEdit.value = dto.canEdit;
    }
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    saving.value = false;
  }
}

async function submit() {
  if (!id.value) return;
  saving.value = true;
  error.value = '';
  try {
    const dto = await inventoryApi.submitTransfer(id.value);
    statusLabel.value = dto.statusLabel;
    canEdit.value = dto.canEdit;
    message.value = 'Заявка на перемещение отправлена';
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <NCard :title="isNew ? 'Новая заявка на перемещение ТМЦ' : `Перемещение ${statusLabel}`">
    <NSpace vertical :size="16">
      <NAlert v-if="error" type="error">{{ error }}</NAlert>
      <NAlert v-if="message" type="success">{{ message }}</NAlert>
      <div class="t-grid-2">
        <NFormItem label="Склад-отправитель">
          <NInput v-model:value="sourceWarehouse" :disabled="!canEdit" />
        </NFormItem>
        <NFormItem label="Получатель">
          <NInput v-model:value="destination" :disabled="!canEdit" />
        </NFormItem>
      </div>
      <NFormItem label="Комментарий">
        <NInput v-model:value="comment" type="textarea" :rows="3" :disabled="!canEdit" />
      </NFormItem>
      <NDataTable :columns="columns" :data="lines" size="small" />
      <NSpace>
        <NButton v-if="canEdit" type="primary" :loading="saving" @click="save">Сохранить</NButton>
        <NButton v-if="canEdit && id" type="primary" :loading="saving" @click="submit">Отправить</NButton>
        <NButton secondary @click="router.push({ name: 'material-transfers' })">К списку</NButton>
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
</style>
