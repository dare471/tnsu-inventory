<script setup lang="ts">
withDefaults(defineProps<{ columns?: 1 | 2 }>(), { columns: 2 });
</script>

<template>
  <div class="tnsu-form-grid" :class="`tnsu-form-grid--cols-${columns}`">
    <slot />
  </div>
</template>

<style scoped>
.tnsu-form-grid {
  display: grid;
  gap: 12px 20px;
  font-family: var(--tnsu-font-sans);
}
.tnsu-form-grid--cols-1 { grid-template-columns: 1fr; }
.tnsu-form-grid--cols-2 { grid-template-columns: 1fr 1fr; }
@media (max-width: 640px) {
  .tnsu-form-grid--cols-2 { grid-template-columns: 1fr; }
}
</style>
