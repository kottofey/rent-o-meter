<script setup lang="ts">
import { NSelect } from 'naive-ui';
import { computed } from 'vue';

import { useAgreementsQuery } from '@/entities/agreement';
import { useAuthStore } from '@/shared/store';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const value = defineModel<number | null>('value');

const { labelBy = 'agreement', placeholder } = defineProps<{
  labelBy?: 'agreement' | 'rentee';
  placeholder?: string;
}>();

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
const authStore = useAuthStore();

const { data: agreements, isFetching } = useAgreementsQuery({
  includes: ['Rentee'],
  scopes: {
    'agreements:activeOnly': true,
    'agreements:byRentee': authStore.user?.rentee_id ?? null,
  },
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
