<script setup lang="ts">
import { HeaderWidget } from '@/widgets/header';
import { ButtonPanelWidget } from '@/widgets/buttons-panel';
</script>

<template>
  <HeaderWidget class="header">
    <template #buttons>
      <slot name="header-buttons" />
    </template>
  </HeaderWidget>

  <ButtonPanelWidget v-if="$slots['buttons-extra']">
    <div class="button-panel">
      <slot name="buttons-extra" />
    </div>
  </ButtonPanelWidget>

  <div class="default">
    <slot name="default" />
  </div>
</template>

<style scoped lang="scss">
.header {
  margin-bottom: 10px;
}

.button-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.default {
  padding: 0 15px;
}
</style>
