<script setup lang="ts">
import { computed, h, markRaw, onMounted, ref, watch, type Component } from 'vue';
import { useRouter, useRoute, RouterView } from 'vue-router';
import { NIcon, NAvatar, NDropdown } from 'naive-ui';
import { Alert, Button, Sidebar, type SidebarItem } from '@tnsu/ui-kit-vue';
import {
  HomeOutline, DocumentTextOutline, CartOutline, MailUnreadOutline,
  LogOutOutline, ChevronDownOutline, SettingsOutline, CubeOutline, SwapHorizontalOutline
} from '@vicons/ionicons5';
import { useAuthStore } from '@/stores/auth';
import { appBrand } from '@/config/branding';
import { getEmbedOptions, isEmbedMode } from '@/embed/options';
import { toApiError } from '@/api/client';
import { ADMIN_ROLES, STOCK_ROLES } from '@/config/roles';
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

type NavItem = {
  name: string;
  label: string;
  icon: Component;
};

const allItems: NavItem[] = [
  { name: 'home', label: 'Главная', icon: HomeOutline },
  { name: 'defect-acts', label: 'Дефектные акты', icon: DocumentTextOutline },
  { name: 'purchase-requests', label: 'Заявки на закупку', icon: CartOutline },
  { name: 'stock-balances', label: 'Складские остатки', icon: CubeOutline },
  { name: 'material-transfers', label: 'Перемещение ТМЦ', icon: SwapHorizontalOutline },
  { name: 'inbox', label: 'Входящие согласования', icon: MailUnreadOutline },
  { name: 'admin-users', label: 'Администрирование', icon: SettingsOutline }
];

const items = computed(() => {
  const adminAllowed = ADMIN_ROLES.has(auth.user?.role ?? '');
  const stockAllowed = STOCK_ROLES.has(auth.user?.role ?? '');
  const baseItems = allItems.filter((i) => {
    if (i.name === 'admin-users') return adminAllowed;
    if (i.name === 'stock-balances' || i.name === 'material-transfers') return stockAllowed;
    return true;
  });

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

const showSidebar = computed(() => !spfxMode || embed?.mode === 'lists');
const showEmbedNav = computed(() => spfxMode && !showSidebar.value && items.value.length > 1);

const activeName = computed(() => route.name?.toString() ?? '');
const renderedLabel = (item: NavItem) =>
  item.name === 'inbox' && inboxCount.value > 0
    ? `${item.label} (${inboxCount.value})`
    : item.label;

const sidebarItems = computed<SidebarItem[]>(() =>
  items.value.map((item) => ({
    id: item.name,
    label: renderedLabel(item),
    icon: markRaw(item.icon)
  }))
);

function go(item: NavItem) {
  router.push({ name: item.name });
}

function onSidebarSelect(id: string) {
  router.push({ name: id });
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
  <div
    class="t-app-shell"
    :class="{ 't-app-shell--embed': spfxMode, 't-app-shell--spfx-full': showSidebar }"
  >
    <Sidebar
      v-if="showSidebar"
      :items="sidebarItems"
      :active-id="activeName"
      :collapsed="sidebarCollapsed"
      :brand-name="appBrand.brandName"
      :product-name="appBrand.moduleTitle"
      @select="onSidebarSelect"
      @update:collapsed="sidebarCollapsed = $event"
    >
      <template #footer>
        <div v-if="!sidebarCollapsed" class="t-shell-copy">
          © {{ appBrand.brandName }} — {{ new Date().getFullYear() }}
        </div>
      </template>
    </Sidebar>

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
        <div class="t-page-scroll">
          <Alert v-if="authError" variant="danger" style="margin-bottom:16px">{{ authError }}</Alert>

          <div v-if="showEmbedNav" class="t-embed-nav">
            <Button
              v-for="item in items"
              :key="item.name"
              :variant="activeName === item.name ? 'primary' : 'secondary'"
              size="sm"
              @click="go(item)"
            >
              {{ renderedLabel(item) }}
            </Button>
          </div>

          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.t-shell-copy {
  text-align: center;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
}
.t-embed-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
