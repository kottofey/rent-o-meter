<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import { NAvatar, NAvatarGroup, NIcon } from 'naive-ui';

import { ChangeThemeButton, LogoutButton } from '@/shared/ui';
import {
  PersonIcon as RenteeIcon,
  EyeIcon as ViewerIcon,
  ShieldIcon as AdminIcon,
} from '@/shared/ui/icons';
import { useAuthStore } from '@/shared/store';

export interface ISettings {
  theme?: 'dark' | 'light';
}

const settings = useLocalStorage<ISettings>('settings', {
  theme: 'light',
});

const { user, full_name } = useAuthStore();
</script>

<template>
  <header class="page-wrapper">
    <div
      v-if="user"
      class="header-buttons"
      :style="{
        '--buttons-shadow-color': settings.theme === 'light' ? '#000' : '#fff',
      }"
    >
      <div class="box">
        <NAvatar
          v-for="role in user.roles"
          :key="role"
          round
        >
          <NIcon v-if="role === 'admin'"><AdminIcon /></NIcon>
          <NIcon v-if="role === 'viewer'"> <ViewerIcon /></NIcon>
          <NIcon v-if="role === 'rentee'"><RenteeIcon /></NIcon>
        </NAvatar>
      </div>
      <p class="box">{{ full_name }}</p>
    </div>

    <div class="box box--wrap">
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
    </div>

    <div
      class="header-buttons"
      :style="{
        '--buttons-shadow-color': settings.theme === 'light' ? '#000' : '#fff',
      }"
    >
      <slot name="buttons" />
      <ChangeThemeButton />
      <LogoutButton />
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
  padding: 10px;
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
  justify-content: center;
  flex-wrap: wrap;
  column-gap: 10px;
  row-gap: 10px;
  border: 1px solid $color-accent;
  border-radius: 24px;
  padding: 10px;
  box-shadow: 0 2px 24px -12px var(--buttons-shadow-color);
}

.box {
  display: flex;
  flex-wrap: nowrap;
  column-gap: 10px;
  align-items: center;
  justify-content: center;
  text-align: center;

  &--wrap {
    flex-wrap: wrap;
    row-gap: 20px;
  }
}
</style>
