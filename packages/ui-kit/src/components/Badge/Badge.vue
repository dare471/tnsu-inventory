<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'neutral' | 'muted' | 'info' | 'success' | 'warning' | 'danger' | 'primary';
  size?: 'sm' | 'md';
}>(), {
  variant: 'neutral',
  size: 'md'
});
</script>

<template>
  <span class="tnsu-badge" :class="[`tnsu-badge--${variant}`, `tnsu-badge--${size}`]">
    <slot />
  </span>
</template>

<style scoped>
.tnsu-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-family: var(--tnsu-font-sans);
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}
.tnsu-badge--sm { padding: 3px 8px; font-size: 11px; }
.tnsu-badge--md { padding: 4px 10px; font-size: 12px; }
.tnsu-badge--neutral { background: var(--tnsu-navy-100); color: var(--tnsu-navy-800); }
.tnsu-badge--muted { background: var(--tnsu-gray-100); color: var(--tnsu-gray-500); }
.tnsu-badge--info { background: var(--tnsu-blue-50); color: var(--tnsu-blue-600); }
.tnsu-badge--success { background: var(--tnsu-green-50); color: var(--tnsu-green-600); }
.tnsu-badge--warning { background: var(--tnsu-gold-100); color: var(--tnsu-amber-700); }
.tnsu-badge--danger { background: var(--tnsu-red-50); color: var(--tnsu-red-500); }
.tnsu-badge--primary { background: var(--tnsu-grad-gold); color: var(--tnsu-navy-950); }
</style>
