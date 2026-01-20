<script setup lang="ts">
import { NSelect } from 'naive-ui';
import { computed } from 'vue';

import { useAgreementsQuery } from '@/entities/agreement';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const value = defineModel<number>('value');

const { labelBy = 'agreement', placeholder } = defineProps<{
  labelBy?: 'agreement' | 'rentee';
  placeholder?: string;
}>();

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const { data: agreements, isFetching } = useAgreementsQuery({
  includes: ['Rentee'],
  scopes: ['agreements:activeOnly'],
});

const agreementsOptions = computed(() =>
  agreements.value?.map((agreement) => ({
    value: agreement.id,
    label: labelBy === 'agreement' ? agreement.name : agreement.rentee.fullName,
    disabled: !agreement.status,
  })),
);
</script>

<template>
  <NSelect
    v-model:value="value"
    :loading="isFetching"
    :options="agreementsOptions"
    clearable
    :placeholder="placeholder ? placeholder : 'Выберите договор'"
    filterable
  />
</template>
