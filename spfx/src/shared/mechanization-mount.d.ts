declare module '*/mechanization-mount.js' {
  import type { EmbedOptions } from '../../src/shared/mechanization-embed';

  export function mountMechanizationEmbed(
    el: string | HTMLElement,
    options: EmbedOptions,
    getToken?: () => Promise<string | null>
  ): Promise<{ unmount: () => void }>;
}
