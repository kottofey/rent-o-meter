<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

import { ChangeThemeButton } from '@/shared/ui';

export interface ISettings {
  theme?: 'dark' | 'light';
}

const settings = useLocalStorage<ISettings>('settings', {
  theme: 'light',
});
</script>

<template>
  <header class="page-wrapper">
    <RouterLink
      :to="{ name: 'home.show' }"
      class="link"
    >
      Главная
    </RouterLink>

    <RouterLink
      :to="{ name: 'rentees.show' }"
      class="link"
    >
      Арендаторы
    </RouterLink>

    <RouterLink
      :to="{ name: 'agreements.show' }"
      class="link"
    >
      Договоры
    </RouterLink>

    <RouterLink
      :to="{ name: 'counters.show' }"
      class="link"
    >
      Счетчики
    </RouterLink>

    <RouterLink
      :to="{ name: 'bills.show' }"
      class="link"
    >
      Счета
    </RouterLink>

    <RouterLink
      :to="{ name: 'tarifs.show' }"
      class="link"
    >
      Тарифы
    </RouterLink>
    <div
      class="header-buttons"
      :style="{
        '--buttons-shadow-color': settings.theme === 'light' ? '#000' : '#fff',
      }"
    >
      <slot name="buttons" />
      <ChangeThemeButton />
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/app/styles/constants' as *;

.page-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  column-gap: 24px;
  border-bottom: 1px solid $color-accent;
  padding: 10px 0;
}

.link {
  font-size: 24px;
  line-height: 24px;
  color: $color-accent;
  display: flex;
  align-items: center;
  justify-content: center;

  &--active {
    text-decoration: underline;
  }
}

.header-buttons {
  display: flex;
  align-items: center;
  column-gap: 10px;
  border: 1px solid $color-accent;
  border-radius: 24px;
  padding: 10px;
  box-shadow: 0 2px 24px -12px var(--buttons-shadow-color);
}
</style>
