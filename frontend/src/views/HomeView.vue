<script setup lang="ts">
import { NCard, NButton, NSpace } from 'naive-ui';
import { useRouter } from 'vue-router';
import { appBrand } from '@/config/branding';

const router = useRouter();
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :title="`Направление «${appBrand.moduleTitle}»`">
      <NSpace>
        <NButton type="primary" @click="router.push({ name: 'defect-act-new' })">Создать дефектный акт</NButton>
        <NButton type="primary" secondary @click="router.push({ name: 'purchase-request-new' })">Создать заявку</NButton>
        <NButton secondary @click="router.push({ name: 'inbox' })">Мои согласования</NButton>
      </NSpace>
    </NCard>

    <div class="t-grid-2">
      <NCard title="Дефектные акты" hoverable @click="router.push({ name: 'defect-acts' })">
      </NCard>
      <NCard title="Заявки на закупку" hoverable @click="router.push({ name: 'purchase-requests' })">
      </NCard>
    </div>
  </NSpace>
</template>

<style scoped>
.t-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 900px) {
  .t-grid-2 { grid-template-columns: 1fr; }
}
</style>
