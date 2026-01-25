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
  NModal,
} from 'naive-ui';
import { ref, toRef, unref } from 'vue';

import { useAgreementModal } from '../lib/useAgreementModal';

import { IAgreement, useDeleteAgreementMutation } from '@/entities/agreement';
import { SelectRentees } from '@/widgets/select-rentees';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const formRef = ref();

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
const isOpened = defineModel('isOpened', { default: false });

const { agreement = undefined } = defineProps<{
  agreement?: IAgreement;
}>();

const agreementRef = toRef(() => agreement);

const { formData, submit, isPending, isFormValidateError } = useAgreementModal({
  initialData: agreementRef,
  formRef: formRef,
});

const { mutate: deleteAgreement } = useDeleteAgreementMutation();

const rules: FormRules = {
  name: {
    required: true,
    message: 'Введите название договора',
  },
  date_start: {
    required: true,
    message: 'Выберите дату начала договора',
  },
  date_end: [
    {
      required: true,
      message: 'Выберите дату окончания договора',
    },
    {
      message: 'Дата окончания не может быть перед датой начала',
      validator(_rule, val) {
        if (formData.value.date_start) {
          return formData.value.date_start < val;
        }
        return true;
      },
    },
  ],
  renteeId: {
    required: true,
    message: 'Выберите арендатора',
  },
};
</script>

<template>
  <NModal
    class="manage-agreement-modal"
    :show="isOpened"
    @mask-click="isOpened = false"
    @esc="isOpened = false"
  >
    <NCard
      :title="agreement ? 'Редактирование договора' : 'Создание договора'"
      :content-style="{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }"
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
        <!--  Название  -->
        <NFormItem
          label="Название договора"
          path="name"
        >
          <NInput v-model:value="formData.name" />
        </NFormItem>

        <!--  Статус  -->
        <NFormItem
          label="Статус"
          label-placement="top"
          path="status"
          required
        >
          <NCheckbox v-model:checked="formData.status" />
          <span class="manage-agreement-modal__label-span">{{
            formData.status ? 'Договор актуален' : 'Договор расторгнут'
          }}</span>
        </NFormItem>

        <!--  Арендатор  -->
        <NFormItem
          label="Арендатор"
          path="renteeId"
        >
          <SelectRentees
            v-model:value="formData.renteeId"
            :style="{ width: '100%' }"
          />
        </NFormItem>

        <!--  Начало  -->
        <NFormItem
          label="Начало"
          path="date_start"
        >
          <NDatePicker
            clearable
            v-model:value="formData.date_start"
            format="dd MMMM yyyy"
          />
        </NFormItem>

        <!--  Конец  -->
        <NFormItem
          label="Конец"
          path="date_end"
        >
          <NDatePicker
            clearable
            v-model:value="formData.date_end"
            format="dd MMMM yyyy"
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

      <NButtonGroup class="manage-agreement-modal__buttons">
        <NButton
          type="success"
          @click="
            async () => {
              await submit();
              isOpened = isFormValidateError;
            }
          "
          >{{ agreement ? 'Сохранить' : 'Создать' }}
        </NButton>
        <NButton
          v-if="agreement"
          type="error"
          @click="
            () => {
              deleteAgreement({ id: agreement.id });
              isOpened = false;
            }
          "
          >Удалить
        </NButton>
        <NButton
          type="error"
          color="black"
          text-color="white"
          @click="isOpened = false"
          >Отменить
        </NButton>
      </NButtonGroup>
    </NCard>
  </NModal>
</template>

<style scoped lang="scss">
.manage-agreement-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  width: 500px;
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
