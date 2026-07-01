export type EmbedMode = 'lists' | 'defect-act-form' | 'purchase-request-form';

export type EmbedOptions = {
  mode: EmbedMode;
  documentId?: string;
  initialList?: 'defect-acts' | 'purchase-requests' | 'inbox';
};

export type MountedApp = { unmount: () => void };

type EmbedModule = {
  mountMechanizationEmbed: (
    el: string | HTMLElement,
    options: EmbedOptions,
    getToken?: () => Promise<string | null>
  ) => Promise<MountedApp>;
};

let embedModule: EmbedModule | undefined;

async function loadEmbedModule(): Promise<EmbedModule> {
  if (!embedModule) {
    embedModule = await import('../../lib/frontend/mechanization-mount.js') as EmbedModule;
  }
  return embedModule;
}

export async function mountMechanizationEmbed(
  el: string | HTMLElement,
  options: EmbedOptions,
  getToken?: () => Promise<string | null>
): Promise<MountedApp> {
  const mod = await loadEmbedModule();
  return mod.mountMechanizationEmbed(el, options, getToken);
}
