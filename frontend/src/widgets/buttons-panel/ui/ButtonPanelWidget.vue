<script setup lang="ts"></script>

<template>
  <div class="panel">
    <slot />
  </div>
</template>

<style scoped lang="scss">
@use '@/app/styles/constants' as *;

.panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 10px;
  padding: 10px;
  border: 1px solid $color-accent;
  margin: 0 30px 10px;
  border-radius: 12px;
}
</style>
