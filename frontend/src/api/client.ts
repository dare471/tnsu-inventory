import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_BASE ?? '').trim();
const baseURL = configuredBaseUrl || window.location.origin;

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 30_000
});

const TOKEN_KEY = 'inventory.token';

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const url = String(config.url ?? '');
  const isAnonymousAuth = url.includes('/api/auth/dev-login');

  if (!isAnonymousAuth) {
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

apiClient.interceptors.response.use(
  (r) => r,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = String(error?.config?.url ?? '');
    const isAuthRequest =
      requestUrl.includes('/api/auth/dev-login') ||
      (requestUrl.includes('/api/auth/me') && window.location.pathname.startsWith('/login'));

    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
