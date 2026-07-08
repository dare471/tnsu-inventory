import type { EmbedMode } from './options';

const COMMON_KEYS = ['documentId', 'docid', 'id'];

const KEYS_BY_MODE: Partial<Record<EmbedMode, string[]>> = {
  'purchase-request-form': ['purchaserequestid', 'requestid'],
  'defect-act-form': ['defectactid', 'actid']
};

export function readDocumentIdFromUrl(mode: EmbedMode): string | undefined {
  const params = new URLSearchParams(window.location.search);
  const entries = [...params.entries()].map(([name, value]) => [name.toLowerCase(), value] as const);
  const keys = [...COMMON_KEYS, ...(KEYS_BY_MODE[mode] ?? [])].map((k) => k.toLowerCase());

  for (const key of keys) {
    const match = entries.find(([name]) => name === key);
    const value = match?.[1]?.trim();
    if (value) return value;
  }

  return undefined;
}

export function resolveEmbedDocumentId(mode: EmbedMode, propertyId?: string): string | undefined {
  return readDocumentIdFromUrl(mode) || propertyId?.trim() || undefined;
}

export function readEmbedViewFromUrl(): 'admin-users' | undefined {
  const view = new URLSearchParams(window.location.search).get('view')?.trim().toLowerCase();
  if (view === 'admin' || view === 'admin-users') return 'admin-users';
  return undefined;
}
