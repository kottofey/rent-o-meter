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
  NModal,
} from 'naive-ui';
import { computed, ref, toRef, watch } from 'vue';

import { createFormRules, initFormData } from '../config';

import {
  type IRentee,
  useCreateRenteeMutation,
  useDeleteRenteeMutation,
  useEditRenteeMutation,
  useRestoreRenteeMutation,
} from '@/entities/rentee';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const formRef = ref<FormInst | null>();
const formData = ref<Partial<IRentee>>({ ...initFormData });

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const isOpened = defineModel('isOpened', { default: false });

const { rentee } = defineProps<{
  rentee?: IRentee;
}>();

const { mutate: deleteRentee, isPending: isDeletePending } =
  useDeleteRenteeMutation();
const { mutate: restoreRentee, isPending: isRestorePending } =
  useRestoreRenteeMutation();
const { mutate: createRentee, isPending: isCreatePending } =
  useCreateRenteeMutation();
const { mutate: editRentee, isPending: isEditPending } =
  useEditRenteeMutation();

// -----------------------------------------------------------------------------
// Computed
// -----------------------------------------------------------------------------

const isPending = computed(
  () =>
    isCreatePending.value ||
    isDeletePending.value ||
    isRestorePending.value ||
    isEditPending.value,
);

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

const onSubmit = async () => {
  try {
    await formRef.value?.validate((errors) => {
      if (!errors) {
        if (rentee) {
          editRentee({
            id: rentee.id,
            updatedRentee: formData.value,
          });
        } else {
          createRentee({
            rentee: formData.value,
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

const checkActiveAgreements = () => {
  if (rentee) {
    return !!rentee.agreements?.find((agreement) => agreement.status);
  }
};

const clearForm = () => {
  formData.value = { ...initFormData };
};

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------
watch([() => rentee, isOpened], () => {
  formData.value = { ...rentee };

  // Удаляем виртуальные поля
  delete formData.value.fullName;
});
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
        :model="formData"
        ref="formRef"
        :rules="createFormRules(toRef(formData))"
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
        >
          Отменить
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
