<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { NDataTable, useNotification } from 'naive-ui';

import { columns } from '../config/tableColumns';

import { notification } from '@/shared/lib';
import { PageLayout } from '@/app/layouts';
import { AddButton, AppButton } from '@/shared/ui';
import {
  type IRentee,
  type IRenteeScopes,
  useRenteesQuery,
} from '@/entities/rentee';
import { ManageRenteeModal } from '@/features/manage-rentee-modal';
import { InfinitiIcon } from '@/shared/ui/icons';
import { useAuthStore } from '@/shared/store';

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const authStore = useAuthStore();

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const isModalOpened = ref(false);
const withDeleted = ref(false);
const renteeToEditId = ref<number | undefined>(undefined);
const renteeToEdit = ref();

const renteeScopes = reactive<IRenteeScopes>({
  'rentee:withDeleted': false,
  'rentee:byId': authStore.user?.rentee_id ?? null,
});

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const {
  data: rentees,
  isLoading,
  isError,
  error,
} = useRenteesQuery({
  includes: ['Agreement'],
  scopes: () => renteeScopes,
});

const editRow = (row: IRentee) => {
  return {
    onClick: () => {
      renteeToEditId.value = row.id;
      isModalOpened.value = true;
    },
  };
};

const createRow = () => {
  renteeToEditId.value = undefined;
  renteeToEdit.value = undefined;
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

watch([renteeToEditId, isModalOpened], () => {
  if (isModalOpened.value && renteeToEditId.value) {
    renteeToEdit.value = rentees.value?.find(
      (rentee) => rentee.id === renteeToEditId.value,
    );
  }
});

watch(isError, () => {
  if (isError.value) {
    notification.error({
      content: error.value?.message,
      closable: true,
      duration: 3000,
    });
  }
});
</script>

<template>
  <PageLayout>
    <template #buttons-extra>
      <AddButton
        @click="createRow"
        v-if="authStore.user?.roles?.includes('admin')"
      >
        Новый арендатор
      </AddButton>

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
      :row-props="editRow"
      :loading="isLoading"
    />
  </PageLayout>

  <ManageRenteeModal
    v-model:is-opened="isModalOpened"
    :rentee="renteeToEdit"
  />
</template>

<style scoped></style>
