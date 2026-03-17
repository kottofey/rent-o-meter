<script setup lang="ts">
import {
  type FormInst,
  NButton,
  NButtonGroup,
  NCard,
  NDatePicker,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NModal,
  NSelect,
} from 'naive-ui';
import { computed, reactive, ref, watch } from 'vue';
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface';

import { rules, initFormData } from '../config';

import {
  type IPayment,
  useCreatePaymentMutation,
  useDeletePaymentMutation,
  useEditPaymentMutation,
  useRestorePaymentMutation,
} from '@/entities/payment';
import { parseDate, parseMoney, parseNumber } from '@/shared/lib';
import {
  type IBillScopes,
  useBillsQuery,
  useEditBillMutation,
} from '@/entities/bill';
import { SelectRentees } from '@/widgets/select-rentees';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------
const formRef = ref<FormInst | null>();
const formData = ref<
  Partial<IPayment> & { rentee_id?: number; ammount_remain?: number }
>({
  ...initFormData,
});

const billScopes = reactive<IBillScopes>({
  'bills:byRentee': formData.value.rentee_id,
});

const billsOptions = computed(() => {
  return (
    bills.value?.reduce<SelectMixedOption[]>((acc, b) => {
      if (b.agreement.renteeId === formData.value.rentee_id) {
        acc.push({
          label: `#${b.id}: ${parseDate({ date: b.month, format: 'MMM YYYY' })}`,
          value: b.id,
        });
      }

      return acc;
    }, []) ?? []
  );
});

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
const isOpened = defineModel('isOpened', { default: false });

const { payment } = defineProps<{
  payment?: IPayment;
}>();

const { mutate: createPayment, isPending: isCreatePending } =
  useCreatePaymentMutation();
const { mutate: editPayment, isPending: isEditPending } =
  useEditPaymentMutation();
const { mutate: deletePayment, isPending: isDeletePending } =
  useDeletePaymentMutation();
const { mutate: restorePayment, isPending: isRestorePending } =
  useRestorePaymentMutation();

const { data: bills } = useBillsQuery({
  scopes: () => billScopes,
  includes: ['Agreement'],
});

const { mutate: editBill } = useEditBillMutation();

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

const onSubmit = async () => {
  try {
    await formRef.value?.validate(async (errors) => {
      if (!errors) {
        if (payment) {
          editPayment({
            id: payment.id,
            updatedPayment: formData.value,
          });
        } else {
          createPayment({
            payment: formData.value,
          });
        }

        if (formData.value.bill_id && formData.value.ammount) {
          updateBillAmmount({
            bill_id: formData.value.bill_id,
            ammount: formData.value.ammount,
          });
        }
        clearForm();
        isOpened.value = false;
      }
    });
  } catch (errors) {
    console.error('Ошибка валидации', JSON.stringify(errors, null, 2));
  }
};

const updateBillAmmount = ({
  bill_id,
  ammount,
}: {
  bill_id: number;
  ammount: number;
}) => {
  // Обновляем оплаченную сумму в счетах
  const billToEdit = bills.value?.find((b) => b.id === formData.value.bill_id);

  if (billToEdit) {
    editBill({
      id: bill_id,
      updatedBill: {
        ammount_paid: ammount + billToEdit.ammount_paid,
      },
    });
  }
};

const clearForm = () => {
  formData.value = { ...initFormData };
};

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------
watch([() => payment, isOpened], () => {
  if (payment) {
    formData.value = {
      date: payment.date,

      rentee_id: payment.bill?.agreement.renteeId,

      bill_id: payment.bill_id,
      ammount: payment.ammount,

      comment: payment.comment,
    };
  } else {
    formData.value = { ...initFormData };
  }
});

watch(
  () => formData.value.rentee_id,
  (newRenteeId, prevRenteeId) => {
    if (newRenteeId !== prevRenteeId && prevRenteeId !== undefined) {
      billScopes['bills:byRentee'] = formData.value.rentee_id;
      formData.value.bill_id = null;
    }
  },
);

watch(
  () => formData.value.bill_id,
  () => {
    const bill = bills.value?.find((b) => b.id === formData.value.bill_id);
    if (bill) {
      formData.value.ammount_remain =
        bill.ammount + bill.extra_ammount - bill.ammount_paid;
    }
  },
);
</script>

<template>
  <NModal
    :show="isOpened"
    @close="isOpened = false"
    @mask-click="isOpened = false"
    @esc="isOpened = false"
  >
    <NCard
      class="manage-payment-modal"
      :title="payment ? 'Редактирование счёта' : 'Создание счёта'"
      :content-style="{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }"
    >
      <NForm
        :disabled="
          isCreatePending ||
          isEditPending ||
          isDeletePending ||
          isRestorePending
        "
        :model="formData"
        ref="formRef"
        :rules="rules"
        @submit.prevent
        @keyup.prevent.enter="
          async () => {
            await onSubmit();
          }
        "
      >
        <!--  Дата оплаты  -->
        <NFormItem
          label="Дата оплаты"
          path="date"
        >
          <NDatePicker
            clearable
            v-model:value="formData.date"
            format="dd MMM yyyy"
          />
        </NFormItem>

        <!--  Арендатор  -->

        <NFormItem
          label="Арендатор"
          path="rentee_id"
        >
          <SelectRentees
            v-model:value="formData.rentee_id"
            :style="{ width: '100%' }"
          />
        </NFormItem>

        <!-- Счета, Оплата за месяц  -->

        <NFormItem
          label="Оплата по счету за"
          path="bill_id"
          :feedback-style="{
            width: '100%',
          }"
          :content-style="{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            rowGap: '10px',
          }"
        >
          <NSelect
            v-model:value="formData.bill_id"
            :options="billsOptions"
            :style="{ width: '100%' }"
            :disabled="!formData.rentee_id"
            :placeholder="
              !formData.rentee_id
                ? 'Сначала выберите арендатора'
                : 'Выберите счет'
            "
          />
          <div v-if="formData.bill_id">
            <p
              v-if="formData.ammount_remain && formData.ammount_remain !== 0"
              style="font-size: 0.7em; font-style: italic"
            >
              {{
                formData.ammount_remain >= 0 ? 'Осталось оплатить' : 'Переплата'
              }}
              :
              {{
                parseMoney({
                  ammount: formData.ammount_remain,
                  removeMinus: true,
                })
              }}
            </p>
            <p
              v-else
              style="font-size: 0.7em; font-style: italic"
            >
              Счет полностью погашен
            </p>
          </div>
        </NFormItem>

        <!--  сумма  -->

        <NFormItem
          label="Cумма"
          path="ammount"
        >
          <NInputNumber
            v-model:value="formData.ammount"
            :show-button="false"
            clearable
            :parse="(value) => parseNumber(value)"
            :format="
              (val) =>
                val ? parseMoney({ ammount: val, mode: 'rubbles' }) : ''
            "
          />
        </NFormItem>

        <!--  Комментарий  -->
        <NFormItem
          label="Комментарий"
          path="comment"
        >
          <NInput
            type="textarea"
            v-model:value="formData.comment"
          />
        </NFormItem>
      </NForm>

      <NButtonGroup class="manage-payment-modal__buttons">
        <NButton
          type="success"
          @click="
            async () => {
              await onSubmit();
            }
          "
        >
          {{ payment ? 'Сохранить' : 'Создать' }}
        </NButton>
        <NButton
          v-if="payment"
          type="error"
          @click="
            () => {
              if (payment.deletedAt === null) {
                deletePayment({ id: payment.id });
                if (payment.bill_id !== null) {
                  updateBillAmmount({
                    bill_id: payment.bill_id,
                    ammount: payment.ammount * -1,
                  });
                }
              } else {
                restorePayment({ id: payment.id });
                if (payment.bill_id !== null) {
                  updateBillAmmount({
                    bill_id: payment.bill_id,
                    ammount: payment.ammount,
                  });
                }
              }
              isOpened = false;
            }
          "
        >
          {{ payment.deletedAt === null ? 'Удалить' : 'Восстановить' }}
        </NButton>
        <NButton
          type="error"
          @click="isOpened = false"
          textColor="white"
          color="black"
        >
          Отменить
        </NButton>
      </NButtonGroup>
    </NCard>
  </NModal>
</template>

<style scoped lang="scss">
.manage-payment-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  min-width: 450px;

  width: fit-content;
  border-radius: 12px;

  &__buttons {
    display: flex;
    justify-content: center;
  }

  &__label-span {
    margin-left: 10px;
  }
}
</style>
