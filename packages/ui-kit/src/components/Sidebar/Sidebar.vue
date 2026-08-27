<script setup lang="ts">
import type { SidebarItem } from '../../types';

withDefaults(defineProps<{
  items: SidebarItem[];
  activeId?: string;
  collapsed?: boolean;
  brandName?: string;
  productName?: string;
  mobileOpen?: boolean;
}>(), {
  collapsed: false,
  mobileOpen: false,
  brandName: 'ТАНСУ',
  productName: ''
});

const emit = defineEmits<{
  select: [id: string];
  'update:collapsed': [value: boolean];
  'update:mobileOpen': [value: boolean];
}>();
</script>

<template>
  <aside
    class="tnsu-sidebar"
    :class="{
      'tnsu-sidebar--collapsed': collapsed,
      'tnsu-sidebar--mobile-open': mobileOpen
    }"
  >
    <div class="tnsu-sidebar__brand">
      <div class="tnsu-sidebar__logo">Т</div>
      <div v-if="!collapsed" class="tnsu-sidebar__titles">
        <div class="tnsu-sidebar__brand-name">{{ brandName }}</div>
        <div v-if="productName" class="tnsu-sidebar__product">{{ productName }}</div>
      </div>
    </div>

    <nav class="tnsu-sidebar__nav">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        class="tnsu-sidebar__item"
        :class="{ 'tnsu-sidebar__item--active': item.id === activeId }"
        :title="collapsed ? item.label : undefined"
        @click="emit('select', item.id)"
      >
        <span v-if="item.icon" class="tnsu-sidebar__icon">
          <component :is="item.icon" />
        </span>
        <span v-if="!collapsed" class="tnsu-sidebar__label">{{ item.label }}</span>
      </button>
    </nav>

    <div class="tnsu-sidebar__footer">
      <slot name="footer" />
      <button
        type="button"
        class="tnsu-sidebar__collapse"
        :title="collapsed ? 'Развернуть' : 'Свернуть'"
        @click="emit('update:collapsed', !collapsed)"
      >
        {{ collapsed ? '›' : '‹' }}
      </button>
    </div>
  </aside>

  <div
    v-if="mobileOpen"
    class="tnsu-sidebar__backdrop"
    @click="emit('update:mobileOpen', false)"
  />
</template>

<style scoped>
.tnsu-sidebar {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--tnsu-navy-900);
  color: #e8eaef;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 30;
  transition: width 0.18s ease;
}
.tnsu-sidebar--collapsed { width: 72px; }
.tnsu-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 72px;
}
.tnsu-sidebar--collapsed .tnsu-sidebar__brand {
  justify-content: center;
  padding: 20px 12px;
}
.tnsu-sidebar__logo {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: var(--tnsu-grad-gold);
  color: var(--tnsu-navy-950);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
}
.tnsu-sidebar__brand-name {
  font-family: var(--tnsu-font-serif);
  font-weight: 700;
  font-size: 15px;
  color: #fff;
}
.tnsu-sidebar__product {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 2px;
}
.tnsu-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 10px;
  flex: 1;
  overflow-y: auto;
}
.tnsu-sidebar__item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  border: none;
  border-radius: var(--tnsu-r-sm);
  background: transparent;
  color: rgba(255, 255, 255, 0.78);
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  font-family: var(--tnsu-font-sans);
}
.tnsu-sidebar--collapsed .tnsu-sidebar__item {
  justify-content: center;
  padding: 0;
}
.tnsu-sidebar__item:hover {
  background: var(--tnsu-navy-700);
  color: #fff;
}
.tnsu-sidebar__item--active {
  background: rgba(212, 160, 30, 0.18);
  color: #fff;
  font-weight: 600;
}
.tnsu-sidebar__item--active .tnsu-sidebar__icon {
  color: var(--tnsu-gold-400);
}
.tnsu-sidebar__icon {
  display: inline-flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.tnsu-sidebar__icon :deep(svg) {
  width: 20px;
  height: 20px;
}
.tnsu-sidebar__footer {
  padding: 12px 10px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tnsu-sidebar__collapse {
  width: 36px;
  height: 36px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--tnsu-r-sm);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}
.tnsu-sidebar__backdrop {
  display: none;
}
@media (max-width: 768px) {
  .tnsu-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(-105%);
    box-shadow: var(--tnsu-sh-3);
  }
  .tnsu-sidebar--mobile-open {
    transform: translateX(0);
  }
  .tnsu-sidebar__backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(10, 27, 48, 0.45);
    z-index: 25;
  }
}
</style>
