<script setup lang="ts">
import {
  FormRules,
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
import { ref, toRef, unref } from 'vue';

import { useBillModal } from '../lib/useBillModal';

import { IBill } from '@/entities/bill';
import { SelectAgreements } from '@/widgets/select-agreements';
import { parseMoney, parseNumber } from '@/shared/lib';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const formRef = ref();

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
const isOpened = defineModel('isOpened', { default: false });

const { bill = undefined } = defineProps<{
  bill?: IBill;
}>();

const billRef = toRef(() => bill);

const { formData, submit, isPending, isFormValidateError } = useBillModal({
  initialData: billRef,
  formRef: formRef,
});

const rules: FormRules = {
  month: {
    required: true,
    message: 'Введите название договора',
  },
  bill_date: {
    required: true,
    message: 'Выберите дату начала договора',
  },

  agreementId: {
    required: true,
    message: 'Выберите арендатора',
  },
};
</script>

<template>
  <NModal
    :show="isOpened"
    @mask-click="isOpened = false"
    @esc="isOpened = false"
  >
    <NCard
      class="manage-bill-modal"
      :title="bill ? 'Редактирование счёта' : 'Создание счёта'"
    >
      <NForm
        :disabled="isPending"
        :model="unref(formData)"
        ref="formRef"
        :rules="rules"
        @submit.prevent
        @keyup.prevent.enter="
          async () => {
            await submit();
            isOpened = isFormValidateError;
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
          label="Сумма"
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
          <NCheckbox v-model:checked="formData.status" />
          <span class="manage-bill-modal__label-span">{{
            formData.status ? 'Оплачено' : 'Не оплачено'
          }}</span>
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
              await submit();
              isOpened = isFormValidateError;
            }
          "
          >{{ bill ? 'Сохранить' : 'Создать' }}
        </NButton>
        <NButton
          type="error"
          @click="isOpened = false"
          >Отменить
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
