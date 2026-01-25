<script setup lang="ts">
import { NSelect } from 'naive-ui';

import { ITarif } from '@/entities/tarif';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const value = defineModel<ITarif['tarif_type'] | null>('value');

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
const { label, withBorder = false } = defineProps<{
  label?: string;
  placeholder?: string;
  withBorder?: boolean;
}>();

const tarifOptions = [
  {
    value: 'electricity',
    label: 'Свет (до 150кВт)',
  },
  {
    value: 'electricity_over_150kw',
    label: 'Свет (сверх 150кВт)',
  },
  {
    value: 'water_in',
    label: 'Подведение воды',
  },
  {
    value: 'water_out',
    label: 'Отведение воды',
  },
  {
    value: 'heat',
    label: 'Тепло',
  },
  {
    value: 'gas',
    label: 'Газ',
  },
  {
    value: 'renovation',
    label: 'Капремонт',
  },
  {
    value: 'tko',
    label: 'ТКО',
  },
  {
    value: 'managing_company',
    label: 'УК (квартплата)',
  },
  {
    value: 'domofon',
    label: 'Домофон',
  },
];
</script>

<template>
  <div
    class="tarif-select"
    :style="{
      '--border': withBorder ? '1px solid #49494c' : undefined,
    }"
  >
    <span
      v-if="label"
      class="tarif-select__label"
      >{{ label }}</span
    >
    <NSelect
      style="flex: 1"
      v-model:value="value"
      :options="tarifOptions"
      clearable
      :placeholder="placeholder ? placeholder : 'Выберите тариф'"
      filterable
    />
  </div>
</template>

<style lang="scss">
@use '@/app/styles/constants' as *;

.tarif-select {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  //width: fit-content;
  padding: 15px;
  min-height: 50px;
  align-items: center;
  //justify-content: center;

  border: var(--border);
  border-radius: 20px;

  &__label {
    display: flex;
    margin-right: 10px;
    flex-wrap: nowrap;
  }
}
</style>
