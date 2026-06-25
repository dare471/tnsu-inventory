import { defineStore } from 'pinia';
import { authApi, type LoginResponse, type MeResponse } from '@/api/auth';
import {
  clearAuthProvider,
  entraAuthEnabled,
  isEntraSession,
  loginWithMicrosoft,
  logoutMicrosoft,
  markEntraSession
} from '@/auth/entraAuth';
import { showDevLogin } from '@/config/devAuth';

type AuthState = {
  token: string | null;
  user: MeResponse | null;
  loading: boolean;
};

const TOKEN_KEY = 'inventory.token';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem(TOKEN_KEY),
    user: null,
    loading: false
  }),
  getters: {
    isAuthenticated: (s) => !!s.token,
    roleLabel: (s) => s.user?.roleLabel ?? '—'
  },
  actions: {
    async devLogin(email: string) {
      if (entraAuthEnabled && !showDevLogin) {
        throw new Error('Локальный вход отключён. Используйте Microsoft Entra ID.');
      }
      this.loading = true;
      try {
        const res: LoginResponse = await authApi.devLogin(email);
        this.token = res.accessToken;
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        clearAuthProvider();
        await this.fetchMe();
      } finally {
        this.loading = false;
      }
    },
    async loginWithMicrosoft() {
      this.loading = true;
      try {
        const result = await loginWithMicrosoft();
        this.token = result.accessToken;
        localStorage.setItem(TOKEN_KEY, result.accessToken);
        markEntraSession();
        try {
          await this.fetchMe();
        } catch (e) {
          this.token = null;
          localStorage.removeItem(TOKEN_KEY);
          clearAuthProvider();
          throw e;
        }
      } finally {
        this.loading = false;
      }
    },
    async fetchMe() {
      this.user = await authApi.me();
    },
    logout() {
      const wasEntra = isEntraSession();
      this.token = null;
      this.user = null;
      localStorage.removeItem(TOKEN_KEY);
      clearAuthProvider();
      if (wasEntra) {
        void logoutMicrosoft();
      }
    }
  }
});
