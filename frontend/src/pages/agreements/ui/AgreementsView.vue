<script setup lang="ts">
import { type DataTableInst, NDataTable } from 'naive-ui';
import { computed, ref } from 'vue';

import { columns } from '../config/tableColumns';

import { PageLayout } from '@/app/layouts';
import { type IAgreement, useAgreementsQuery } from '@/entities/agreement';
import { ManageAgreementModal } from '@/features/manage-agreement-modal';
import { AddButton, AppButton } from '@/shared/ui';
import {
  ScullCrossBonesIcon as ExpiredIcon,
  CheckMarkIcon as ActualIcon,
  WarningIcon as AllIcon,
} from '@/shared/ui/icons';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const { data: agreements, isLoading } = useAgreementsQuery({
  includes: ['Rentee'],
});
const isModalOpened = ref(false);
const filter = ref<'expired' | 'actual' | null>('actual');

// -----------------------------------------------------------------------------
// Table setup
// -----------------------------------------------------------------------------
const table = ref<DataTableInst | null>(null);
const agreementToEditId = ref<number | undefined>(undefined);

const agreementToEdit = computed(() =>
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

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------
const setExpired = () => {
  table.value?.filter({ status: 'expired' });
  filter.value = 'expired';
};
const setActual = () => {
  table.value?.filter({ status: 'actual' });
  filter.value = 'actual';
};
const setAll = () => {
  table.value?.filter({ status: undefined });
  filter.value = null;
};
</script>

<template>
  <PageLayout>
    <template #buttons-extra>
      <AddButton @click="createRow">Новый договор</AddButton>
      <AppButton
        @click="setExpired"
        :is-outlined="filter === 'expired'"
      >
        <template #default>Истекшие</template>
        <template #icon><ExpiredIcon /></template>
      </AppButton>

      <AppButton
        @click="setActual"
        :is-outlined="filter === 'actual'"
      >
        <template #default>Актуальные</template>
        <template #icon><ActualIcon /></template>
      </AppButton>

      <AppButton
        @click="setAll"
        :is-outlined="filter === null"
      >
        <template #default>Все</template>
        <template #icon><AllIcon /></template>
      </AppButton>
    </template>

    <NDataTable
      ref="table"
      :data="agreements"
      :columns="columns"
      :row-props="editRow"
      :loading="isLoading"
    />
  </PageLayout>

  <ManageAgreementModal
    v-model:is-opened="isModalOpened"
    :agreement="agreementToEdit"
  />
</template>
