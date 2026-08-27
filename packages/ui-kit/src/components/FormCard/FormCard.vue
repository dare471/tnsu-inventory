<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <section class="tnsu-form-card">
    <h2 v-if="title" class="tnsu-form-card__title">{{ title }}</h2>
    <div class="tnsu-form-card__body"><slot /></div>
  </section>
</template>

<style scoped>
.tnsu-form-card {
  background: var(--tnsu-white);
  border: 1px solid var(--tnsu-gray-200);
  border-radius: var(--tnsu-r-lg);
  box-shadow: var(--tnsu-sh-1);
  padding: 24px 28px;
  font-family: var(--tnsu-font-sans);
}
.tnsu-form-card__title {
  margin: 0 0 16px;
  font-family: var(--tnsu-font-serif);
  font-size: var(--tnsu-fs-form-title);
  font-weight: 600;
  color: var(--tnsu-navy-900);
}
@media (max-width: 640px) {
  .tnsu-form-card { padding: 18px; }
}
</style>
