<script setup lang="ts">
import { NSelect } from 'naive-ui';
import { computed } from 'vue';

import { useTarifsQuery } from '@/entities/tarif';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const value = defineModel<number>('value');

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const { data: tarifs, isFetching } = useTarifsQuery({});

const tarifOptions = computed(() =>
  tarifs.value?.map((tarif) => ({
    value: tarif.id,
    label: tarif.comment ?? `id: ${tarif.id.toString()}`,
  })),
);
</script>

<template>
  <NSelect
    v-model:value="value"
    :loading="isFetching"
    :options="tarifOptions"
    clearable
    placeholder="Выберите тариф"
    filterable
  />
</template>
