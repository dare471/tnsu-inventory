<script setup lang="ts">
import { computed, h, onMounted, ref, watch, type Component } from 'vue';
import { useRouter, useRoute, RouterView } from 'vue-router';
import { NIcon, NAvatar, NDropdown, NTooltip, NAlert, NButton, NSpace } from 'naive-ui';
import {
  HomeOutline, DocumentTextOutline, CartOutline, MailUnreadOutline,
  LogOutOutline, ChevronDownOutline, ChevronBackOutline, ChevronForwardOutline, SettingsOutline
} from '@vicons/ionicons5';
import { useAuthStore } from '@/stores/auth';
import { appBrand } from '@/config/branding';
import { getEmbedOptions, isEmbedMode } from '@/embed/options';
import { toApiError } from '@/api/client';
import { ADMIN_ROLES } from '@/config/roles';
import { inventoryApi } from '@/api/inventory';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const embed = getEmbedOptions();
const spfxMode = isEmbedMode();
const authError = ref('');
const inboxCount = ref(0);

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

  try {
    const inbox = await inventoryApi.getInbox();
    inboxCount.value = inbox.length;
  } catch {
    inboxCount.value = 0;
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
  { name: 'inbox', label: 'Входящие согласования', icon: MailUnreadOutline },
  { name: 'admin-users', label: 'Администрирование', icon: SettingsOutline }
];

const items = computed(() => {
  const adminAllowed = ADMIN_ROLES.has(auth.user?.role ?? '');
  const baseItems = adminAllowed
    ? allItems
    : allItems.filter((i) => i.name !== 'admin-users');

  if (!embed) return baseItems;
  if (embed.mode === 'lists') return baseItems.filter((i) => i.name !== 'home');
  if (embed.mode === 'defect-act-form') {
    const allowed = new Set(['defect-acts', ...(adminAllowed ? ['admin-users'] : [])]);
    return baseItems.filter((i) => allowed.has(i.name));
  }
  const allowed = new Set([
    'purchase-requests',
    'purchase-request-new',
    ...(adminAllowed ? ['admin-users'] : [])
  ]);
  return baseItems.filter((i) => allowed.has(i.name));
});

const showEmbedNav = computed(() => spfxMode && items.value.length > 1);

const activeName = computed(() => route.name?.toString() ?? '');
const renderedLabel = (item: NavItem) =>
  item.name === 'inbox' && inboxCount.value > 0
    ? `${item.label} (${inboxCount.value})`
    : item.label;

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
  <div class="t-app-shell" :class="{ 't-app-shell--embed': spfxMode }">
    <aside v-if="!spfxMode" class="t-sidebar" :class="{ 't-sidebar--collapsed': sidebarCollapsed }">
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
                <span class="t-sidebar__label" :title="renderedLabel(item)">{{ renderedLabel(item) }}</span>
              </div>
            </template>
            {{ renderedLabel(item) }}
          </NTooltip>
          <div
            v-else
            class="t-sidebar__item"
            :class="{ 't-sidebar__item--active': activeName === item.name }"
            role="menuitem"
            @click="go(item)"
          >
            <NIcon :component="item.icon" size="20" class="t-sidebar__icon" />
            <span class="t-sidebar__label" :title="renderedLabel(item)">{{ renderedLabel(item) }}</span>
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
      <header v-if="!spfxMode" class="t-topbar">
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

      <main class="t-app-content">
        <NAlert v-if="authError" type="error" style="margin-bottom:16px">{{ authError }}</NAlert>

        <NSpace
          v-if="showEmbedNav"
          :size="8"
          style="margin-bottom:16px"
          wrap
        >
          <NButton
            v-for="item in items"
            :key="item.name"
            :type="activeName === item.name ? 'primary' : 'default'"
            :secondary="activeName !== item.name"
            @click="go(item)"
          >
            <template #icon>
              <NIcon :component="item.icon" />
            </template>
            {{ renderedLabel(item) }}
          </NButton>
        </NSpace>

        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.t-app-content {
  flex: 1;
  overflow: auto;
  padding: 16px 20px 24px;
  background: var(--brand-bg);
}

.t-app-shell--embed {
  height: auto;
  min-height: 0;
}

.t-app-shell--embed .t-app-main {
  min-height: 0;
}
</style>
