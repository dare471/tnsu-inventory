import { PublicClientApplication, type AuthenticationResult } from '@azure/msal-browser';

const clientId = (import.meta.env.VITE_ENTRA_CLIENT_ID ?? '').trim();
const tenantId = (import.meta.env.VITE_ENTRA_TENANT_ID ?? '').trim();
const audience = (import.meta.env.VITE_ENTRA_AUDIENCE ?? '').trim();
const apiScope = (import.meta.env.VITE_ENTRA_API_SCOPE ?? '').trim()
  || (audience ? `${audience}/.default` : '');

export const entraAuthEnabled = !!(clientId && tenantId && apiScope);

const configuredRedirectUri = (import.meta.env.VITE_ENTRA_REDIRECT_URI ?? '').trim();

export function getEntraRedirectUri(): string {
  if (configuredRedirectUri) return configuredRedirectUri;
  return `${window.location.origin}/login`;
}

const AUTH_PROVIDER_KEY = 'inventory.authProvider';

let msalApp: PublicClientApplication | null = null;

function getMsalApp() {
  if (!entraAuthEnabled) return null;
  if (!msalApp) {
    msalApp = new PublicClientApplication({
      auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri: getEntraRedirectUri()
      },
      cache: {
        cacheLocation: 'sessionStorage'
      }
    });
  }
  return msalApp;
}

export function isEntraSession() {
  return localStorage.getItem(AUTH_PROVIDER_KEY) === 'entra';
}

export function markEntraSession() {
  localStorage.setItem(AUTH_PROVIDER_KEY, 'entra');
}

export function clearAuthProvider() {
  localStorage.removeItem(AUTH_PROVIDER_KEY);
}

export async function initializeEntraAuth(): Promise<AuthenticationResult | null> {
  const app = getMsalApp();
  if (!app) return null;
  await app.initialize();
  return await app.handleRedirectPromise();
}

export async function loginWithMicrosoft(): Promise<AuthenticationResult> {
  const app = getMsalApp();
  if (!app) throw new Error('Microsoft Entra ID не настроен.');

  await app.initialize();
  const result = await app.loginPopup({
    scopes: ['openid', 'profile', 'email', apiScope],
    prompt: 'select_account',
    redirectUri: getEntraRedirectUri()
  });

  if (!result.accessToken) {
    throw new Error('Не удалось получить токен Microsoft Entra ID.');
  }

  return result;
}

export async function logoutMicrosoft() {
  if (!isEntraSession()) return;
  const app = getMsalApp();
  if (!app) return;

  await app.initialize();
  const account = app.getAllAccounts()[0];
  if (account) {
    await app.logoutPopup({
      account,
      postLogoutRedirectUri: getEntraRedirectUri()
    });
  }
}
