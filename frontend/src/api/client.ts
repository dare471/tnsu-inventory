import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

declare global {
  interface Window {
    __MECH_API_BASE__?: string;
    __MECH_GET_TOKEN__?: () => Promise<string | null>;
  }
}

export function getApiBaseUrl(): string {
  const spfxBase = (window.__MECH_API_BASE__ ?? '').trim();
  if (spfxBase) return spfxBase.replace(/\/$/, '');

  const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_BASE ?? '').trim();
  return (configuredBaseUrl || window.location.origin).replace(/\/$/, '');
}

export const apiClient: AxiosInstance = axios.create({
  timeout: 30_000
});

const TOKEN_KEY = 'inventory.token';

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  config.baseURL = getApiBaseUrl();

  const url = String(config.url ?? '');
  if (isSpfxEmbed()) {
    (config as InternalAxiosRequestConfig & { __startedAt?: number }).__startedAt = Date.now();
    console.info('[Mechanization] → request', config.method?.toUpperCase(), `${config.baseURL}${url}`);
  }
  const isAnonymousAuth = url.includes('/api/auth/dev-login');

  if (!isAnonymousAuth) {
    if (window.__MECH_GET_TOKEN__) {
      const spToken = await window.__MECH_GET_TOKEN__();
      if (spToken) {
        config.headers = config.headers ?? {};
        config.headers['Authorization'] = `Bearer ${spToken}`;
        return config;
      }
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

export type ApiError = {
  code: string;
  detail: string;
  status: number;
};

export function toApiError(err: unknown): ApiError {
  const ax = err as AxiosError<{
    code?: string;
    detail?: string;
    title?: string;
    message?: string;
    status?: number;
  }>;

  const status = ax?.response?.status ?? 0;
  const raw = ax?.response?.data;

  if (raw && typeof raw === 'object') {
    const detail = raw.detail || raw.message || raw.title;
    if (typeof detail === 'string' && detail.length > 0) {
      return {
        code: raw.code || raw.title || 'unknown',
        detail,
        status
      };
    }
  }

  return {
    code: 'unknown',
    detail: ax?.message || 'Неизвестная ошибка',
    status
  };
}

function isSpfxEmbed(): boolean {
  return typeof window.__MECH_GET_TOKEN__ === 'function';
}

apiClient.interceptors.response.use(
  (r) => {
    if (isSpfxEmbed()) {
      const started = (r.config as InternalAxiosRequestConfig & { __startedAt?: number }).__startedAt;
      const ms = started ? Date.now() - started : undefined;
      console.info('[Mechanization] ← response', r.status, `${r.config.baseURL ?? ''}${r.config.url ?? ''}`, ms ? `${ms}ms` : '');
    }
    return r;
  },
  (error) => {
    const status = error?.response?.status;
    const requestUrl = String(error?.config?.url ?? '');
    if (isSpfxEmbed()) {
      const fullUrl = `${error?.config?.baseURL ?? ''}${requestUrl}`;
      console.error('[Mechanization] ✕ failed', status ?? error?.code ?? 'ERR', fullUrl, error?.message ?? '');
    }
    const isAuthRequest =
      requestUrl.includes('/api/auth/dev-login') ||
      (requestUrl.includes('/api/auth/me') && window.location.pathname.startsWith('/login'));

    if (status === 401 && !isAuthRequest && !isSpfxEmbed()) {
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export async function openPrintDocument(path: string) {
  const { data } = await apiClient.get<string>(path, { responseType: 'text' });
  const blob = new Blob([data], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    URL.revokeObjectURL(url);
    throw new Error('Разрешите всплывающие окна для печати документа.');
  }
  win.addEventListener('load', () => {
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  });
}
