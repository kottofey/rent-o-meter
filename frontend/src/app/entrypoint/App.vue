<script setup lang="ts">
import {
  dateRuRU,
  ruRU,
  NConfigProvider,
  darkTheme,
  NGlobalStyle,
  NNotificationProvider,
  NDialogProvider,
} from 'naive-ui';
import { useLocalStorage } from '@vueuse/core';

const settings = useLocalStorage('rentometer-settings', { theme: 'light' });
</script>

<template>
  <NConfigProvider
    :locale="ruRU"
    :date-locale="dateRuRU"
    :theme="settings.theme === 'light' ? null : darkTheme"
  >
    <NGlobalStyle />
    <NDialogProvider>
      <NNotificationProvider>
        <RouterView />
      </NNotificationProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
