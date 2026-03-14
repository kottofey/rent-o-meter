<script setup lang="ts">
import { type DataTableInst, NDataTable } from 'naive-ui';
import { h, onMounted, reactive, ref, watch } from 'vue';

import { createColumns } from '../config/tableColumns';

import { useSettings } from '@/app/lib';
import { PageLayout } from '@/app/layouts';
import {
  type IAgreement,
  type IAgreementScopes,
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
import { useAuthStore } from '@/shared/store';

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const { settings } = useSettings();
const authStore = useAuthStore();

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const isModalOpened = ref(false);
const agreementToEdit = ref();
const prevFilter = ref();

const agreementScopes = reactive<IAgreementScopes>({
  'agreements:withDeleted': false,
  'agreements:byRentee': authStore.user?.rentee_id ?? null,
});

// -----------------------------------------------------------------------------
// Table setup
// -----------------------------------------------------------------------------

const { data: agreements, isFetching } = useAgreementsQuery({
  includes: ['Rentee'],
  scopes: () => agreementScopes,
});

const table = ref<DataTableInst | null>(null);
const agreementToEditId = ref<number | undefined>(undefined);

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

const editRow = (row: IAgreement) => {
  if (authStore.user?.roles?.includes('admin')) {
    return {
      onClick: () => {
        agreementToEditId.value = row.id;
        isModalOpened.value = true;
      },
    };
  } else {
    return {};
  }
};

const createRow = () => {
  agreementToEditId.value = undefined;
  agreementToEdit.value = undefined;
  isModalOpened.value = true;
};

const setExpired = () => {
  settings.value.agreements.filter = 'expired';
};

const setActual = () => {
  settings.value.agreements.filter = 'actual';
};

const setAll = () => {
  settings.value.agreements.filter = null;
};

const setWithDeleted = () => {
  settings.value.agreements.withDeleted =
    !settings.value.agreements.withDeleted;
  if (settings.value.agreements.withDeleted) {
    prevFilter.value = settings.value.agreements.filter;
    setAll();
  } else {
    settings.value.agreements.filter = prevFilter.value;
  }
};

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------

watch([agreementToEditId, isModalOpened], () => {
  if (isModalOpened.value && agreementToEditId.value) {
    agreementToEdit.value = agreements.value?.find(
      (agreement) => agreement.id === agreementToEditId.value,
    );
  }
});

watch(
  settings.value.agreements,
  () => {
    table.value?.filter({ status: settings.value.agreements.filter });
    agreementScopes['agreements:withDeleted'] =
      settings.value.agreements.withDeleted;
  },
  {
    deep: true,
  },
);

onMounted(() => {
  // Загружаем сохраненные установки
  table.value?.filter({ status: settings.value.agreements.filter });
  agreementScopes['agreements:withDeleted'] =
    settings.value.agreements.withDeleted;
});
</script>

<template>
  <PageLayout>
    <template #buttons-extra>
      <AddButton
        @click="createRow"
        v-if="authStore.user?.roles?.includes('admin')"
        >Новый договор</AddButton
      >

      <AppButton
        @click="setWithDeleted"
        :is-outlined="settings.agreements.withDeleted"
      >
        <template #default>Удаленные</template>
        <template #icon><InfinitiIcon /></template>
      </AppButton>

      <AppButton
        v-if="!settings.agreements.withDeleted"
        @click="setExpired"
        :is-outlined="settings.agreements.filter === 'expired'"
      >
        <template #default>Истекшие</template>
        <template #icon><ExpiredIcon /></template>
      </AppButton>

      <AppButton
        v-if="!settings.agreements.withDeleted"
        @click="setActual"
        :is-outlined="settings.agreements.filter === 'actual'"
      >
        <template #default>Актуальные</template>
        <template #icon><ActualIcon /></template>
      </AppButton>

      <AppButton
        v-if="!settings.agreements.withDeleted"
        @click="setAll"
        :is-outlined="settings.agreements.filter === null"
      >
        <template #default>Все</template>
        <template #icon><AllIcon /></template>
      </AppButton>
    </template>

    <NDataTable
      ref="table"
      :data="agreements"
      :columns="createColumns({ hFunc: h })"
      :row-props="editRow"
      :loading="isFetching"
    />
  </PageLayout>
  <ManageAgreementModal
    v-model:is-opened="isModalOpened"
    :agreement="agreementToEdit"
  />
</template>
