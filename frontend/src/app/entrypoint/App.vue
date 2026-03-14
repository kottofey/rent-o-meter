<script setup lang="ts">
import {
  dateRuRU,
  ruRU,
  NConfigProvider,
  darkTheme,
  NGlobalStyle,
  NNotificationProvider,
} from 'naive-ui';

import { useSettings } from '@/app/lib';

const { settings } = useSettings();
</script>

<template>
  <NConfigProvider
    :locale="ruRU"
    :date-locale="dateRuRU"
    :theme="settings.theme === 'light' ? null : darkTheme"
  >
    <NGlobalStyle />
    <NNotificationProvider>
      <RouterView />
    </NNotificationProvider>
  </NConfigProvider>
</template>
