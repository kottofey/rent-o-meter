<script setup lang="ts">
import { computed, ref } from 'vue';
import { NDataTable } from 'naive-ui';

import { columns } from '../config/tableColumns';

import { PageLayout } from '@/app/layouts';
import { type IBill, useBillsQuery } from '@/entities/bill';
import { AddButton } from '@/shared/ui';
import { ManageBillModal } from '@/features/manage-bill-modal';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const { data: bills, isLoading } = useBillsQuery({
  includes: ['Agreement.Rentee'],
});
const isModalOpened = ref(false);

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Table setup
// -----------------------------------------------------------------------------
const billToEditId = ref<number | undefined>(undefined);

const billToEdit = computed(() =>
  bills.value?.find((bill) => bill.id === billToEditId.value),
);

const editRow = (row: IBill) => {
  return {
    onClick: () => {
      billToEditId.value = row.id;
      isModalOpened.value = true;
    },
  };
};

const createRow = () => {
  billToEditId.value = undefined;
  isModalOpened.value = true;
};
</script>

<template>
  <PageLayout>
    <template #buttons-extra>
      <AddButton @click="createRow">Новый счёт</AddButton>
    </template>

    <NDataTable
      :data="bills"
      :columns="columns"
      :row-props="editRow"
      :loading="isLoading"
    />
  </PageLayout>

  <ManageBillModal
    v-model:is-opened="isModalOpened"
    :bill="billToEdit"
  />
</template>

<style scoped></style>
