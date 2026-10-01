<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  NModal, NTabs, NTabPane, NInput, NSelect, NDataTable, NSpin, NPagination,
  type DataTableColumns
} from 'naive-ui';
import { Button, Badge, Alert } from '@tnsu/ui-kit-vue';
import { toApiError } from '@/api/client';
import {
  getNomenclature,
  getNomenclatureFilters,
  isLineGuid,
  matchNomenclature,
  openTmcTransferRequest,
  type NomenclatureItem,
  type StockMatchGroup,
  type StockMatchQuery
} from '@/api/warehouseStock';

const props = defineProps<{
  show: boolean;
  lines: Array<{ id?: string; name: string; catalogNumber?: string; unit?: string }>;
  canCreateTransfer?: boolean;
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
}>();

const tab = ref<'match' | 'catalog'>('match');
const loadingMatch = ref(false);
const loadingCatalog = ref(false);
const error = ref<string | null>(null);
const results = ref<StockMatchGroup[]>([]);
const syncedAt = ref<string | null>(null);

const search = ref('');
const groupName = ref<string | null>(null);
const nomenclatureType = ref<string | null>(null);
const groupOptions = ref<{ label: string; value: string }[]>([]);
const typeOptions = ref<{ label: string; value: string }[]>([]);
const catalog = ref<NomenclatureItem[]>([]);
const catalogTotal = ref(0);
const page = ref(1);
const pageSize = 25;

const visible = computed({
  get: () => props.show,
  set: (v: boolean) => emit('update:show', v)
});

const catalogColumns: DataTableColumns<NomenclatureItem> = [
  { title: 'Наименование', key: 'name', ellipsis: { tooltip: true } },
  { title: 'Код', key: 'code', width: 120 },
  { title: 'Ед.', key: 'unit', width: 70 },
  { title: 'Остаток', key: 'quantity', width: 90, render: (row) => String(row.quantity ?? 0) },
  { title: 'Склад', key: 'storeName', width: 140, ellipsis: { tooltip: true } },
  { title: 'Тип', key: 'nomenclatureType', width: 150, ellipsis: { tooltip: true } }
];

function similarityPct(value?: number | null): string {
  if (value == null) return '';
  return `${Math.round(value * 100)}%`;
}

function qtyClass(qty: number): string {
  return qty > 0 ? 'qty qty--yes' : 'qty qty--no';
}

function formatSynced(iso?: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('ru-RU');
  } catch {
    return iso;
  }
}

function canTransferForGroup(queryId: string): boolean {
  return !!props.canCreateTransfer && isLineGuid(queryId);
}

function onTransfer(positionId: string, nomenclatureId: string, storeName?: string): void {
  if (!isLineGuid(positionId) || !nomenclatureId) return;
  openTmcTransferRequest(positionId, nomenclatureId, storeName);
}

async function loadMatch(): Promise<void> {
  const named = props.lines.filter((line) => line.name.trim());
  if (!named.length) {
    results.value = [];
    return;
  }
  loadingMatch.value = true;
  error.value = null;
  try {
    const items: StockMatchQuery[] = named.map((line, i) => ({
      id: line.id || `line-${i}`,
      name: line.name,
      agskCode: line.catalogNumber,
      unit: line.unit
    }));
    const data = await matchNomenclature(items);
    results.value = data.results;
    syncedAt.value = data.syncedAt || null;
  } catch (e) {
    error.value = toApiError(e).detail || 'Не удалось проверить остатки';
    results.value = [];
  } finally {
    loadingMatch.value = false;
  }
}

async function loadFilters(): Promise<void> {
  try {
    const data = await getNomenclatureFilters();
    groupOptions.value = data.groupNames.map((n) => ({ label: n, value: n }));
    typeOptions.value = data.nomenclatureTypes.map((n) => ({ label: n, value: n }));
    if (data.syncedAt) syncedAt.value = data.syncedAt;
  } catch {
    /* фильтры необязательны */
  }
}

async function loadCatalog(): Promise<void> {
  loadingCatalog.value = true;
  error.value = null;
  try {
    const data = await getNomenclature({
      search: search.value || undefined,
      groupName: groupName.value || undefined,
      nomenclatureType: nomenclatureType.value || undefined,
      page: page.value,
      pageSize
    });
    catalog.value = data.items;
    catalogTotal.value = data.total;
    if (data.syncedAt) syncedAt.value = data.syncedAt;
  } catch (e) {
    error.value = toApiError(e).detail || 'Не удалось загрузить справочник';
    catalog.value = [];
  } finally {
    loadingCatalog.value = false;
  }
}

function onSearchCatalog(): void {
  page.value = 1;
  void loadCatalog();
}

watch(
  () => props.show,
  async (open) => {
    if (!open) return;
    tab.value = 'match';
    await Promise.all([loadMatch(), loadFilters()]);
  }
);

watch(tab, (t) => {
  if (t === 'catalog' && !catalog.value.length) void loadCatalog();
});
</script>

<template>
  <NModal v-model:show="visible" preset="card" title="Остатки на складах" style="width:min(960px,96vw)">
    <div v-if="syncedAt" class="muted" style="margin:-4px 0 12px;font-size:12px">
      Справочник обновлён: {{ formatSynced(syncedAt) }}
    </div>
    <Alert v-if="error" variant="danger" style="margin-bottom:12px">{{ error }}</Alert>

    <NTabs v-model:value="tab" type="line" animated>
      <NTabPane name="match" tab="Похожие по заявке">
        <div class="muted" style="font-size:12px;margin-bottom:10px">
          Источник: <code>POST /Dictionary/Nomenclature/match</code> (pg_trgm, api.tnsu.kz)
        </div>
        <NSpin :show="loadingMatch">
          <div v-if="!lines.length" class="muted">Сначала добавьте позиции в дефектный акт</div>
          <div v-else class="match-list">
            <section v-for="group in results" :key="group.queryId" class="match-card">
              <div class="match-card__title">{{ group.queryName }}</div>
              <div v-if="!group.matches.length" class="muted" style="font-size:13px">
                Похожих позиций на складах не найдено
              </div>
              <div v-else class="match-rows">
                <div v-for="item in group.matches" :key="item.id" class="match-row">
                  <div class="match-row__main">
                    <div class="match-row__name">{{ item.name }}</div>
                    <div class="muted" style="font-size:12px">
                      {{ item.code || 'без кода' }}
                      <span v-if="item.groupName"> · {{ item.groupName }}</span>
                      <span v-if="item.storeName"> · {{ item.storeName }}</span>
                      <span v-if="item.mol"> · МОЛ {{ item.mol }}</span>
                    </div>
                    <div v-if="canTransferForGroup(group.queryId) && item.id" style="margin-top:8px">
                      <Button size="sm" variant="secondary" @click="onTransfer(group.queryId, item.id, item.storeName)">
                        Оформить заявку на перемещение ТМЦ
                      </Button>
                    </div>
                  </div>
                  <div class="match-row__meta">
                    <Badge v-if="item.similarity != null" size="sm" variant="info">
                      сходство {{ similarityPct(item.similarity) }}
                    </Badge>
                    <span :class="qtyClass(Number(item.quantity))">
                      {{ item.quantity }} {{ item.unit || '' }}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </NSpin>
      </NTabPane>
      <NTabPane name="catalog" tab="Справочник складов">
        <div class="filters">
          <NInput
            v-model:value="search"
            placeholder="Поиск по наименованию или коду"
            clearable
            @keyup.enter="onSearchCatalog"
          />
          <NSelect
            v-model:value="groupName"
            :options="groupOptions"
            placeholder="Группа"
            clearable
            filterable
            @update:value="onSearchCatalog"
          />
          <NSelect
            v-model:value="nomenclatureType"
            :options="typeOptions"
            placeholder="Тип номенклатуры"
            clearable
            filterable
            @update:value="onSearchCatalog"
          />
          <Button size="sm" variant="secondary" :loading="loadingCatalog" @click="onSearchCatalog">
            Найти
          </Button>
        </div>
        <NSpin :show="loadingCatalog">
          <NDataTable :columns="catalogColumns" :data="catalog" size="small" :bordered="false" :max-height="360" />
          <div style="display:flex;justify-content:flex-end;margin-top:12px">
            <NPagination
              v-model:page="page"
              :item-count="catalogTotal"
              :page-size="pageSize"
              @update:page="loadCatalog"
            />
          </div>
        </NSpin>
      </NTabPane>
    </NTabs>
  </NModal>
</template>

<style scoped>
.muted { color: var(--brand-text-muted); }
.match-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 520px;
  overflow: auto;
}
.match-card {
  background: #fff;
  border: 1px solid var(--brand-border);
  border-radius: 12px;
  padding: 12px 14px;
}
.match-card__title { font-weight: 600; margin-bottom: 8px; }
.match-rows { display: flex; flex-direction: column; gap: 8px; }
.match-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  padding: 8px 0;
  border-top: 1px solid var(--brand-border);
}
.match-row__main { min-width: 0; }
.match-row__name { font-size: 13px; }
.match-row__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}
.qty { font-weight: 700; font-size: 13px; white-space: nowrap; }
.qty--yes { color: #1b7a3d; }
.qty--no { color: var(--brand-text-muted); }
.filters {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr auto;
  gap: 8px;
  margin-bottom: 12px;
}
@media (max-width: 800px) {
  .filters { grid-template-columns: 1fr; }
  .match-row { flex-direction: column; }
  .match-row__meta { align-items: flex-start; }
}
</style>
