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
    <slot name="buttons-extra" />
  </ButtonPanelWidget>

  <slot name="default" />
</template>

<style scoped lang="scss">
.header {
  margin-bottom: 10px;
}
</style>
