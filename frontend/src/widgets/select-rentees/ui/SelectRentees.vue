<script setup lang="ts">
import { NSelect } from 'naive-ui';
import { computed } from 'vue';

import { useRenteesQuery } from '@/entities/rentee';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const value = defineModel<number>('value');

const { withActiveAgreements = false } = defineProps<{
  withActiveAgreements?: boolean;
}>();

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const { data: rentees, isLoading } = useRenteesQuery({
  scopes: withActiveAgreements ? ['withActiveAgreementsOnly'] : undefined,
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
</script>

<template>
  <NSelect
    v-model:value="value"
    :loading="isLoading"
    :options="renteesOptions"
    clearable
    placeholder="Выберите арендатора"
    filterable
  />
</template>

<style scoped></style>
