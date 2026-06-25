<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NDialogProvider, NLoadingBarProvider, NNotificationProvider, ruRU, dateRuRU } from 'naive-ui';
import { RouterView } from 'vue-router';
import { themeOverrides } from '@/styles/theme';
</script>

<template>
  <NConfigProvider :locale="ruRU" :date-locale="dateRuRU" :theme-overrides="themeOverrides">
    <NLoadingBarProvider>
      <NDialogProvider>
        <NMessageProvider>
          <NNotificationProvider placement="top-right">
            <RouterView />
          </NNotificationProvider>
        </NMessageProvider>
      </NDialogProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>
