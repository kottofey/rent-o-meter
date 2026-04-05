<script setup lang="ts">
/**
 * @description sdfvsdfsd
 */

import { NSelect } from 'naive-ui';
import { computed } from 'vue';
import type { SelectOption } from 'naive-ui';

import { useBillsQuery } from '@/entities/bill';
import { parseDate } from '@/shared/lib';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const value = defineModel<number | null>('value');

const {
  placeholder,
  label,
  disablePaid = true,
  disabled,
  withPaid = false,
  renteeId,
  withBorder,
} = defineProps<{
  placeholder?: string;
  label?: string;
  disablePaid?: boolean;
  disabled?: boolean;
  withPaid?: boolean;
  renteeId?: number;
  withBorder?: boolean;
}>();

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const { data: bills, isFetching } = useBillsQuery({
  includes: ['Agreement.Rentee'],
});

const billsOptions = computed(() =>
  bills.value?.reduce<SelectOption[]>((acc, bill) => {
    if (bill.status && !withPaid) {
      return acc;
    }

    const date = bill.month
      ? parseDate({ date: bill.month, format: 'MMM YYYY' })
      : bill.comment +
        ` (от ${parseDate({ date: bill.bill_date, format: 'DD MMM YYYY' })})`;

    if (renteeId && bill.agreement.renteeId !== renteeId) {
      return acc;
    }

    return [
      ...acc,
      {
        value: bill.id,
        label: `${bill.id}: ${bill.agreement.rentee.shortName} / ${date}`,
        disabled: disablePaid && bill.status,
      },
    ];
  }, []),
);
</script>

<template>
  <div
    class="select-bills"
    :style="{
      '--border': withBorder ? '1px solid #49494c' : undefined,
    }"
  >
    <span
      v-if="label"
      class="select-bills__label"
    >
      {{ label }}
    </span>

    <NSelect
      class="select-bills"
      v-model:value="value"
      :loading="isFetching"
      :options="billsOptions"
      clearable
      :disabled="disabled"
      :consistent-menu-width="false"
      :placeholder="placeholder ? placeholder : 'Выберите счет'"
      filterable
    />
  </div>
</template>

<style lang="scss" scoped>
.select-bills {
  display: flex;
  flex-direction: row;
  //flex-wrap: wrap;
  //min-width: fit-content;
  //padding: 15px;
  //min-height: 50px;
  align-items: center;
  //justify-content: center;

  border: var(--border);
  border-radius: 20px;

  &__label {
    display: flex;
    margin-right: 10px;
    flex-wrap: nowrap;
    min-width: fit-content;
  }
}
</style>
