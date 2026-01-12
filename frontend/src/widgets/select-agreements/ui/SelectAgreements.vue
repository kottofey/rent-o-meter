<script setup lang="ts">
import { NSelect } from 'naive-ui';
import { computed } from 'vue';

import { useAgreementsQuery } from '@/entities/agreement';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const value = defineModel<number>('value');

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const { data: agreements, isFetching } = useAgreementsQuery({});

const agreementsOptions = computed(() =>
  agreements.value?.map((agreement) => ({
    value: agreement.id,
    label: agreement.name,
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
    placeholder="Выберите договор"
    filterable
  />
</template>
