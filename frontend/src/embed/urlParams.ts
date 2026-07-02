import type { EmbedMode } from './options';

const COMMON_KEYS = ['documentId', 'id'];

const KEYS_BY_MODE: Partial<Record<EmbedMode, string[]>> = {
  'purchase-request-form': ['purchaseRequestId', 'requestId'],
  'defect-act-form': ['defectActId', 'actId']
};

export function readDocumentIdFromUrl(mode: EmbedMode): string | undefined {
  const params = new URLSearchParams(window.location.search);
  const keys = [...COMMON_KEYS, ...(KEYS_BY_MODE[mode] ?? [])];

  for (const key of keys) {
    const value = params.get(key)?.trim();
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
