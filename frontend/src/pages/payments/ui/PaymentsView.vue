<script setup lang="ts">
import { NDataTable } from 'naive-ui';
import { computed, reactive, ref, watch } from 'vue';

import { createColumns } from '../config/tableColumns';

import { PageLayout } from '@/app/layouts';
import {
  type IPayment,
  type IPaymentScopes,
  usePaymentsQuery,
} from '@/entities/payment';
import { AddButton } from '@/shared/ui';
import { useAuthStore } from '@/shared/store';
import { ManagePaymentModal } from '@/features/manage-payment-modal';
import { SelectBills } from '@/widgets/select-bills';

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const authStore = useAuthStore();

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const isModalOpened = ref(false);
const byBillFilter = ref<number | null>(null);
const paymentToEdit = ref();
const paymentToEditId = ref<number | undefined>(undefined);

const paymentScopes = reactive<IPaymentScopes>({
  'payment:byRentee': authStore.user?.rentee_id ?? null,
});

// -----------------------------------------------------------------------------
// Computed
// -----------------------------------------------------------------------------
const filteredPayments = computed(() =>
  payments.value?.filter((p) => {
    if (byBillFilter.value !== null) {
      return p.bill_id === byBillFilter.value;
    } else {
      return true;
    }
  }),
);

// -----------------------------------------------------------------------------
// Table setup
// -----------------------------------------------------------------------------

const { data: payments, isLoading } = usePaymentsQuery({
  includes: ['Bill.Agreement.Rentee'],
  scopes: () => paymentScopes,
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
      >
        Новая оплата
      </AddButton>

      <SelectBills
        v-model:value="byBillFilter"
        label="Фильтр по счету:"
        :rentee-id="authStore.user?.rentee_id"
      />
    </template>

    <NDataTable
      :data="filteredPayments"
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
