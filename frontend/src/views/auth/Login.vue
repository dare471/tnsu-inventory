<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NForm, NFormItem, NInput, NButton, NAlert, NIcon, useMessage } from 'naive-ui';
import { MailOutline, LogoMicrosoft } from '@vicons/ionicons5';
import { useAuthStore } from '@/stores/auth';
import { toApiError } from '@/api/client';
import { appBrand } from '@/config/branding';
import { entraAuthEnabled } from '@/auth/entraAuth';
import { showDevLogin } from '@/config/devAuth';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const msg = useMessage();

const devEmail = ref('mechanic@tansu.local');
const error = ref<string | null>(null);
const submitting = ref(false);
const isDev = import.meta.env.DEV;

const pageSubtitle = computed(() =>
  entraAuthEnabled
    ? `Вход через Microsoft Entra ID для сотрудников ${appBrand.companyName}.`
    : appBrand.loginSubtitle
);

async function microsoftLogin() {
  error.value = null;
  submitting.value = true;
  try {
    await auth.loginWithMicrosoft();
    router.push((route.query.redirect as string) || '/home');
  } catch (e) {
    const err = toApiError(e);
    const message = err.detail || (e instanceof Error ? e.message : 'Ошибка входа через Microsoft');
    error.value = message;
    msg.error(message, { duration: 10000 });
  } finally {
    submitting.value = false;
  }
}

async function devLogin() {
  error.value = null;
  submitting.value = true;
  try {
    await auth.devLogin(devEmail.value.trim());
    router.push((route.query.redirect as string) || '/home');
  } catch (e) {
    const err = toApiError(e);
    error.value = err.detail || (e instanceof Error ? e.message : 'Ошибка входа');
    msg.error(error.value);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="t-login-bg">
    <div class="t-login-card">
      <div class="t-login-brand">
        <div class="t-login-logo">{{ appBrand.logoLetter }}</div>
        <div>
          <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:0.5px">{{ appBrand.companyName }}</div>
          <div style="color:rgba(255,255,255,.6);font-size:12px;text-transform:uppercase;letter-spacing:1px">
            {{ appBrand.moduleTitle }}
          </div>
        </div>
      </div>

      <div class="t-login-form">
        <h2 style="margin:0 0 6px 0;font-size:22px">Вход в систему</h2>
        <p style="color:var(--brand-text-muted);margin:0 0 22px 0;font-size:14px">
          {{ pageSubtitle }}
        </p>

        <NAlert v-if="error" type="error" style="margin-bottom:14px">{{ error }}</NAlert>

        <template v-if="entraAuthEnabled">
          <NButton block size="large" type="primary" :loading="submitting" @click="microsoftLogin">
            <template #icon><NIcon :component="LogoMicrosoft" /></template>
            Войти через Microsoft
          </NButton>
        </template>

        <template v-if="showDevLogin">
          <div :style="{ marginTop: entraAuthEnabled ? '24px' : '0' }">
            <NForm @submit.prevent="devLogin">
              <NFormItem label="Email (dev)">
                <NInput v-model:value="devEmail" placeholder="mechanic@tansu.local" size="large">
                  <template #prefix><NIcon :component="MailOutline" /></template>
                </NInput>
              </NFormItem>
              <NButton block size="large" :type="entraAuthEnabled ? 'default' : 'primary'" :loading="submitting" @click="devLogin">
                Войти (локально, только dev)
              </NButton>
            </NForm>
            <p style="margin:12px 0 0;font-size:12px;color:var(--brand-text-muted)">
              Демо-механик: mechanic@tansu.local · согласование: onglassyn.dauren@tnsukz.onmicrosoft.com (Entra)
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.t-login-bg {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background:
    radial-gradient(circle at 20% 30%, rgba(var(--brand-orange-rgb), 0.12), transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(var(--brand-navy-rgb), 0.08), transparent 50%),
    var(--brand-bg);
  padding: 24px;
}
.t-login-card {
  width: 880px;
  max-width: 100%;
  display: grid;
  grid-template-columns: 340px 1fr;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(15,23,42,0.12);
}
.t-login-brand {
  background: linear-gradient(160deg, var(--brand-navy-soft) 0%, var(--brand-navy) 100%);
  padding: 36px 28px;
  display: flex; flex-direction: column; gap: 16px;
}
.t-login-logo {
  width: 56px; height: 56px;
  border-radius: 14px;
  background: var(--brand-orange);
  color: #fff; font-weight: 800; font-size: 28px;
  display: flex; align-items: center; justify-content: center;
}
.t-login-form { padding: 40px 36px; }

@media (max-width: 720px) {
  .t-login-card { grid-template-columns: 1fr; }
}
</style>
