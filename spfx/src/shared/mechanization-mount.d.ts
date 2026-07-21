declare module '*/mechanization-mount.js' {
  import type { EmbedOptions } from '../../src/shared/mechanization-embed';
  import type { SearchSparePartsFn } from '../../src/shared/sparePartsCatalog';

  export function mountMechanizationEmbed(
    el: string | HTMLElement,
    options: EmbedOptions,
    getToken?: () => Promise<string | null>,
    searchSpareParts?: SearchSparePartsFn
  ): Promise<{ unmount: () => void }>;
}
