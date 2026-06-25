import { apiClient } from '@/api/client';

export type MeResponse = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  roleLabel: string;
};

export type LoginResponse = {
  accessToken: string;
  expiresAt: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  roleLabel: string;
};

export const authApi = {
  devLogin: (email: string) =>
    apiClient.post<LoginResponse>('/api/auth/dev-login', { email }).then((r) => r.data),
  me: () => apiClient.get<MeResponse>('/api/auth/me').then((r) => r.data)
};
