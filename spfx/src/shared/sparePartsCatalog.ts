import { SPHttpClient, type SPHttpClientResponse } from '@microsoft/sp-http';
import type { WebPartContext } from '@microsoft/sp-webpart-base';

export type SparePartDto = {
  id: string;
  name: string;
  catalogNumber?: string;
  code?: string;
  unit?: string;
  vehicleName?: string;
  groupName?: string;
};

export type SearchSparePartsParams = {
  vehicleName?: string;
  search?: string;
};

export type SearchSparePartsFn = (
  params?: SearchSparePartsParams
) => Promise<SparePartDto[]>;

type FieldInfo = { InternalName: string; Title: string; Hidden?: boolean };

type FieldMapping = {
  nameField: string;
  catalogField?: string;
  codeField?: string;
  unitField?: string;
  /** Always Title in List8 («Нормализованная модель» / LinkTitle). */
  vehicleField: string;
  groupField?: string;
};

const CACHE_TTL_MS = 10 * 60 * 1000;
const LIST_FOLDER = 'Lists/List8';
const LIST_TITLE = 'Справочник запчастей по технике';

export function createSparePartsSearcher(context: WebPartContext): SearchSparePartsFn {
  let cache: { expires: number; parts: SparePartDto[] } | undefined;
  let inflight: Promise<SparePartDto[]> | undefined;

  async function ensureCatalog(): Promise<SparePartDto[]> {
    if (cache && cache.expires > Date.now()) {
      return cache.parts;
    }
    if (!inflight) {
      inflight = loadCatalog(context).then(
        (parts) => {
          cache = { parts, expires: Date.now() + CACHE_TTL_MS };
          inflight = undefined;
          return parts;
        },
        (err) => {
          inflight = undefined;
          throw err;
        }
      );
    }
    return inflight;
  }

  return async (params?: SearchSparePartsParams): Promise<SparePartDto[]> => {
    try {
      const parts = await ensureCatalog();
      let query = parts;

      const vehicleName = params?.vehicleName?.trim();
      if (vehicleName) {
        const filtered = parts.filter((p) => {
          const vn = (p.vehicleName ?? '').trim();
          if (!vn) return false;
          return (
            vn.toLowerCase().includes(vehicleName.toLowerCase()) ||
            vehicleName.toLowerCase().includes(vn.toLowerCase())
          );
        });
        query = filtered.length > 0 ? filtered : parts;
      }

      const search = params?.search?.trim();
      if (search) {
        const s = search.toLowerCase();
        query = query.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            (p.catalogNumber?.toLowerCase().includes(s) ?? false) ||
            (p.code?.toLowerCase().includes(s) ?? false) ||
            (p.vehicleName?.toLowerCase().includes(s) ?? false)
        );
      }

      return query
        .filter((p) => p.name.trim().length > 0)
        .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
        .slice(0, 100);
    } catch (err) {
      console.error('[Mechanization] spare parts catalog failed', err);
      return [];
    }
  };
}

async function loadCatalog(context: WebPartContext): Promise<SparePartDto[]> {
  const listBase = await resolveListApiBase(context);
  const fields = await fetchFields(context, listBase);
  let mapping = resolveFieldMapping(fields);

  console.info(
    '[Mechanization] spare parts field map',
    mapping,
    'fields=',
    fields
      .filter((f) => /title|наимен|нормал|групп|ед\.|модель|техник/i.test(`${f.Title} ${f.InternalName}`))
      .map((f) => `${f.Title}→${f.InternalName}`)
  );

  const rawItems = await fetchAllItems(context, listBase);
  if (rawItems.length === 0) {
    console.warn('[Mechanization] spare parts: list returned 0 items');
    return [];
  }

  // If configured name field is empty on the first row, rediscover from sample + field titles.
  mapping = repairMappingFromSample(mapping, fields, rawItems[0]);
  console.info('[Mechanization] spare parts field map (final)', mapping);

  let parts = rawItems
    .map((item) => mapItem(item, mapping))
    .filter((p) => p.name.trim().length > 0);

  // Last resort: Title = model, any other non-empty text column = part name.
  if (parts.length === 0) {
    console.warn('[Mechanization] spare parts: remapping via sample keys', Object.keys(rawItems[0]));
    const fallbackNameKey = guessNameKeyFromSample(rawItems[0], fields);
    if (fallbackNameKey) {
      mapping = { ...mapping, nameField: fallbackNameKey, vehicleField: 'Title' };
      parts = rawItems
        .map((item) => mapItem(item, mapping))
        .filter((p) => p.name.trim().length > 0);
    }
  }

  console.info('[Mechanization] spare parts loaded', {
    raw: rawItems.length,
    mapped: parts.length,
    withModel: parts.filter((p) => !!p.vehicleName).length,
    sample: parts[0]
  });

  return parts;
}

function repairMappingFromSample(
  mapping: FieldMapping,
  fields: FieldInfo[],
  sample: Record<string, unknown>
): FieldMapping {
  const nameOk = !!readString(sample, mapping.nameField);
  if (nameOk && mapping.nameField !== 'Title') {
    return mapping;
  }

  // Prefer InternalName of column whose display title is exactly «Наименование техники».
  const byTitle = fields.find(
    (f) => (f.Title ?? '').trim().toLowerCase() === 'наименование техники'
  );
  if (byTitle?.InternalName && readString(sample, byTitle.InternalName)) {
    return { ...mapping, nameField: byTitle.InternalName, vehicleField: 'Title' };
  }

  const guessed = guessNameKeyFromSample(sample, fields);
  if (guessed) {
    return { ...mapping, nameField: guessed, vehicleField: 'Title' };
  }

  return mapping;
}

function guessNameKeyFromSample(
  sample: Record<string, unknown>,
  fields: FieldInfo[]
): string | undefined {
  const skip = new Set([
    'id',
    'id',
    'title',
    'guid',
    'created',
    'modified',
    'author',
    'editor',
    'contenttype',
    'attachments',
    'filepath',
    'filesize',
    'uniqueid',
    'owshiddenversion',
    'fileleafref',
    'fileref',
    'filedirref'
  ]);

  // Field titles that look like the part name.
  for (const f of fields) {
    const t = (f.Title ?? '').toLowerCase();
    if (
      f.InternalName &&
      f.InternalName.toLowerCase() !== 'title' &&
      (t.includes('наименование техники') ||
        t.includes('наименование тмц') ||
        (t.includes('наименование') && !t.includes('нормализ')))
    ) {
      if (readString(sample, f.InternalName)) return f.InternalName;
    }
  }

  // Any string value on the item that isn't Title and looks like a label.
  for (const key of Object.keys(sample)) {
    if (skip.has(key.toLowerCase())) continue;
    if (key.startsWith('odata') || key.startsWith('@odata')) continue;
    if (key.endsWith('Id') || key.endsWith('StringId')) continue;
    const val = readString(sample, key);
    if (val && val !== readString(sample, 'Title')) {
      return key;
    }
  }

  return undefined;
}

async function resolveListApiBase(context: WebPartContext): Promise<string> {
  const webUrl = context.pageContext.web.absoluteUrl.replace(/\/$/, '');
  const serverRelative = joinServerRelative(
    context.pageContext.web.serverRelativeUrl,
    LIST_FOLDER
  );

  const byPath = `${webUrl}/_api/web/GetList('${escapeODataString(serverRelative)}')`;
  if (await listExists(context, byPath)) {
    return byPath;
  }

  const byTitle = `${webUrl}/_api/web/lists/getbytitle('${escapeODataString(LIST_TITLE)}')`;
  if (await listExists(context, byTitle)) {
    return byTitle;
  }

  throw new Error(
    `Список запчастей не найден (${LIST_FOLDER} / «${LIST_TITLE}»). Проверьте права Read.`
  );
}

async function listExists(context: WebPartContext, listBase: string): Promise<boolean> {
  try {
    const res = await context.spHttpClient.get(
      `${listBase}?$select=Id,Title`,
      SPHttpClient.configurations.v1
    );
    return res.ok;
  } catch {
    return false;
  }
}

async function fetchFields(context: WebPartContext, listBase: string): Promise<FieldInfo[]> {
  const url = `${listBase}/fields?$select=InternalName,Title,Hidden`;
  const json = await getJson<{ value?: FieldInfo[] }>(context, url);
  return (json.value ?? []).filter((f) => !f.Hidden);
}

/**
 * Plain items feed — no $select/$expand (those broke custom columns / emptied the catalog).
 */
async function fetchAllItems(
  context: WebPartContext,
  listBase: string
): Promise<Record<string, unknown>[]> {
  const items: Record<string, unknown>[] = [];
  let url: string | null = `${listBase}/items?$top=500`;

  type ItemsPage = {
    value?: Record<string, unknown>[];
    '@odata.nextLink'?: string;
    'odata.nextLink'?: string;
  };

  while (url) {
    const page: ItemsPage = await getJson<ItemsPage>(context, url);
    if (Array.isArray(page.value)) {
      items.push(...page.value);
    }
    const nextLink: string | undefined = page['@odata.nextLink'] ?? page['odata.nextLink'];
    url = nextLink || null;
    if (items.length >= 2000) break;
  }

  return items;
}

function resolveFieldMapping(fields: FieldInfo[]): FieldMapping {
  const byExactTitle = (title: string): string | undefined =>
    fields.find((f) => (f.Title ?? '').trim().toLowerCase() === title.toLowerCase())
      ?.InternalName;

  const byIncludes = (hint: string, exclude?: string): string | undefined => {
    const h = hint.toLowerCase();
    const hit = fields.find((f) => {
      const internal = f.InternalName ?? '';
      if (!internal || (exclude && internal === exclude)) return false;
      return (
        (f.Title ?? '').toLowerCase().includes(h) ||
        internal.toLowerCase().includes(h)
      );
    });
    return hit?.InternalName;
  };

  // Model = Title (renamed to «Нормализованная модель», sorted as LinkTitle).
  const vehicleField = 'Title';

  // Part name = «Наименование техники» (exact title first).
  const nameField =
    byExactTitle('Наименование техники') ||
    byIncludes('наименование техники', vehicleField) ||
    byExactTitle('Наименование ТМЦ') ||
    byIncludes('наименование тмц', vehicleField) ||
    byIncludes('наименование', vehicleField) ||
    'Title';

  const groupField =
    byExactTitle('Группа') || byIncludes('группа', vehicleField);
  const unitField =
    byExactTitle('Ед. изм.') ||
    byExactTitle('Ед. изм') ||
    byIncludes('ед. изм', vehicleField) ||
    byIncludes('единиц', vehicleField);

  return {
    nameField: nameField === vehicleField ? nameField : nameField,
    vehicleField,
    groupField,
    unitField,
    catalogField: byIncludes('каталог', vehicleField) || byIncludes('артикул', vehicleField),
    codeField: byExactTitle('Код') || byIncludes('код', vehicleField)
  };
}

function mapItem(item: Record<string, unknown>, mapping: FieldMapping): SparePartDto {
  const idRaw = item.Id ?? item.ID ?? item.id;

  // Title = normalized model. Part name = dedicated column (never Title when different).
  const vehicleName = readString(item, 'Title') || readString(item, mapping.vehicleField);
  let name = readString(item, mapping.nameField) ?? '';

  // If mapping pointed at Title by mistake, try to find another text-looking field from item keys.
  if ((!name || mapping.nameField === 'Title') && vehicleName) {
    const alt = readString(item, mapping.nameField !== 'Title' ? mapping.nameField : undefined);
    if (alt && alt !== vehicleName) {
      name = alt;
    }
  }

  // Still empty name but Title has value and nameField !== Title — keep name empty (filtered out).
  // If nameField === Title, use Title as name (last resort) and leave vehicle from Title too.
  if (!name && mapping.nameField === 'Title') {
    name = vehicleName ?? '';
  }

  return {
    id: idRaw != null ? String(idRaw) : '',
    name,
    catalogNumber: readString(item, mapping.catalogField),
    code: readString(item, mapping.codeField),
    unit: readString(item, mapping.unitField),
    vehicleName: mapping.nameField === 'Title' ? vehicleName : vehicleName,
    groupName: readString(item, mapping.groupField)
  };
}

function readString(
  item: Record<string, unknown>,
  fieldName?: string
): string | undefined {
  if (!fieldName) return undefined;

  const candidates = [
    fieldName,
    fieldName.replace(/ /g, '_x0020_'),
    fieldName.replace(/_x0020_/gi, ' ')
  ];

  for (const key of candidates) {
    if (Object.prototype.hasOwnProperty.call(item, key)) {
      const text = coerceString(item[key]);
      if (text) return text;
    }
  }

  // Case-insensitive key match (REST sometimes varies casing).
  const lower = fieldName.toLowerCase();
  for (const key of Object.keys(item)) {
    if (key.toLowerCase() === lower || key.toLowerCase() === lower.replace(/ /g, '_x0020_')) {
      const text = coerceString(item[key]);
      if (text) return text;
    }
  }

  return undefined;
}

function coerceString(raw: unknown): string | undefined {
  if (raw == null) return undefined;

  if (typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean') {
    const text = String(raw).trim();
    return text.length > 0 ? text : undefined;
  }

  if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    for (const key of ['LookupValue', 'Title', 'Label', 'Value', 'Name']) {
      const v = obj[key];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
  }

  return undefined;
}

async function getJson<T>(context: WebPartContext, url: string): Promise<T> {
  const res: SPHttpClientResponse = await context.spHttpClient.get(
    url,
    SPHttpClient.configurations.v1,
    {
      headers: {
        Accept: 'application/json;odata=nometadata'
      }
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`SharePoint REST ${res.status}: ${body || res.statusText}`);
  }

  return (await res.json()) as T;
}

function joinServerRelative(webServerRelativeUrl: string, folder: string): string {
  const base = (webServerRelativeUrl || '/').replace(/\/$/, '') || '';
  const path = folder.replace(/^\//, '');
  return `${base}/${path}`.replace(/\/{2,}/g, '/');
}

function escapeODataString(value: string): string {
  return value.replace(/'/g, "''");
}
