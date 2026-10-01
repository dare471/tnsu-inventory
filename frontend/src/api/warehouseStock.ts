import { apiClient } from '@/api/client';

export interface NomenclatureItem {
  id: string;
  name: string;
  fullName?: string;
  groupName?: string;
  unit?: string;
  quantity: number;
  code?: string;
  agskCode?: string;
  nomenclatureType?: string;
  storeName?: string;
  mol?: string;
  comment?: string;
  similarity?: number | null;
}

export interface NomenclaturePage {
  total: number;
  page: number;
  pageSize: number;
  items: NomenclatureItem[];
  syncedAt?: string | null;
}

export interface NomenclatureFilters {
  groupNames: string[];
  nomenclatureTypes: string[];
  syncedAt?: string | null;
  total: number;
}

export interface StockMatchQuery {
  id: string;
  name: string;
  agskCode?: string;
  unit?: string;
}

export interface StockMatchGroup {
  queryId: string;
  queryName: string;
  matches: NomenclatureItem[];
}

export interface StockMatchResponse {
  syncedAt?: string | null;
  results: StockMatchGroup[];
}

function pickStr(obj: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  }
  return '';
}

function pickNum(obj: Record<string, unknown>, keys: string[]): number {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string' && v.trim()) {
      const n = Number(v.replace(',', '.'));
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function asList(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw as Record<string, unknown>[];
  const obj = asRecord(raw);
  if (!obj) return [];
  for (const key of ['items', 'Items', 'value', 'Value', 'data', 'Data', 'results', 'Results']) {
    const v = obj[key];
    if (Array.isArray(v)) return v as Record<string, unknown>[];
  }
  return [];
}

function mapItem(raw: Record<string, unknown>): NomenclatureItem {
  return {
    id: pickStr(raw, ['id', 'Id', 'oid', 'Oid', 'nomenclatureId', 'NomenclatureId']) || crypto.randomUUID(),
    name: pickStr(raw, ['name', 'Name', 'title', 'Title']),
    fullName: pickStr(raw, ['fullName', 'FullName']) || undefined,
    groupName: pickStr(raw, ['groupName', 'GroupName', 'group', 'Group']) || undefined,
    unit: pickStr(raw, ['unit', 'Unit', 'unitName', 'UnitName']) || undefined,
    quantity: pickNum(raw, ['quantity', 'Quantity', 'qty', 'Qty', 'stock', 'Stock', 'balance', 'Balance']),
    code: pickStr(raw, ['code', 'Code', 'article', 'Article']) || undefined,
    agskCode: pickStr(raw, ['agskCode', 'AgskCode', 'codeSnb', 'CodeSnb']) || undefined,
    nomenclatureType: pickStr(raw, ['nomenclatureType', 'NomenclatureType', 'type', 'Type']) || undefined,
    storeName: pickStr(raw, ['storeName', 'StoreName', 'warehouse', 'Warehouse', 'storage', 'Storage']) || undefined,
    mol: pickStr(raw, ['mol', 'Mol', 'molName', 'MolName']) || undefined,
    comment: pickStr(raw, ['comment', 'Comment']) || undefined,
    similarity: (() => {
      const n = pickNum(raw, ['similarity', 'Similarity', 'score', 'Score']);
      return n > 0 ? n : null;
    })()
  };
}

function mapFilters(raw: unknown): NomenclatureFilters {
  const obj = asRecord(raw) || {};
  const groups = asList(obj.groupNames ?? obj.GroupNames ?? obj.groups ?? obj.Groups)
    .map((x) => (typeof x === 'string' ? x : pickStr(x, ['name', 'Name', 'value', 'Value'])))
    .filter(Boolean);
  const types = asList(obj.nomenclatureTypes ?? obj.NomenclatureTypes ?? obj.types ?? obj.Types)
    .map((x) => (typeof x === 'string' ? x : pickStr(x, ['name', 'Name', 'value', 'Value'])))
    .filter(Boolean);
  const groupStr = Array.isArray(obj.groupNames)
    ? (obj.groupNames as unknown[]).filter((x): x is string => typeof x === 'string')
    : Array.isArray(obj.GroupNames)
      ? (obj.GroupNames as unknown[]).filter((x): x is string => typeof x === 'string')
      : groups;
  const typeStr = Array.isArray(obj.nomenclatureTypes)
    ? (obj.nomenclatureTypes as unknown[]).filter((x): x is string => typeof x === 'string')
    : Array.isArray(obj.NomenclatureTypes)
      ? (obj.NomenclatureTypes as unknown[]).filter((x): x is string => typeof x === 'string')
      : types;
  return {
    groupNames: groupStr.length ? groupStr : groups,
    nomenclatureTypes: typeStr.length ? typeStr : types,
    syncedAt: pickStr(obj, ['syncedAt', 'SyncedAt']) || null,
    total: pickNum(obj, ['total', 'Total', 'count', 'Count'])
  };
}

function mapMatchResponse(raw: unknown, queries: StockMatchQuery[]): StockMatchResponse {
  const obj = asRecord(raw) || {};
  const resultsRaw = asList(obj.results ?? obj.Results ?? raw);
  const results: StockMatchGroup[] = resultsRaw.map((r, i) => ({
    queryId: pickStr(r, ['queryId', 'QueryId', 'id', 'Id']) || queries[i]?.id || `q-${i}`,
    queryName: pickStr(r, ['queryName', 'QueryName', 'name', 'Name']) || queries[i]?.name || '',
    matches: asList(r.matches ?? r.Matches ?? r.items ?? r.Items).map(mapItem)
  }));
  if (!results.length && Array.isArray(raw)) {
    return {
      syncedAt: null,
      results: queries.map((q) => ({
        queryId: q.id,
        queryName: q.name,
        matches: asList(raw).map(mapItem)
      }))
    };
  }
  return {
    syncedAt: pickStr(obj, ['syncedAt', 'SyncedAt']) || null,
    results
  };
}

export async function matchNomenclature(items: StockMatchQuery[]): Promise<StockMatchResponse> {
  const { data } = await apiClient.post<unknown>('/api/dictionaries/nomenclature/match', {
    items,
    limit: 8,
    minSimilarity: 0.22
  });
  return mapMatchResponse(data, items);
}

export async function getNomenclature(params: {
  search?: string;
  groupName?: string;
  nomenclatureType?: string;
  page?: number;
  pageSize?: number;
}): Promise<NomenclaturePage> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 25;
  try {
    const { data } = await apiClient.get<unknown>('/api/dictionaries/nomenclature/catalog', { params });
    const obj = asRecord(data) || {};
    const items = asList(obj.items ?? obj.Items ?? data).map(mapItem);
    return {
      total: pickNum(obj, ['total', 'Total', 'count', 'Count']) || items.length,
      page: pickNum(obj, ['page', 'Page']) || page,
      pageSize: pickNum(obj, ['pageSize', 'PageSize']) || pageSize,
      items,
      syncedAt: pickStr(obj, ['syncedAt', 'SyncedAt']) || null
    };
  } catch (e) {
    if (!params.search?.trim()) throw e;
    const matched = await matchNomenclature([{ id: 'search', name: params.search.trim() }]);
    const items = matched.results[0]?.matches ?? [];
    return {
      total: items.length,
      page: 1,
      pageSize: items.length || pageSize,
      items,
      syncedAt: matched.syncedAt
    };
  }
}

export async function getNomenclatureFilters(): Promise<NomenclatureFilters> {
  const { data } = await apiClient.get<unknown>('/api/dictionaries/nomenclature/filters');
  return mapFilters(data);
}

const TMC_TRANSFER_PAGE =
  'https://tnsukz.sharepoint.com/sites/requests/SitePages/'
  + '%D0%9F%D0%BE%D1%80%D1%82%D0%B0%D0%BB-%D0%97%D0%B0%D1%8F%D0%B2%D0%BE%D0%BA.aspx';

export function isLineGuid(id: string | undefined | null): boolean {
  return !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.trim());
}

export function openTmcTransferRequest(positionId: string, nomenclatureId: string, storeName?: string): void {
  const parts = [
    `rptype=${encodeURIComponent('wh-tmc-transfer')}`,
    `positionId=${encodeURIComponent(positionId)}`,
    `nomenclatureId=${encodeURIComponent(nomenclatureId)}`
  ];
  const store = storeName?.trim();
  if (store) parts.push(`storeName=${encodeURIComponent(store)}`);
  window.open(`${TMC_TRANSFER_PAGE}?${parts.join('&')}`, '_blank', 'noopener,noreferrer');
}
