<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string | null;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  readonly?: boolean;
}>(), {
  rows: 3,
  disabled: false,
  readonly: false
});

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <textarea
    class="tnsu-textarea"
    :value="modelValue ?? ''"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    :readonly="readonly"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>

<style scoped>
.tnsu-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--tnsu-gray-300);
  border-radius: var(--tnsu-r-sm);
  font-family: var(--tnsu-font-sans);
  font-size: var(--tnsu-fs-body);
  color: var(--tnsu-gray-900);
  background: var(--tnsu-white);
  resize: vertical;
}
.tnsu-textarea:focus {
  outline: 0;
  border-color: var(--tnsu-gold-500);
  box-shadow: 0 0 0 3px rgba(212, 160, 30, 0.12);
}
.tnsu-textarea:disabled,
.tnsu-textarea:read-only {
  background: var(--tnsu-gray-50);
  color: var(--tnsu-gray-500);
}
</style>
