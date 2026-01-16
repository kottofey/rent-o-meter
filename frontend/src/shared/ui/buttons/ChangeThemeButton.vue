<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui';
import { useLocalStorage } from '@vueuse/core';

import { SunIcon, MoonIcon } from '@/shared/ui/icons';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export interface ISettings {
  theme?: 'dark' | 'light';
}

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
const settings = useLocalStorage<ISettings>('rentometer-settings', {
  theme: 'light',
});

const { iconSize = 24 } = defineProps<{
  iconSize?: number;
}>();
// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------
const changeTheme = () => {
  if (settings.value.theme === 'light') {
    settings.value.theme = 'dark';
  } else if (settings.value.theme === 'dark') {
    settings.value.theme = 'light';
  }
};
</script>

<template>
  <NButton
    class="btn-theme"
    round
    :style="{
      '--theme-btn-size': `${iconSize ? iconSize : 24}px`,
    }"
    @click="changeTheme"
  >
    <template #icon>
      <NIcon :size="iconSize">
        <SunIcon v-if="settings.theme === 'light'" />
        <MoonIcon v-else /> </NIcon
    ></template>
  </NButton>
</template>

<style scoped lang="scss">
@use '@/app/styles/constants' as *;

.btn-theme {
  min-height: var(--theme-btn-size);
  min-width: var(--theme-btn-size);
  padding: 20px;
  color: $color-accent;
}
</style>
