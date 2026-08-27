<script setup lang="ts">
import type { SelectOption } from '../../types';

withDefaults(defineProps<{
  modelValue?: string | number | null;
  options?: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}>(), {
  options: () => [],
  disabled: false
});

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <select
    class="tnsu-select"
    :value="modelValue ?? ''"
    :disabled="disabled"
    @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
    <option
      v-for="opt in options"
      :key="String(opt.value)"
      :value="opt.value"
    >
      {{ opt.label }}
    </option>
  </select>
</template>

<style scoped>
.tnsu-select {
  width: 100%;
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid var(--tnsu-gray-300);
  border-radius: var(--tnsu-r-sm);
  font-family: var(--tnsu-font-sans);
  font-size: var(--tnsu-fs-body);
  color: var(--tnsu-gray-900);
  background: var(--tnsu-white);
}
.tnsu-select:focus {
  outline: 0;
  border-color: var(--tnsu-gold-500);
  box-shadow: 0 0 0 3px rgba(212, 160, 30, 0.12);
}
.tnsu-select:disabled {
  background: var(--tnsu-gray-50);
  color: var(--tnsu-gray-500);
}
</style>
