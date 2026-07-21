import { createApp, type App } from 'vue';
import { createPinia } from 'pinia';
import AppRoot from '@/App.vue';
import type { SearchSparePartsFn } from '@/api/spareParts';
import { createEmbedRouter } from './router';
import { type EmbedOptions } from './options';
import { readDocumentTypeFromUrl, resolveEmbedDocumentId } from './urlParams';
import latoCss from 'vfonts/Lato.css?inline';
import appCss from '@/styles/app.css?inline';

export type MountedApp = App<Element>;

const EMBED_STYLES_ID = 'mechanization-embed-styles';

function injectEmbedStyles(): void {
  if (document.getElementById(EMBED_STYLES_ID)) return;
  const style = document.createElement('style');
  style.id = EMBED_STYLES_ID;
  style.textContent = `${latoCss}\n${appCss}`;
  document.head.appendChild(style);
}

export async function mountMechanizationEmbed(
  el: string | HTMLElement,
  options: EmbedOptions,
  getToken?: () => Promise<string | null>,
  searchSpareParts?: SearchSparePartsFn
): Promise<MountedApp> {
  injectEmbedStyles();

  window.__MECH_EMBED__ = {
    ...options,
    documentId: resolveEmbedDocumentId(options.mode, options.documentId),
    documentType: options.documentType ?? readDocumentTypeFromUrl()
  };

  console.info(
    '[Mechanization] embed options',
    JSON.stringify(window.__MECH_EMBED__),
    '| location.search =',
    window.location.search
  );

  if (getToken) {
    window.__MECH_GET_TOKEN__ = getToken;
  }

  if (searchSpareParts) {
    window.__MECH_SEARCH_SPARE_PARTS__ = searchSpareParts;
  }

  const router = createEmbedRouter();
  const app = createApp(AppRoot);
  app.use(createPinia());
  app.use(router);
  await router.isReady();
  app.mount(el);
  return app;
}
