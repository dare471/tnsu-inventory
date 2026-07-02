<script setup lang="ts">
import { computed, h, onMounted, ref, watch, type Component } from 'vue';
import { useRouter, useRoute, RouterView } from 'vue-router';
import { NIcon, NAvatar, NDropdown, NTooltip, NAlert } from 'naive-ui';
import {
  HomeOutline, DocumentTextOutline, CartOutline, MailUnreadOutline,
  LogOutOutline, ChevronDownOutline, ChevronBackOutline, ChevronForwardOutline
} from '@vicons/ionicons5';
import { useAuthStore } from '@/stores/auth';
import { appBrand } from '@/config/branding';
import { getEmbedOptions, isEmbedMode } from '@/embed/options';
import { toApiError } from '@/api/client';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const embed = getEmbedOptions();
const spfxMode = isEmbedMode();
const authError = ref('');

const SIDEBAR_COLLAPSED_KEY = 'inventory.sidebar.collapsed';
const sidebarCollapsed = ref(false);

onMounted(async () => {
  sidebarCollapsed.value = localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1';

  if (spfxMode && !auth.user) {
    try {
      await auth.fetchMe();
    } catch (e) {
      authError.value = toApiError(e).detail || 'Не удалось авторизоваться через SharePoint';
    }
  }
});

watch(sidebarCollapsed, (value) => {
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, value ? '1' : '0');
});

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
}

type NavItem = {
  name: string;
  label: string;
  icon: Component;
};

const allItems: NavItem[] = [
  { name: 'home', label: 'Главная', icon: HomeOutline },
  { name: 'defect-acts', label: 'Дефектные акты', icon: DocumentTextOutline },
  { name: 'purchase-requests', label: 'Заявки на закупку', icon: CartOutline },
  { name: 'inbox', label: 'Входящие согласования', icon: MailUnreadOutline }
];

const items = computed(() => {
  if (!embed) return allItems;
  if (embed.mode === 'lists') return allItems.filter((i) => i.name !== 'home');
  if (embed.mode === 'defect-act-form') return allItems.filter((i) => i.name === 'defect-acts');
  return allItems.filter((i) => i.name === 'purchase-requests');
});

const activeName = computed(() => route.name?.toString() ?? '');

function go(item: NavItem) {
  router.push({ name: item.name });
}

const userDropdown = computed(() =>
  spfxMode
    ? []
    : [{ label: 'Выйти', key: 'logout', icon: () => h(NIcon, null, () => h(LogOutOutline)) }]
);

function onUserAction(key: string) {
  if (key === 'logout') {
    auth.logout();
    router.push({ name: 'login' });
  }
}

const userInitials = computed(() => {
  const n = auth.user?.fullName ?? '';
  return n.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?';
});
</script>

<template>
  <div class="t-app-shell">
    <aside class="t-sidebar" :class="{ 't-sidebar--collapsed': sidebarCollapsed }">
      <div class="t-sidebar__brand">
        <div class="t-sidebar__logo">{{ appBrand.logoLetter }}</div>
        <div class="t-sidebar__brand-text">
          <div class="t-sidebar__title">{{ appBrand.brandName.toUpperCase() }}</div>
          <div class="t-sidebar__subtitle">{{ appBrand.moduleSubtitle }}</div>
        </div>
      </div>

      <nav class="t-sidebar__nav">
        <template v-for="item in items" :key="item.name">
          <NTooltip v-if="sidebarCollapsed" placement="right" :delay="200">
            <template #trigger>
              <div
                class="t-sidebar__item"
                :class="{ 't-sidebar__item--active': activeName === item.name }"
                role="menuitem"
                @click="go(item)"
              >
                <NIcon :component="item.icon" size="20" class="t-sidebar__icon" />
                <span class="t-sidebar__label" :title="item.label">{{ item.label }}</span>
              </div>
            </template>
            {{ item.label }}
          </NTooltip>
          <div
            v-else
            class="t-sidebar__item"
            :class="{ 't-sidebar__item--active': activeName === item.name }"
            role="menuitem"
            @click="go(item)"
          >
            <NIcon :component="item.icon" size="20" class="t-sidebar__icon" />
            <span class="t-sidebar__label" :title="item.label">{{ item.label }}</span>
          </div>
        </template>
      </nav>

      <div class="t-sidebar__footer">
        <button
          type="button"
          class="t-sidebar__toggle"
          :aria-label="sidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'"
          @click="toggleSidebar"
        >
          <NIcon :component="sidebarCollapsed ? ChevronForwardOutline : ChevronBackOutline" size="18" />
        </button>
        <span class="t-sidebar__footer-text">© {{ appBrand.brandName }} — {{ new Date().getFullYear() }}</span>
      </div>
    </aside>

    <div class="t-app-main">
      <header class="t-topbar">
        <div style="display:flex;align-items:center;gap:10px;min-width:200px">
          <span style="color:var(--brand-orange);font-weight:800;font-size:18px;letter-spacing:0.5px">
            {{ appBrand.brandName.toUpperCase() }}
          </span>
          <span style="color:var(--brand-text-muted);font-size:11px;text-transform:uppercase">
            {{ appBrand.moduleTitle }}
          </span>
        </div>
        <div style="flex:1"></div>

        <NDropdown v-if="userDropdown.length" trigger="click" :options="userDropdown" @select="onUserAction">
          <div class="t-topbar__user">
            <NAvatar round :size="36" :style="{ background: 'var(--brand-orange)', color:'#fff', fontWeight:700 }">
              {{ userInitials }}
            </NAvatar>
            <div>
              <div class="t-topbar__user-name">{{ auth.user?.fullName ?? '—' }}</div>
              <div class="t-topbar__user-role">{{ auth.roleLabel }}</div>
            </div>
            <NIcon :component="ChevronDownOutline" size="16" style="color:var(--brand-text-muted)" />
          </div>
        </NDropdown>
        <div v-else class="t-topbar__user">
          <NAvatar round :size="36" :style="{ background: 'var(--brand-orange)', color:'#fff', fontWeight:700 }">
            {{ userInitials }}
          </NAvatar>
          <div>
            <div class="t-topbar__user-name">{{ auth.user?.fullName ?? '—' }}</div>
            <div class="t-topbar__user-role">{{ auth.roleLabel }}</div>
          </div>
        </div>
      </header>

      <main style="flex:1;overflow:auto;padding:24px;background:var(--brand-bg)">
        <NAlert v-if="authError" type="error" style="margin-bottom:16px">{{ authError }}</NAlert>
        <RouterView />
      </main>
    </div>
  </div>
</template>
