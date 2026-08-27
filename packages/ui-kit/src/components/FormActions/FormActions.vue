<template>
  <div class="tnsu-form-actions">
    <slot />
  </div>
</template>

<style scoped>
.tnsu-form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  font-family: var(--tnsu-font-sans);
}
@media (max-width: 640px) {
  .tnsu-form-actions {
    flex-direction: column;
  }
  .tnsu-form-actions :deep(.tnsu-btn) {
    width: 100%;
  }
}
</style>
