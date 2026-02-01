<script setup lang="ts">
import { NSelect } from 'naive-ui';
import { computed, watch } from 'vue';

import { useRenteesQuery } from '@/entities/rentee';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const value = defineModel<number>('value');
const agreementIds = defineModel<number[]>('agreementIds');

const { withActiveAgreements = false, placeholder = 'Выберите арендатора' } =
  defineProps<{
    withActiveAgreements?: boolean;
    placeholder?: string;
  }>();

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const { data: rentees, isLoading } = useRenteesQuery({
  includes: ['Agreement'],
  scopes: {
    'rentee:withActiveAgreement': withActiveAgreements ? true : undefined,
  },
});

// -----------------------------------------------------------------------------
// Computed
// -----------------------------------------------------------------------------
const renteesOptions = computed(() =>
  rentees.value?.map((rentee) => ({
    value: rentee.id,
    label: rentee.fullName,
    disabled: !rentee.status,
  })),
);

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------

watch(value, () => {
  agreementIds.value =
    rentees.value
      ?.find((rentee) => rentee.id === value.value)
      ?.agreements.map((agr) => agr.id) ?? undefined;
});
</script>

<template>
  <NSelect
    v-model:value="value"
    :loading="isLoading"
    :options="renteesOptions"
    clearable
    :placeholder="placeholder"
    filterable
    :consistent-menu-width="false"
  />
</template>

<style scoped></style>
