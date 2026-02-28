<script setup lang="ts">
import { NDataTable } from 'naive-ui';
import { reactive, ref, watch } from 'vue';

import { columns } from '../config/tableColumns';

import { AddButton } from '@/shared/ui';
import { PageLayout } from '@/app/layouts';
import {
  type ICounter,
  type ICounterScopes,
  useCountersQuery,
} from '@/entities/counter';
import { ManageCountersModal } from '@/features/manage-counters-modal';
import { useAuthStore } from '@/shared/store';

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const authStore = useAuthStore();

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const isModalOpened = ref(false);
const counterToEditId = ref<number | undefined>(undefined);
const counterToEdit = ref();
const counterScopes = reactive<ICounterScopes>({
  'counter:byRenteeId': authStore.user?.rentee_id ?? null,
});

// -----------------------------------------------------------------------------
// Table setup
// -----------------------------------------------------------------------------

const { data: counters, isLoading } = useCountersQuery({
  includes: ['Agreement.Rentee'],
  scopes: () => counterScopes,
});

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

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------

watch([counterToEditId, isModalOpened], () => {
  if (isModalOpened.value && counterToEditId.value) {
    counterToEdit.value = counters.value?.find(
      (counter) => counter.id === counterToEditId.value,
    );
  }
});
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
