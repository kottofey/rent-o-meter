<script setup lang="ts">
import { NDataTable } from 'naive-ui';
import { computed, ref } from 'vue';

import { columns } from '../config/tableColumns';

import { AddButton } from '@/shared/ui';
import { PageLayout } from '@/app/layouts';
import { type ICounter, useCountersQuery } from '@/entities/counter';
import { ManageCountersModal } from '@/features/manage-counters-modal';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const { data: counters, isLoading } = useCountersQuery({
  includes: ['Agreement.Rentee'],
});
const isModalOpened = ref(false);

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Table setup
// -----------------------------------------------------------------------------
const counterToEditId = ref<number | undefined>(undefined);

const counterToEdit = computed(() =>
  counterToEditId.value
    ? counters.value?.find((counter) => counter.id === counterToEditId.value)
    : undefined,
);

const editRow = (row: ICounter) => {
  return {
    onClick: () => {
      counterToEditId.value = row.id;
      isModalOpened.value = true;
    },
  };
};

const createRow = () => {
  counterToEditId.value = undefined;
  isModalOpened.value = true;
};
</script>

<template>
  <PageLayout>
    <template #buttons-extra>
      <AddButton @click="createRow">Новые показания</AddButton>
    </template>

    <NDataTable
      :data="counters"
      :columns="columns"
      :row-props="editRow"
      :loading="isLoading"
    />
  </PageLayout>

  <ManageCountersModal
    v-model:is-opened="isModalOpened"
    :counter="counterToEdit"
  />
</template>

<style scoped></style>
