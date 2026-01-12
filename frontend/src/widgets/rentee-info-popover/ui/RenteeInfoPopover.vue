<script setup lang="ts">
import { NCard, NPopover } from 'naive-ui';

import { parsePhone } from '@/shared/lib/parsePhone';
import { dayjs } from '@/shared/lib/dayjs';
import { type IRentee } from '@/entities/rentee/model/rentee-api';

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
const { rentee } = defineProps<{
  rentee: IRentee;
}>();
</script>

<template>
  <NPopover
    :delay="500"
    placement="bottom"
  >
    <template #trigger>
      <slot name="default" />
    </template>

    <NCard
      v-if="rentee"
      :title="`${rentee.surname} ${rentee.firstname} ${rentee.patronymic}`"
    >
      <div class="card">
        <a
          v-if="rentee.phone"
          :href="`tel:${rentee.phone}`"
          class="card__phone"
          >{{ parsePhone(rentee.phone) }}</a
        >
        <a
          v-if="rentee.email"
          class="card__email"
          :href="`mailto:${rentee.email}`"
          >{{ rentee.email }}</a
        >
        <p>Живет с {{ dayjs(rentee.date_start).format('DD MMMM YYYY') }}</p>
        <p v-if="rentee.comment">{{ rentee.comment }}</p>
      </div>
    </NCard>
  </NPopover>
</template>

<style scoped lang="scss">
@use '@/app/styles/constants' as *;

.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 16px;

  &__email,
  &__phone {
    color: $color-accent;
  }
}
</style>
