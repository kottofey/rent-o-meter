<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { NDataTable } from 'naive-ui';

import { columns } from '../config/tableColumns';

import { PageLayout } from '@/app/layouts';
import { type IBill, type IBillScopes, useBillsQuery } from '@/entities/bill';
import { AddButton, AppButton } from '@/shared/ui';
import { ManageBillModal } from '@/features/manage-bill-modal';
import { ScullCrossBonesIcon as ExpiredIcon } from '@/shared/ui/icons';
import { SelectRentees } from '@/widgets/select-rentees';
import { useAuthStore } from '@/shared/store';

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const authStore = useAuthStore();

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const isModalOpened = ref(false);
const withInactiveAgreements = ref(false);
const selectedRenteeAgreements = ref();
const billToEdit = ref();
const billToEditId = ref<number | undefined>(undefined);

const billScopes = reactive<IBillScopes>({
  'bills:byRentee': authStore.user?.rentee_id ?? null,
});

// -----------------------------------------------------------------------------
// Computed
// -----------------------------------------------------------------------------

const filteredBills = computed(() =>
  bills.value?.filter((bill) => {
    if (bill.agreement && withInactiveAgreements.value) {
      return (
        selectedRenteeAgreements.value?.includes(bill.agreement.id) ?? true
      );
    } else {
      return (
        (bill.agreement.status &&
          selectedRenteeAgreements.value?.includes(bill.agreement.id)) ??
        true
      );
    }
  }),
);

// -----------------------------------------------------------------------------
// Table setup
// -----------------------------------------------------------------------------

const { data: bills, isLoading } = useBillsQuery({
  includes: ['Agreement.Rentee'],
  scopes: () => billScopes,
});

const editRow = (row: IBill) => {
  if (authStore.user?.roles?.includes('admin')) {
    return {
      onClick: () => {
        billToEditId.value = row.id;
        isModalOpened.value = true;
      },
    };
  } else {
    return {};
  }
};

const createRow = () => {
  billToEditId.value = undefined;
  billToEdit.value = undefined;
  isModalOpened.value = true;
};

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------

watch([isModalOpened], () => {
  if (isModalOpened.value && billToEditId.value) {
    billToEdit.value = bills.value?.find(
      (bill) => bill.id === billToEditId.value,
    );
  } else {
    billToEdit.value = undefined;
  }
});
</script>

<template>
  <PageLayout>
    <template #buttons-extra>
      <AddButton
        @click="createRow"
        v-if="authStore.user?.roles?.includes('admin')"
        >Новый счёт</AddButton
      >

      <AppButton
        @click="withInactiveAgreements = !withInactiveAgreements"
        :is-outlined="withInactiveAgreements"
      >
        <template #default>C истёкшими договорами</template>
        <template #icon><ExpiredIcon /></template>
      </AppButton>
      <div
        class="menu-block"
        v-if="authStore.user?.roles?.includes('admin')"
      >
        <p class="menu-block__title">Фильтр по арендаторам:</p>
        <SelectRentees v-model:agreement-ids="selectedRenteeAgreements" />
      </div>
    </template>

    <NDataTable
      :data="filteredBills"
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

<style scoped lang="scss">
.menu-block {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: fit-content;

  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
}
</style>
