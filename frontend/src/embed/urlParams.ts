import type { EmbedDocumentType, EmbedMode } from './options';

const COMMON_KEYS = ['documentId', 'docid'];
const DOC_TYPE_KEYS = ['doctype', 'documenttype', 'type'];
const TYPE_LIKE = new Set([
  'defect_act',
  'defect-act',
  'defectact',
  'purchase_request',
  'purchase-request',
  'purchaserequest'
]);

const KEYS_BY_MODE: Partial<Record<EmbedMode, string[]>> = {
  'purchase-request-form': ['purchaserequestid', 'requestid'],
  'defect-act-form': ['defectactid', 'actid']
};

const GUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isDocumentGuid(value: string | undefined | null): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  if (TYPE_LIKE.has(trimmed.toLowerCase())) return false;
  return GUID_RE.test(trimmed);
}

export function readDocumentIdFromUrl(mode: EmbedMode): string | undefined {
  const params = new URLSearchParams(window.location.search);
  const entries = [...params.entries()].map(([name, value]) => [name.toLowerCase(), value] as const);
  const keys = [...COMMON_KEYS, ...(KEYS_BY_MODE[mode] ?? []), 'id'].map((k) => k.toLowerCase());

  for (const key of keys) {
    const match = entries.find(([name]) => name === key);
    const value = match?.[1]?.trim();
    if (isDocumentGuid(value)) return value;
  }

  return undefined;
}

export function resolveEmbedDocumentId(mode: EmbedMode, propertyId?: string): string | undefined {
  return readDocumentIdFromUrl(mode) || (isDocumentGuid(propertyId) ? propertyId!.trim() : undefined);
}

export function readDocumentTypeFromUrl(): EmbedDocumentType | undefined {
  const params = new URLSearchParams(window.location.search);
  const entries = [...params.entries()].map(([name, value]) => [name.toLowerCase(), value] as const);

  for (const key of DOC_TYPE_KEYS) {
    const raw = entries.find(([name]) => name === key)?.[1]?.trim().toLowerCase();
    if (!raw) continue;
    if (raw === 'defect_act' || raw === 'defect-act' || raw === 'defectact') return 'defect_act';
    if (raw === 'purchase_request' || raw === 'purchase-request' || raw === 'purchaserequest') return 'purchase_request';
  }

  return undefined;
}

export function readEmbedViewFromUrl(): 'admin-users' | undefined {
  const view = new URLSearchParams(window.location.search).get('view')?.trim().toLowerCase();
  if (view === 'admin' || view === 'admin-users') return 'admin-users';
  return undefined;
}
