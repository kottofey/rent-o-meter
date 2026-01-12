<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui';

import { AddIcon } from '@/shared/ui/icons';

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const { iconSize = 24 } = defineProps<{
  iconSize?: number;
}>();
</script>

<template>
  <NButton
    round
    class="btn-add"
    :style="{
      '--theme-btn-size': `${iconSize ? iconSize : 24}px`,
    }"
  >
    <template #icon>
      <NIcon :size="iconSize"><AddIcon /> </NIcon>
    </template>

    <template #default>
      <slot name="default" />
    </template>
  </NButton>
</template>

<style scoped lang="scss">
@use '@/app/styles/constants' as *;

.btn-add {
  min-height: var(--theme-btn-size);
  min-width: var(--theme-btn-size);
  padding: 20px;
  color: $color-accent;
}
</style>
