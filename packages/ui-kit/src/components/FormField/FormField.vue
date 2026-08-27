<script setup lang="ts">
defineProps<{
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
}>();
</script>

<template>
  <div class="tnsu-form-field" :class="{ 'tnsu-form-field--error': !!error }">
    <label v-if="label" class="tnsu-form-field__label">
      {{ label }}
      <span v-if="required" class="tnsu-form-field__req">*</span>
    </label>
    <div class="tnsu-form-field__control"><slot /></div>
    <div v-if="error" class="tnsu-form-field__error">{{ error }}</div>
    <div v-else-if="hint" class="tnsu-form-field__hint">{{ hint }}</div>
  </div>
</template>

<style scoped>
.tnsu-form-field__label {
  display: block;
  margin-bottom: 6px;
  font-family: var(--tnsu-font-sans);
  font-size: var(--tnsu-fs-label);
  font-weight: 500;
  color: var(--tnsu-gray-700);
}
.tnsu-form-field__req { color: var(--tnsu-red-500); margin-left: 2px; }
.tnsu-form-field__hint {
  margin-top: 4px;
  font-size: var(--tnsu-fs-caption);
  color: var(--tnsu-gray-500);
}
.tnsu-form-field__error {
  margin-top: 4px;
  font-size: var(--tnsu-fs-caption);
  color: var(--tnsu-red-500);
}
</style>
