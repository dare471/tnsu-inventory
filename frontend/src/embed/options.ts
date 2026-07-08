export type EmbedMode = 'lists' | 'defect-act-form' | 'purchase-request-form';

export type EmbedDocumentType = 'defect_act' | 'purchase_request';

export type EmbedOptions = {
  mode: EmbedMode;
  documentId?: string;
  documentType?: EmbedDocumentType;
  initialList?: 'defect-acts' | 'purchase-requests' | 'inbox';
};

declare global {
  interface Window {
    __MECH_EMBED__?: EmbedOptions;
  }
}

export function getEmbedOptions(): EmbedOptions | null {
  return window.__MECH_EMBED__ ?? null;
}

export function isEmbedMode(): boolean {
  return getEmbedOptions() !== null;
}
