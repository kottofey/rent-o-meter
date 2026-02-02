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

import { useRenteeModal } from '../lib/useRenteeModal';

import {
  type IRentee,
  useDeleteRenteeMutation,
  useRestoreRenteeMutation,
} from '@/entities/rentee';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const formRef = ref();

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
const isOpened = defineModel('isOpened', { default: false });

const { rentee = undefined } = defineProps<{
  rentee?: IRentee;
}>();

const renteeRef = toRef(() => rentee);

const {
  formData,
  checkActiveAgreements,
  isPending,
  submit,
  isFormValidateError,
} = useRenteeModal({
  initialData: renteeRef,
  formRef: formRef,
});

const { mutate: deleteRentee } = useDeleteRenteeMutation();
const { mutate: restoreRentee } = useRestoreRenteeMutation();

// -----------------------------------------------------------------------------
// Form setup
// -----------------------------------------------------------------------------

const rules: FormRules = {
  surname: {
    required: true,
    message: 'Введите фамилию',
  },
  firstname: {
    required: true,
    message: 'Введите имя',
  },
  patronymic: {
    required: true,
    message: 'Введите отчество',
  },
  date_start: {
    required: true,
    message: 'Введите дату начала',
  },
  date_end: {
    message: 'Дата окончания не может быть перед датой начала',
    validator(_rule, val) {
      if (formData.value.date_start && formData.value.date_end) {
        return formData.value.date_start < val;
      }
      return true;
    },
  },
};

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

const onSubmit = async () => {
  await submit();
  isOpened.value = isFormValidateError.value;
};
</script>

<template>
  <NModal
    :show="isOpened"
    @mask-click="isOpened = false"
    @esc="isOpened = false"
  >
    <NCard
      class="manage-rentee-modal"
      :title="rentee ? 'Редактирование арендатора' : 'Создание арендатора'"
    >
      <NForm
        :disabled="isPending"
        :model="unref(formData)"
        ref="formRef"
        :rules="rules"
        @submit.prevent
        @keyup.prevent.enter="
          async () => {
            await onSubmit();
          }
        "
      >
        <!--  ФИО  -->
        <NFormItem
          label="Фамилия"
          path="surname"
        >
          <NInput v-model:value="formData.surname" />
        </NFormItem>
        <NFormItem
          label="Имя"
          path="firstname"
        >
          <NInput v-model:value="formData.firstname" />
        </NFormItem>
        <NFormItem
          label="Отчество"
          path="patronymic"
        >
          <NInput v-model:value="formData.patronymic" />
        </NFormItem>

        <!--  Телефон  -->

        <NFormItem
          label="Телефон"
          path="phone"
        >
          <NInput v-model:value="formData.phone" />
        </NFormItem>

        <!--  Почта  -->

        <NFormItem
          label="Почта"
          path="email"
        >
          <NInput v-model:value="formData.email" />
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
            :label="formData.status ? 'Активный' : 'Неактивный'"
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

      <NButtonGroup class="manage-rentee-modal__buttons">
        <NButton
          type="success"
          @click="
            async () => {
              await onSubmit();
            }
          "
          >{{ rentee ? 'Сохранить' : 'Создать' }}
        </NButton>

        <NButton
          v-if="rentee"
          :disabled="checkActiveAgreements()"
          type="error"
          @click="
            () => {
              if (rentee.deletedAt === null) {
                deleteRentee({ id: rentee.id });
              } else {
                restoreRentee({ id: rentee.id });
              }
              isOpened = false;
            }
          "
        >
          {{ rentee.deletedAt === null ? 'Удалить' : 'Восстановить' }}
        </NButton>
        <NButton
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
.manage-rentee-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  width: 400px;
  border-radius: 12px;

  &__buttons {
    display: flex;
    justify-content: center;
  }
}
</style>
