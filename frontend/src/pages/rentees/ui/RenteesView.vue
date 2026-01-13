<script setup lang="ts">
import { computed, ref } from 'vue';
import { NDataTable } from 'naive-ui';

import { columns } from '../config/tableColumns';

import { PageLayout } from '@/app/layouts';
import { AddButton } from '@/shared/ui';
import { useRenteesQuery } from '@/entities/rentee';
import { IRentee } from '@/entities/rentee/model/rentee-api';
import { ManageRenteeModal } from '@/features/manage-rentee-modal';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const { data: rentees, isLoading } = useRenteesQuery({
  includes: ['Agreement'],
});
const isModalOpened = ref(false);

// -----------------------------------------------------------------------------
// Table setup
// -----------------------------------------------------------------------------
const renteeToEditId = ref<number | undefined>(undefined);

const renteeToEdit = computed(() =>
  rentees.value?.find((rentee) => rentee.id === renteeToEditId.value),
);

const rowProps = (row: IRentee) => {
  return {
    onClick: () => {
      renteeToEditId.value = row.id;
      isModalOpened.value = true;
    },
  };
};

const createRow = () => {
  renteeToEditId.value = undefined;
  isModalOpened.value = true;
};
</script>

<template>
  <PageLayout>
    <template #buttons-extra>
      <AddButton @click="createRow">Новый арендатор</AddButton>
    </template>

    <NDataTable
      :data="rentees"
      :columns="columns"
      :row-props="rowProps"
      :loading="isLoading"
    />
  </PageLayout>

  <ManageRenteeModal
    v-model:is-opened="isModalOpened"
    :rentee="renteeToEdit"
  />
</template>

<style scoped></style>
