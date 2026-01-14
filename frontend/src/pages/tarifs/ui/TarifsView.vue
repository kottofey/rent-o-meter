<script setup lang="ts">
import { NDataTable } from 'naive-ui';
import { computed, ref } from 'vue';

import { columns } from '../config/tableColumns';

import { PageLayout } from '@/app/layouts';
import { ManageTarifModal } from '@/features/manage-tarif-modal';
import { type ITarif, useTarifsQuery } from '@/entities/tarif';
import { AddButton } from '@/shared/ui';
import { ManageAgreementModal } from '@/features/manage-agreement-modal';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const { data: tarifs, isLoading } = useTarifsQuery({});
const isModalOpened = ref(false);

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Table setup
// -----------------------------------------------------------------------------
const tarifToEditId = ref<number | undefined>(undefined);

const tarifToEdit = computed(() =>
  tarifs.value?.find((tarif) => tarif.id === tarifToEditId.value),
);

const editRow = (row: ITarif) => {
  return {
    onClick: () => {
      tarifToEditId.value = row.id;
      isModalOpened.value = true;
    },
  };
};

const createRow = () => {
  tarifToEditId.value = undefined;
  isModalOpened.value = true;
};
</script>

<template>
  <PageLayout>
    <template #buttons-extra>
      <AddButton @click="createRow">Новый тариф</AddButton>
    </template>

    <NDataTable
      :data="tarifs"
      :columns="columns"
      :row-props="editRow"
      :loading="isLoading"
    />
  </PageLayout>

  <ManageTarifModal
    v-model:is-opened="isModalOpened"
    :tarif="tarifToEdit"
  />
</template>

<style scoped></style>
