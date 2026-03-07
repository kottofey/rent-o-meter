<script setup lang="ts">
import {
  type FormInst,
  NButton,
  NButtonGroup,
  NCard,
  NCheckbox,
  NDatePicker,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NModal,
} from 'naive-ui';
import { ref, watch } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';

import { rules, initFormData } from '../config';
import { calculateAmmount } from '../lib/calculateAmmount.ts';

import {
  type IBill,
  useCreateBillMutation,
  useEditBillMutation,
} from '@/entities/bill';
import { SelectAgreements } from '@/widgets/select-agreements';
import { parseMoney, parseNumber } from '@/shared/lib';
import { dayjs } from '@/shared/lib/dayjs';
import { useCountersQueryClient } from '@/entities/counter';
import { useTarifQueryClient } from '@/entities/tarif';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------
const formRef = ref<FormInst | null>();
const formData = ref<Partial<IBill>>({ ...initFormData });

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
const queryClient = useQueryClient();

const isOpened = defineModel('isOpened', { default: false });

const { bill } = defineProps<{
  bill?: IBill;
}>();

const { mutate: createBill, isPending: isCreatePending } =
  useCreateBillMutation();
const { mutate: editBill, isPending: isEditPending } = useEditBillMutation();

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

const onSubmit = async () => {
  try {
    await formRef.value?.validate(async (errors) => {
      if (!errors && formData.value?.agreementId) {
        // -----------------------------------------------------------------------------
        // Вычисляем актуальные счетчики и тарифы
        // -----------------------------------------------------------------------------

        const actualCounters = await useCountersQueryClient({
          client: queryClient,
          scopes: {
            'counter:byMonth': dayjs(formData.value.month).format('YYYY-MM-DD'),
            'counter:byAgreementId': formData.value.agreementId,
          },
        });

        if (actualCounters.length > 1) {
          throw new Error('More than one counter exist, check counters!');
        }

        if (actualCounters[0]) {
          const actualTarifs = await useTarifQueryClient({
            client: queryClient,
            scopes: {
              'tarif:actualBetween': {
                dateStart: dayjs(actualCounters[0].date_start).format(
                  'YYYY-MM-DD',
                ),
                dateEnd: dayjs(actualCounters[0].date_end).format('YYYY-MM-DD'),
              },
            },
          });

          formData.value = {
            ...formData.value,

            counterId: actualCounters[0].id,
            tarifs: actualTarifs,
          };

          formData.value.ammount = calculateAmmount({
            tarifs: actualTarifs,
            counter: actualCounters[0],
          }).total;
        }

        // -----------------------------------------------------------------------------
        // Выполняем сабмит
        // -----------------------------------------------------------------------------
        if (bill) {
          editBill({
            id: bill.id,
            updatedBill: formData.value,
          });
        } else {
          createBill({
            bill: formData.value,
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

const clearForm = () => {
  formData.value = { ...initFormData };
};

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------
watch([() => bill, isOpened], () => {
  if (bill) {
    formData.value = { ...bill };
  } else {
    clearForm();
  }
});
</script>

<template>
  <NModal
    :show="isOpened"
    @close="isOpened = false"
    @mask-click="isOpened = false"
    @esc="isOpened = false"
  >
    <NCard
      class="manage-bill-modal"
      :title="bill ? 'Редактирование счёта' : 'Создание счёта'"
      :content-style="{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }"
    >
      <NForm
        :disabled="isCreatePending || isEditPending"
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
        <!--  Арендатор  -->
        <NFormItem
          label="Арендатор"
          path="agreementId"
        >
          <SelectAgreements
            v-model:value="formData.agreementId"
            label-by="rentee"
            placeholder="Арендатор"
          />
        </NFormItem>

        <!--  Дата счёта  -->
        <NFormItem
          label="Дата счёта"
          path="bill_date"
        >
          <NDatePicker
            clearable
            v-model:value="formData.bill_date"
            format="dd MMM yyyy"
          />
        </NFormItem>

        <!--  Оплата за  -->
        <NFormItem
          label="Оплата за"
          path="month"
        >
          <NDatePicker
            clearable
            v-model:value="formData.month"
            format="LLLL yyyy"
            type="month"
            month-format="LLLL"
            :actions="['now', 'confirm']"
          />
        </NFormItem>

        <!--  суммы  -->

        <NFormItem
          label="Доп. сумма"
          path="extra_ammount"
        >
          <NInputNumber
            v-model:value="formData.extra_ammount"
            :show-button="false"
            clearable
            :parse="(value) => parseNumber(value)"
            :format="
              (val) =>
                val ? parseMoney({ ammount: val, mode: 'rubbles' }) : ''
            "
          />
        </NFormItem>

        <NFormItem
          label="Оплачено"
          path="ammount_paid"
        >
          <NInputNumber
            v-model:value="formData.ammount_paid"
            :show-button="false"
            clearable
            :parse="(value) => parseNumber(value)"
            :format="
              (val) =>
                val ? parseMoney({ ammount: val, mode: 'rubbles' }) : ''
            "
          />
        </NFormItem>

        <!--  Статус  -->
        <NFormItem
          label="Статус"
          label-placement="top"
          path="status"
          required
        >
          <NCheckbox
            v-model:checked="formData.status"
            :label="formData.status ? 'Оплачено' : 'Не оплачено'"
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
      <NButtonGroup class="manage-bill-modal__buttons">
        <NButton
          type="success"
          @click="
            async () => {
              await onSubmit();
            }
          "
        >
          {{ bill ? 'Сохранить' : 'Создать' }}
        </NButton>

        <NButton
          type="error"
          @click="isOpened = false"
        >
          Отменить
        </NButton>
      </NButtonGroup>
    </NCard>
  </NModal>
</template>

<style scoped lang="scss">
.manage-bill-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  min-width: 400px;

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
