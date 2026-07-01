import { createApp, type App } from 'vue';
import { createPinia } from 'pinia';
import AppRoot from '@/App.vue';
import { createEmbedRouter } from './router';
import { type EmbedOptions } from './options';
import 'vfonts/Lato.css';
import '@/styles/app.css';

export type MountedApp = App<Element>;

export async function mountMechanizationEmbed(
  el: string | HTMLElement,
  options: EmbedOptions,
  getToken?: () => Promise<string | null>
): Promise<MountedApp> {
  window.__MECH_EMBED__ = options;

  if (getToken) {
    window.__MECH_GET_TOKEN__ = getToken;
  }

  const router = createEmbedRouter();
  const app = createApp(AppRoot);
  app.use(createPinia());
  app.use(router);
  app.mount(el);
  return app;
}
