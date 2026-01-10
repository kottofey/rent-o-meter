<script setup lang="ts">
import {
  dateRuRU,
  ruRU,
  NConfigProvider,
  darkTheme,
  type GlobalTheme,
  NGlobalStyle,
  NNotificationProvider,
  NDialogProvider,
} from 'naive-ui';
import { ref } from 'vue';

const theme = ref<GlobalTheme | null>(darkTheme);
</script>

<template>
  <NConfigProvider
    :locale="ruRU"
    :date-locale="dateRuRU"
    :theme="theme"
  >
    <NGlobalStyle />
    <NDialogProvider>
      <NNotificationProvider>
        <RouterView />
      </NNotificationProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
