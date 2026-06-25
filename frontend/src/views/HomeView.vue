<script setup lang="ts">
import { NCard, NButton, NSpace } from 'naive-ui';
import { useRouter } from 'vue-router';
import { appBrand } from '@/config/branding';

const router = useRouter();
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :title="`Направление «${appBrand.moduleTitle}»`">
      <p style="margin:0 0 16px;color:var(--brand-text-muted)">
        Заявки на закупку запасных частей, расходных материалов и услуг для парка техники.
      </p>
      <NSpace>
        <NButton type="primary" @click="router.push({ name: 'defect-act-new' })">Создать дефектный акт</NButton>
        <NButton secondary @click="router.push({ name: 'inbox' })">Мои согласования</NButton>
      </NSpace>
    </NCard>

    <div class="t-grid-2">
      <NCard title="Дефектные акты" hoverable @click="router.push({ name: 'defect-acts' })">
        <p style="margin:0;color:var(--brand-text-muted)">Фиксация неисправности техники и потребности в запчастях.</p>
      </NCard>
      <NCard title="Заявки на закупку" hoverable @click="router.push({ name: 'purchase-requests' })">
        <p style="margin:0;color:var(--brand-text-muted)">
          Маршрут: кладовщик → СБ → РП → координатор → гл. механик → ОМТС.
        </p>
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
