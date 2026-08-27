<script setup lang="ts">
defineProps<{ open?: boolean }>();
const emit = defineEmits<{ 'update:open': [value: boolean]; click: [] }>();
</script>

<template>
  <button
    type="button"
    class="tnsu-sidebar-toggle"
    aria-label="Меню"
    @click="emit('click'); emit('update:open', !open)"
  >
    <span /><span /><span />
  </button>
</template>

<style scoped>
.tnsu-sidebar-toggle {
  display: none;
  width: 40px;
  height: 40px;
  border: 1px solid var(--tnsu-gray-200);
  border-radius: var(--tnsu-r-sm);
  background: var(--tnsu-white);
  padding: 10px 9px;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}
.tnsu-sidebar-toggle span {
  display: block;
  height: 2px;
  background: var(--tnsu-navy-800);
  border-radius: 2px;
}
@media (max-width: 768px) {
  .tnsu-sidebar-toggle { display: inline-flex; }
}
</style>
