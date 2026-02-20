<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui';

import { LogoutIcon } from '@/shared/ui/icons';
import { useAuth } from '@/features/auth';

const { iconSize = 24 } = defineProps<{
  iconSize?: number;
}>();
</script>

<template>
  <NButton
    class="btn-logout"
    round
    :style="{
      '--theme-btn-size': `${iconSize ? iconSize : 24}px`,
    }"
    @click="
      async () => {
        await useAuth().logout();
      }
    "
  >
    <template #icon>
      <NIcon :size="iconSize"> <LogoutIcon /> </NIcon
    ></template>
  </NButton>
</template>

<style scoped lang="scss">
@use '@/app/styles/constants' as *;

.btn-logout {
  min-height: var(--theme-btn-size);
  min-width: var(--theme-btn-size);
  padding: 20px;
  color: $color-accent;
}
</style>
