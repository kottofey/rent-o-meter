<script setup lang="ts">
import {
  type FormInst,
  NButton,
  NButtonGroup,
  NCard,
  NCheckbox,
  NForm,
  NFormItem,
  NInput,
  NModal,
} from 'naive-ui';
import { computed, ref, toRef, watch } from 'vue';

import { createFormRules, initFormData } from '../config';

import {
  type IUser,
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useRestoreUserMutation,
} from '@/entities/user';
import { SelectRentees } from '@/widgets/select-rentees';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const formRef = ref<FormInst | null>();
const formData = ref<Partial<IUser> & { repeat_password?: string }>({
  ...initFormData,
});

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const isOpened = defineModel('isOpened', { default: false });

const { user } = defineProps<{
  user?: IUser;
}>();

const { mutate: deleteUser, isPending: isDeletePending } =
  useDeleteUserMutation();
const { mutate: restoreUser, isPending: isRestorePending } =
  useRestoreUserMutation();
const { mutate: createUser, isPending: isCreatePending } =
  useCreateUserMutation();
const { mutate: editUser, isPending: isEditPending } = useEditUserMutation();

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
        delete formData.value.repeat_password;
        delete formData.value.full_name;
        delete formData.value.last_login;
        delete formData.value.deletedAt;

        if (user) {
          editUser({
            id: user.id,
            updatedUser: formData.value,
          });
        } else {
          createUser({
            user: formData.value,
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
watch([() => user, isOpened], () => {
  formData.value = { ...user };

  // Удаляем виртуальные поля
  delete formData.value.full_name;
  delete formData.value.repeat_password;
});
</script>

<template>
  <NModal
    :show="isOpened"
    @mask-click="isOpened = false"
    @esc="isOpened = false"
  >
    <NCard
      class="manage-user-modal"
      :title="user ? 'Редактирование пользователя' : 'Создание пользователя'"
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

        <NFormItem
          label="Арендатор"
          path="rentee_id"
        >
          <SelectRentees v-model:value="formData.rentee_id" />
        </NFormItem>

        <!--  Почта  и пароль  -->

        <NFormItem
          label="Почта"
          path="email"
        >
          <NInput v-model:value="formData.email" />
        </NFormItem>

        <NFormItem
          label="Пароль"
          path="password"
        >
          <NInput v-model:value="formData.password" />
        </NFormItem>

        <NFormItem
          label="Еще раз пароль"
          path="repeat_password"
        >
          <NInput v-model:value="formData.repeat_password" />
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

      <NButtonGroup class="manage-user-modal__buttons">
        <NButton
          type="success"
          @click="
            async () => {
              await onSubmit();
            }
          "
          >{{ user ? 'Сохранить' : 'Создать' }}
        </NButton>

        <NButton
          v-if="user"
          type="error"
          @click="
            () => {
              if (user.deletedAt === null) {
                deleteUser({ id: user.id });
              } else {
                restoreUser({ id: user.id });
              }
              isOpened = false;
            }
          "
        >
          {{ user.deletedAt === null ? 'Удалить' : 'Восстановить' }}
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
.manage-user-modal {
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
