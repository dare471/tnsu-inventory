<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: boolean;
  disabled?: boolean;
  label?: string;
}>(), {
  modelValue: false,
  disabled: false
});

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<template>
  <label class="tnsu-toggle" :class="{ 'tnsu-toggle--disabled': disabled }">
    <button
      type="button"
      class="tnsu-toggle__track"
      :class="{ 'tnsu-toggle__track--on': modelValue }"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span class="tnsu-toggle__thumb" />
    </button>
    <span v-if="label || $slots.default" class="tnsu-toggle__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.tnsu-toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: var(--tnsu-font-sans);
  font-size: var(--tnsu-fs-body);
  color: var(--tnsu-gray-900);
}
.tnsu-toggle--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.tnsu-toggle__track {
  width: 42px;
  height: 24px;
  border-radius: 999px;
  border: none;
  padding: 2px;
  background: var(--tnsu-gray-300);
  cursor: inherit;
  transition: background 0.18s ease;
}
.tnsu-toggle__track--on {
  background: var(--tnsu-gold-500);
}
.tnsu-toggle__thumb {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--tnsu-white);
  box-shadow: var(--tnsu-sh-1);
  transition: transform 0.18s ease;
}
.tnsu-toggle__track--on .tnsu-toggle__thumb {
  transform: translateX(18px);
}
</style>
