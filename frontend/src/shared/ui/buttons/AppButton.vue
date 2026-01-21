<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui';

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const { iconSize = 24, isOutlined = false } = defineProps<{
  iconSize?: number;
  isOutlined?: boolean;
}>();
</script>

<template>
  <NButton
    round
    :focusable="false"
    class="btn-app"
    :style="{
      '--theme-btn-size': `${iconSize}px`,
      '--border-outlined': !isOutlined ? 'transparent' : undefined,
    }"
  >
    <template #icon>
      <NIcon :size="iconSize"><slot name="icon" /> </NIcon>
    </template>

    <template #default>
      <slot name="default" />
    </template>
  </NButton>
</template>

<style scoped lang="scss">
@use '@/app/styles/constants' as *;

.btn-app {
  min-height: var(--theme-btn-size);
  min-width: var(--theme-btn-size);
  padding: 20px;
  color: $color-accent;
  border-top: 3px transparent solid;
  border-bottom: 3px solid var(--border-outlined, $color-accent);
}
</style>
