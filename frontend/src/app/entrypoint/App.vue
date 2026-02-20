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
import { onBeforeMount } from 'vue';

import { useSettings } from '@/app/lib';
import { useAuth } from '@/features/auth';

const { settings } = useSettings();

onBeforeMount(() => {
  useAuth().initializeAuthState();
});
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
