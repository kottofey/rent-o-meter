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

import { initFormData, createFormRules } from '../config';

import {
  type IAgreement,
  useCreateAgreementMutation,
  useDeleteAgreementMutation,
  useEditAgreementMutation,
  useRestoreAgreementMutation,
} from '@/entities/agreement';
import { SelectRentees } from '@/widgets/select-rentees';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const formRef = ref<FormInst | null>();
const formData = ref<Partial<IAgreement>>({ ...initFormData });

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
const isOpened = defineModel('isOpened', { default: false });

const { agreement } = defineProps<{
  agreement?: IAgreement;
}>();

const { mutate: deleteAgreement, isPending: isDeletePending } =
  useDeleteAgreementMutation();
const { mutate: restoreAgreement, isPending: isRestorePending } =
  useRestoreAgreementMutation();
const { mutate: createAgreement, isPending: isCreatePending } =
  useCreateAgreementMutation();

const { mutate: editAgreement, isPending: isEditPending } =
  useEditAgreementMutation();

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
        if (agreement) {
          editAgreement({
            id: agreement.id,
            updatedAgreement: formData.value,
          });
        } else {
          createAgreement({
            agreement: formData.value,
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
watch([() => agreement, isOpened], () => {
  formData.value = { ...agreement };
});
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
          <NCheckbox
            v-model:checked="formData.status"
            :label="formData.status ? 'Договор актуален' : 'Договор расторгнут'"
          />
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
              await onSubmit();
            }
          "
        >
          {{ agreement ? 'Сохранить' : 'Создать' }}
        </NButton>
        <NButton
          v-if="agreement"
          type="error"
          @click="
            () => {
              if (agreement.deletedAt === null) {
                deleteAgreement({ id: agreement.id });
              } else {
                restoreAgreement({ id: agreement.id });
              }
              isOpened = false;
            }
          "
        >
          {{ agreement.deletedAt === null ? 'Удалить' : 'Восстановить' }}
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
