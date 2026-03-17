<script setup lang="ts">
import { NDataTable } from 'naive-ui';
import { ref, watch } from 'vue';

import { createColumns } from '../config/tableColumns';

import { PageLayout } from '@/app/layouts';
import { type IPayment, usePaymentsQuery } from '@/entities/payment';
import { AddButton } from '@/shared/ui';
import { useAuthStore } from '@/shared/store';
import { ManagePaymentModal } from '@/features/manage-payment-modal';

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const authStore = useAuthStore();

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const isModalOpened = ref(false);
// const withInactiveAgreements = ref(false);
// const selectedRenteeAgreements = ref();
const paymentToEdit = ref();
const paymentToEditId = ref<number | undefined>(undefined);

// const paymentScopes = reactive<IPaymentScopes>({
//   'payment:byBill': authStore.user?.rentee_id ?? null,
// });

// -----------------------------------------------------------------------------
// Computed
// -----------------------------------------------------------------------------

// const filteredBills = computed(() =>
//   bills.value?.filter((bill) => {
//     if (bill.agreement && withInactiveAgreements.value) {
//       return (
//         selectedRenteeAgreements.value?.includes(bill.agreement.id) ?? true
//       );
//     } else {
//       return (
//         (bill.agreement.status &&
//           selectedRenteeAgreements.value?.includes(bill.agreement.id)) ??
//         true
//       );
//     }
//   }),
// );

// -----------------------------------------------------------------------------
// Table setup
// -----------------------------------------------------------------------------

const { data: payments, isLoading } = usePaymentsQuery({
  includes: ['Bill.Agreement.Rentee'],
  // scopes: () => paymentScopes,
});

const editRow = (row: IPayment) => {
  if (authStore.user?.roles?.includes('admin')) {
    return {
      onClick: () => {
        paymentToEditId.value = row.id;
        isModalOpened.value = true;
      },
    };
  } else {
    return {};
  }
};

const createRow = () => {
  paymentToEditId.value = undefined;
  paymentToEdit.value = undefined;
  isModalOpened.value = true;
};

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------

watch([isModalOpened], () => {
  if (isModalOpened.value && paymentToEditId.value) {
    paymentToEdit.value = payments.value?.find(
      (payment) => payment.id === paymentToEditId.value,
    );
  } else {
    paymentToEdit.value = undefined;
  }
});
</script>

<template>
  <PageLayout>
    <template #buttons-extra>
      <AddButton
        @click="createRow"
        v-if="authStore.user?.roles?.includes('admin')"
        >Новая оплата</AddButton
      >

      <!--      <AppButton-->
      <!--        @click="withInactiveAgreements = !withInactiveAgreements"-->
      <!--        :is-outlined="withInactiveAgreements"-->
      <!--      >-->
      <!--        <template #default>C истёкшими договорами</template>-->
      <!--        <template #icon><ExpiredIcon /></template>-->
      <!--      </AppButton>-->
      <!--      <div-->
      <!--        class="menu-block"-->
      <!--        v-if="authStore.user?.roles?.includes('admin')"-->
      <!--      >-->
      <!--        <p class="menu-block__title">Фильтр по арендаторам:</p>-->
      <!--        <SelectRentees v-model:agreement-ids="selectedRenteeAgreements" />-->
      <!--      </div>-->
    </template>

    <NDataTable
      :data="payments"
      :columns="createColumns()"
      :row-props="editRow"
      :loading="isLoading"
    />
  </PageLayout>

  <ManagePaymentModal
    v-model:is-opened="isModalOpened"
    :payment="paymentToEdit"
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
