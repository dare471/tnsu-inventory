<script setup lang="ts">
import { computed, h, ref, watch } from 'vue';
import {
  NAutoComplete, NButton, NDataTable, NInput, NModal, NCard, NSpace,
  type DataTableColumns
} from 'naive-ui';
import { inventoryApi, type SparePartDto } from '@/api/inventory';

const props = defineProps<{
  modelValue: string;
  catalogNumber?: string | null;
  unit?: string | null;
  vehicleName?: string | null;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:catalogNumber': [value: string];
  'update:unit': [value: string];
  select: [part: SparePartDto];
}>();

const options = ref<Array<{ label: string; value: string; part: SparePartDto }>>([]);
const loading = ref(false);
const modalOpen = ref(false);
const modalSearch = ref('');
const modalRows = ref<SparePartDto[]>([]);
const modalLoading = ref(false);
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const autoOptions = computed(() =>
  options.value.map((o) => ({
    label: o.label,
    value: o.value
  }))
);

async function searchParts(query: string) {
  loading.value = true;
  try {
    const items = await inventoryApi.searchSpareParts({
      vehicleName: props.vehicleName || undefined,
      search: query || undefined
    });
    options.value = items.map((p) => ({
      label: [p.name, p.groupName, p.unit].filter(Boolean).join(' · '),
      value: p.name,
      part: p
    }));
  } catch {
    options.value = [];
  } finally {
    loading.value = false;
  }
}

function onSearch(query: string) {
  emit('update:modelValue', query);
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => void searchParts(query), 250);
}

function onSelect(value: string) {
  const hit = options.value.find((o) => o.value === value || o.part.name === value);
  if (!hit) {
    emit('update:modelValue', value);
    return;
  }
  applyPart(hit.part);
}

function applyPart(part: SparePartDto) {
  emit('update:modelValue', part.name);
  if (part.catalogNumber) emit('update:catalogNumber', part.catalogNumber);
  if (part.unit) emit('update:unit', part.unit);
  emit('select', part);
  modalOpen.value = false;
}

async function openModal() {
  modalOpen.value = true;
  modalSearch.value = props.modelValue || '';
  await loadModal();
}

async function loadModal() {
  modalLoading.value = true;
  try {
    modalRows.value = await inventoryApi.searchSpareParts({
      vehicleName: props.vehicleName || undefined,
      search: modalSearch.value || undefined
    });
  } catch {
    modalRows.value = [];
  } finally {
    modalLoading.value = false;
  }
}

watch(modalSearch, () => {
  if (!modalOpen.value) return;
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => void loadModal(), 300);
});

const modalColumns: DataTableColumns<SparePartDto> = [
  { title: 'Наименование ТМЦ', key: 'name', ellipsis: { tooltip: true } },
  { title: 'Группа', key: 'groupName', width: 140, render: (r) => r.groupName || '—' },
  { title: 'Ед.', key: 'unit', width: 70, render: (r) => r.unit || '—' },
  {
    title: 'Норм. модель',
    key: 'vehicleName',
    width: 200,
    ellipsis: { tooltip: true },
    render: (r) => r.vehicleName || '—'
  },
  {
    title: '',
    key: 'actions',
    width: 90,
    render: (row) => h(NButton, {
      size: 'small',
      type: 'primary',
      tertiary: true,
      onClick: () => applyPart(row)
    }, () => 'Выбрать')
  }
];
</script>

<template>
  <div class="t-spare-part-field">
    <div class="t-spare-part-field__input">
      <NAutoComplete
        :value="modelValue"
        :options="autoOptions"
        :loading="loading"
        :disabled="disabled"
        placeholder="Начните ввод или откройте справочник"
        clearable
        @update:value="onSearch"
        @select="onSelect"
      />
    </div>
    <NButton
      class="t-spare-part-field__btn"
      size="small"
      secondary
      :disabled="disabled"
      title="Справочник запчастей"
      @click="openModal"
    >
      Справочник
    </NButton>
  </div>

  <NModal v-model:show="modalOpen" style="width: min(920px, 96vw)">
    <NCard title="Справочник запчастей" :bordered="false" closable @close="modalOpen = false">
      <NSpace vertical :size="12">
        <NInput
          v-model:value="modalSearch"
          clearable
          placeholder="Поиск по наименованию, кат. №, коду"
        />
        <p v-if="vehicleName" style="margin:0;color:var(--brand-text-muted);font-size:13px">
          Фильтр по технике: {{ vehicleName }}
        </p>
        <div class="t-table-wrap">
          <NDataTable
            :columns="modalColumns"
            :data="modalRows"
            :loading="modalLoading"
            size="small"
            :bordered="false"
            :max-height="420"
          />
        </div>
      </NSpace>
    </NCard>
  </NModal>
</template>

<style scoped>
.t-spare-part-field {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 10px;
  width: 100%;
  min-width: 220px;
  box-sizing: border-box;
}

.t-spare-part-field__input {
  flex: 1 1 auto;
  min-width: 0;
}

.t-spare-part-field__input :deep(.n-auto-complete),
.t-spare-part-field__input :deep(.n-input) {
  width: 100%;
}

.t-spare-part-field__btn {
  flex: 0 0 auto;
  align-self: center;
  white-space: nowrap;
  margin-left: 2px;
}
</style>
