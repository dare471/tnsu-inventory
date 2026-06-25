/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENTRA_CLIENT_ID?: string;
  readonly VITE_ENTRA_TENANT_ID?: string;
  readonly VITE_ENTRA_AUDIENCE?: string;
  readonly VITE_ENTRA_API_SCOPE?: string;
  readonly VITE_ENTRA_REDIRECT_URI?: string;
  readonly VITE_APP_BRAND_NAME?: string;
  readonly VITE_APP_COMPANY_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
