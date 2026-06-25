import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { appBrand } from './config/branding';
import { initializeEntraAuth } from './auth/entraAuth';
import 'vfonts/Lato.css';
import './styles/app.css';

document.title = `${appBrand.brandName} — ${appBrand.moduleTitle}`;

async function bootstrap() {
  await initializeEntraAuth();

  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.mount('#mechanization-app');
  return app;
}

export function mountMechanizationApp(el: string | HTMLElement = '#mechanization-app') {
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.mount(el);
  return app;
}

if (document.getElementById('mechanization-app')) {
  void bootstrap();
}
