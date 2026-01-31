<script setup lang="ts">
import {
  FormRules,
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
import { ref, toRef, unref } from 'vue';

import { useTarifModal } from '../lib/useTarifModal';

import { ITarif } from '@/entities/tarif';
import { parseMoney, parseNumber } from '@/shared/lib';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const formRef = ref();

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
const isOpened = defineModel('isOpened', { default: false });

const { tarif = undefined } = defineProps<{
  tarif?: ITarif;
}>();

const tarifRef = toRef(() => tarif);

const { formData, submit, deleteTarif, isPending, isFormValidateError } =
  useTarifModal({
    initialData: tarifRef,
    formRef: formRef,
  });

const rules: FormRules = {
  tarif_type: {
    required: true,
    message: 'Обязательное поле',
  },
  rate: {
    required: true,
    message: 'Обязательное поле',
  },
  valid_from: {
    required: true,
    message: 'Обязательное поле',
  },
};

// -----------------------------------------------------------------------------
// Form Setup
// -----------------------------------------------------------------------------

const tarifTypeOptions = [
  { value: 'electricity', label: 'Свет (до 150кВт)' },
  { value: 'electricity_over_150kw', label: 'Свет (сверх 150кВт)' },
  { value: 'water_in', label: 'Подведение воды' },
  { value: 'water_out', label: 'Отведение воды' },
  { value: 'heat', label: 'Тепло' },
  { value: 'gas', label: 'Газ' },
  { value: 'renovation', label: 'Капремонт' },
  { value: 'tko', label: 'ТКО' },
  { value: 'managing_company', label: 'УК (квартплата)' },
  { value: 'domofon', label: 'Домофон' },
];
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
        :model="unref(formData)"
        ref="formRef"
        :rules="rules"
        @submit.prevent
        @keydown.prevent.stop.enter="
          async () => {
            await submit();
            isOpened = isFormValidateError;
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
              await submit();
              isOpened = isFormValidateError;
            }
          "
          >{{ tarif ? 'Сохранить' : 'Создать' }}
        </NButton>
        <NButton
          type="error"
          @click="
            () => {
              if (tarifRef) {
                isOpened = false;
                deleteTarif({ id: tarifRef.id });
              }
            }
          "
          >Удалить
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
