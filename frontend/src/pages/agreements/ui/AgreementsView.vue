<script setup lang="ts">
import { type DataTableInst, NDataTable } from 'naive-ui';
import { reactive, ref, watch } from 'vue';

import { columns } from '../config/tableColumns';

import { PageLayout } from '@/app/layouts';
import {
  type IAgreement,
  IAgreementScopes,
  useAgreementsQuery,
} from '@/entities/agreement';
import { ManageAgreementModal } from '@/features/manage-agreement-modal';
import { AddButton, AppButton } from '@/shared/ui';
import {
  ScullCrossBonesIcon as ExpiredIcon,
  CheckMarkIcon as ActualIcon,
  WarningIcon as AllIcon,
  InfinitiIcon,
} from '@/shared/ui/icons';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const isModalOpened = ref(false);
const withDeleted = ref(false);
const filter = ref<'expired' | 'actual' | null>('actual');
const agreementToEdit = ref();

const agreementScopes = reactive<IAgreementScopes>({
  'agreements:withDeleted': false,
});

// -----------------------------------------------------------------------------
// Computed
// -----------------------------------------------------------------------------

// Empty

// -----------------------------------------------------------------------------
// Table setup
// -----------------------------------------------------------------------------

const { data: agreements, isLoading } = useAgreementsQuery({
  includes: ['Rentee'],
  scopes: () => agreementScopes,
});

const table = ref<DataTableInst | null>(null);
const agreementToEditId = ref<number | undefined>(undefined);

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

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

const setWithDeleted = () => {
  withDeleted.value = !withDeleted.value;
  if (withDeleted.value) {
    setAll();
  } else {
    setActual();
  }
};

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------
watch(withDeleted, () => {
  agreementScopes['agreements:withDeleted'] = withDeleted.value;
});

watch([agreementToEditId, isModalOpened], () => {
  if (isModalOpened.value && agreementToEditId.value) {
    agreementToEdit.value = agreements.value?.find(
      (agreement) => agreement.id === agreementToEditId.value,
    );
  }
});
</script>

<template>
  <PageLayout>
    <template #buttons-extra>
      <AddButton @click="createRow">Новый договор</AddButton>

      <AppButton
        @click="setWithDeleted"
        :is-outlined="withDeleted"
      >
        <template #default>Удаленные</template>
        <template #icon><InfinitiIcon /></template>
      </AppButton>

      <AppButton
        v-if="!withDeleted"
        @click="setExpired"
        :is-outlined="filter === 'expired'"
      >
        <template #default>Истекшие</template>
        <template #icon><ExpiredIcon /></template>
      </AppButton>

      <AppButton
        v-if="!withDeleted"
        @click="setActual"
        :is-outlined="filter === 'actual'"
      >
        <template #default>Актуальные</template>
        <template #icon><ActualIcon /></template>
      </AppButton>

      <AppButton
        v-if="!withDeleted"
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
