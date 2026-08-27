<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string | number | null;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  readonly?: boolean;
}>(), {
  type: 'text',
  disabled: false,
  readonly: false
});

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <input
    class="tnsu-input"
    :type="type"
    :value="modelValue ?? ''"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
</template>

<style scoped>
.tnsu-input {
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
.tnsu-input:focus {
  outline: 0;
  border-color: var(--tnsu-gold-500);
  box-shadow: 0 0 0 3px rgba(212, 160, 30, 0.12);
}
.tnsu-input:disabled,
.tnsu-input:read-only {
  background: var(--tnsu-gray-50);
  color: var(--tnsu-gray-500);
  cursor: default;
}
</style>
