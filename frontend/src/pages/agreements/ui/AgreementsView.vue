<script setup lang="ts">
import { NDataTable } from 'naive-ui';
import { computed, ref } from 'vue';

import { columns } from '../config/tableColumns';

import { PageLayout } from '@/app/layouts';
import { type IAgreement, useAgreementsQuery } from '@/entities/agreement';
import { ManageAgreementModal } from '@/features/agreement';
import { AddButton } from '@/shared/ui';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const { data: agreements, isLoading } = useAgreementsQuery({
  includes: ['Rentee'],
});
const isModalOpened = ref(false);

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Table setup
// -----------------------------------------------------------------------------
const agreementToEditId = ref<number | undefined>(undefined);

const agrrementToEdit = computed(() =>
  agreements.value?.find(
    (agreement) => agreement.id === agreementToEditId.value,
  ),
);

const editRow = (row: IAgreement) => {
  return {
    onClick: () => {
      agreementToEditId.value = row.id;
      isModalOpened.value = true;
    },
  };
};

const createRow = () => {
  agreementToEditId.value = undefined;
  isModalOpened.value = true;
};
</script>

<template>
  <PageLayout>
    <template #header-buttons> </template>

    <template #buttons-extra>
      <AddButton @click="createRow">Новый договор</AddButton>
    </template>

    <NDataTable
      :data="agreements"
      :columns="columns"
      :row-props="editRow"
      :loading="isLoading"
    />
  </PageLayout>

  <ManageAgreementModal
    v-model:is-opened="isModalOpened"
    :agreement="agrrementToEdit"
  />
</template>

<style scoped></style>
