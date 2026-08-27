<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  loading: false,
  disabled: false,
  block: false
});
</script>

<template>
  <button
    class="tnsu-btn"
    :class="[
      `tnsu-btn--${variant}`,
      `tnsu-btn--${size}`,
      { 'tnsu-btn--block': block, 'tnsu-btn--loading': loading }
    ]"
    :type="type"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="tnsu-btn__spinner" aria-hidden="true" />
    <span class="tnsu-btn__label"><slot /></span>
  </button>
</template>

<style scoped>
.tnsu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--tnsu-r-sm);
  font-family: var(--tnsu-font-sans);
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: 0.18s ease;
  line-height: 1.2;
}
.tnsu-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}
.tnsu-btn--sm { padding: 6px 12px; font-size: 12px; min-height: 32px; }
.tnsu-btn--md { padding: 9px 16px; font-size: 14px; min-height: 40px; }
.tnsu-btn--lg { padding: 12px 20px; font-size: 15px; min-height: 46px; }
.tnsu-btn--block { width: 100%; }
.tnsu-btn--primary {
  background: var(--tnsu-grad-gold);
  color: #fff;
  border-color: var(--tnsu-gold-500);
}
.tnsu-btn--primary:hover:not(:disabled) {
  box-shadow: var(--tnsu-sh-gold);
  transform: translateY(-1px);
}
.tnsu-btn--primary .tnsu-btn__label {
  color: #fff;
}
.tnsu-btn--secondary {
  background: var(--tnsu-white);
  color: var(--tnsu-navy-800);
  border-color: var(--tnsu-navy-600);
}
.tnsu-btn--secondary:hover:not(:disabled) {
  background: var(--tnsu-navy-50);
}
.tnsu-btn--ghost {
  background: transparent;
  color: var(--tnsu-navy-800);
  border-color: transparent;
}
.tnsu-btn--ghost:hover:not(:disabled) {
  background: var(--tnsu-navy-50);
}
.tnsu-btn--danger {
  background: var(--tnsu-red-500);
  color: var(--tnsu-white);
  border-color: var(--tnsu-red-500);
}
.tnsu-btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: tnsu-spin 0.7s linear infinite;
}
@keyframes tnsu-spin {
  to { transform: rotate(360deg); }
}
</style>
