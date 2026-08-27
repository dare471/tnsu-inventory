<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
}>(), {
  variant: 'info'
});
</script>

<template>
  <div class="tnsu-alert" :class="`tnsu-alert--${variant}`" role="alert">
    <div v-if="title" class="tnsu-alert__title">{{ title }}</div>
    <div class="tnsu-alert__body"><slot /></div>
  </div>
</template>

<style scoped>
.tnsu-alert {
  border-radius: var(--tnsu-r-md);
  border: 1px solid var(--tnsu-gray-200);
  padding: 12px 14px;
  font-family: var(--tnsu-font-sans);
  font-size: var(--tnsu-fs-sm);
  line-height: 1.45;
}
.tnsu-alert__title {
  font-weight: 600;
  margin-bottom: 4px;
}
.tnsu-alert--info {
  background: var(--tnsu-blue-50);
  border-color: #bfdbfe;
  color: var(--tnsu-blue-600);
}
.tnsu-alert--success {
  background: var(--tnsu-green-50);
  border-color: #bbf7d0;
  color: var(--tnsu-green-600);
}
.tnsu-alert--warning {
  background: var(--tnsu-gold-50);
  border-color: var(--tnsu-gold-300);
  color: var(--tnsu-amber-700);
}
.tnsu-alert--danger {
  background: var(--tnsu-red-50);
  border-color: #fecaca;
  color: var(--tnsu-red-500);
}
</style>
