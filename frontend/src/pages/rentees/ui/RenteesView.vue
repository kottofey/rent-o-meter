<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { NDataTable } from 'naive-ui';

import { columns } from '../config/tableColumns';

import { PageLayout } from '@/app/layouts';
import { AddButton, AppButton } from '@/shared/ui';
import {
  type IRentee,
  type IRenteeScopes,
  useRenteesQuery,
} from '@/entities/rentee';
import { ManageRenteeModal } from '@/features/manage-rentee-modal';
import { InfinitiIcon } from '@/shared/ui/icons';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const isModalOpened = ref(false);
const withDeleted = ref(false);

const renteeScopes = reactive<IRenteeScopes>({
  'rentee:withDeleted': false,
});

// -----------------------------------------------------------------------------
// Table setup
// -----------------------------------------------------------------------------

const { data: rentees, isLoading } = useRenteesQuery({
  includes: ['Agreement'],
  scopes: () => renteeScopes,
});

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

const setWithDeleted = () => {
  withDeleted.value = !withDeleted.value;
};

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------
watch(withDeleted, () => {
  renteeScopes['rentee:withDeleted'] = withDeleted.value;
});
</script>

<template>
  <PageLayout>
    <template #buttons-extra>
      <AddButton @click="createRow">Новый арендатор</AddButton>

      <AppButton
        @click="setWithDeleted"
        :is-outlined="withDeleted"
      >
        <template #default>Удаленные</template>
        <template #icon><InfinitiIcon /></template>
      </AppButton>
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
