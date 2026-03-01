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
import { computed, ref, watch } from 'vue';

import { createFormRules, tarifTypeOptions, initFormData } from '../config';

import {
  type ITarif,
  useCreateTarifMutation,
  useDeleteTarifMutation,
  useEditTarifMutation,
  useRestoreTarifMutation,
} from '@/entities/tarif';
import { parseMoney, parseNumber } from '@/shared/lib';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const formRef = ref<FormInst | null>();
const formData = ref<Partial<ITarif>>({ ...initFormData });

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const isOpened = defineModel('isOpened', { default: false });

const { tarif } = defineProps<{
  tarif?: ITarif;
}>();

const { mutate: createTarif, isPending: isCreatePending } =
  useCreateTarifMutation();
const { mutate: editTarif, isPending: isEditPending } = useEditTarifMutation();

const { mutate: deleteTarif, isPending: isDeletePending } =
  useDeleteTarifMutation();
const { mutate: restoreTarif, isPending: isRestorePending } =
  useRestoreTarifMutation();

// -----------------------------------------------------------------------------
// Computed
// -----------------------------------------------------------------------------

const isPending = computed(
  () =>
    isCreatePending.value ||
    isDeletePending.value ||
    isEditPending.value ||
    isRestorePending.value,
);

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

const onSubmit = async () => {
  try {
    await formRef.value?.validate((errors) => {
      if (!errors) {
        if (tarif) {
          editTarif({
            id: tarif.id,
            updatedTarif: formData.value,
          });
        } else {
          createTarif({
            tarif: formData.value,
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
watch([() => tarif, isOpened], () => {
  formData.value = { ...tarif };
});
</script>

<template>
  <NModal
    :show="isOpened"
    @mask-click="isOpened = false"
    @esc="isOpened = false"
  >
    <NCard
      class="manage-tarif-modal"
      :title="tarif ? 'Редактирование тарифа' : 'Создание тарифа'"
    >
      <NForm
        :disabled="isPending"
        :model="formData"
        ref="formRef"
        :rules="createFormRules()"
        @submit.prevent
        @keydown.prevent.stop.enter="
          async () => {
            await onSubmit();
          }
        "
      >
        <div class="fields">
          <NFormItem
            label="Тип тарифа"
            path="tarif_type"
          >
            <NSelect
              v-model:value="formData.tarif_type"
              :options="tarifTypeOptions"
            />
          </NFormItem>

          <div class="fields__group">
            <NFormItem
              label="Тариф"
              path="rate"
            >
              <NInputNumber
                v-model:value="formData.rate"
                :show-button="false"
                :parse="(value) => parseNumber(value)"
                :format="
                  (val) =>
                    val ? parseMoney({ ammount: val, mode: 'rubbles' }) : ''
                "
              />
            </NFormItem>
            <NFormItem
              label="Актуально с"
              path="valid_from"
            >
              <NDatePicker
                v-model:value="formData.valid_from"
                format="dd MMMM yyyy"
              />
            </NFormItem>

            <NFormItem
              label="Актуально по"
              path="valid_to"
            >
              <NDatePicker
                v-model:value="formData.valid_to"
                clearable
                format="dd MMMM yyyy"
              />
            </NFormItem>
          </div>
        </div>

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

      <NButtonGroup class="manage-tarif-modal__buttons">
        <NButton
          type="success"
          @click="
            async () => {
              await onSubmit();
            }
          "
          >{{ tarif ? 'Сохранить' : 'Создать' }}
        </NButton>

        <NButton
          v-if="tarif"
          type="error"
          @click="
            () => {
              if (tarif.deletedAt === null) {
                deleteTarif({ id: tarif.id });
              } else {
                restoreTarif({ id: tarif.id });
              }
              isOpened = false;
            }
          "
        >
          {{ tarif.deletedAt === null ? 'Удалить' : 'Восстановить' }}
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
.manage-tarif-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  padding: 10px;
  border-radius: 12px;

  &__buttons {
    display: flex;
    justify-content: center;
  }

  &__label-span {
    margin-left: 10px;
  }
}

.fields {
  display: flex;
  flex-direction: column;
  width: 100%;

  &__group {
    display: flex;
    flex-direction: row;
    column-gap: 20px;
  }
}
</style>
