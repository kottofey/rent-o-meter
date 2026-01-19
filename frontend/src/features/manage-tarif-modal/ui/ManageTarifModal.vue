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

import { useTarifModal } from '../lib/useTarifModal';

import { ITarif } from '@/entities/tarif';

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

const { formData, submit, isPending, isFormValidateError } = useTarifModal({
  initialData: tarifRef,
  formRef: formRef,
});

const rules: FormRules = {
  actual_from: {
    required: true,
    message: 'Обязательное поле',
  },
  water: {
    required: true,
    message: 'Обязательное поле',
  },
  electricity: {
    required: true,
    message: 'Обязательное поле',
  },
  heat: {
    required: true,
    message: 'Обязательное поле',
  },
  gas: {
    required: true,
    message: 'Обязательное поле',
  },
  renovation: {
    required: true,
    message: 'Обязательное поле',
  },
  tko: {
    required: true,
    message: 'Обязательное поле',
  },
  managing_company: {
    required: true,
    message: 'Обязательное поле',
  },
  domofon: {
    required: true,
    message: 'Обязательное поле',
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
          <div class="fields__group">
            <NFormItem
              label="Актуально с"
              path="actual_from"
            >
              <NDatePicker v-model:value="formData.actual_from" />
            </NFormItem>

            <NFormItem
              label="Вода"
              path="water"
            >
              <NInputNumber
                v-model:value="formData.water"
                :show-button="false"
              />
            </NFormItem>

            <NFormItem
              label="Электричество"
              path="electricity"
            >
              <NInputNumber
                v-model:value="formData.electricity"
                :show-button="false"
              />
            </NFormItem>

            <NFormItem
              label="Тепло"
              path="heat"
            >
              <NInputNumber
                v-model:value="formData.heat"
                :show-button="false"
              />
            </NFormItem>
          </div>

          <div class="fields__group">
            <NFormItem
              label="Газ"
              path="gas"
            >
              <NInputNumber
                v-model:value="formData.gas"
                :show-button="false"
              />
            </NFormItem>
            <NFormItem
              label="Капремонт"
              path="renovation"
            >
              <NInputNumber
                v-model:value="formData.renovation"
                :show-button="false"
              />
            </NFormItem>

            <NFormItem
              label="ТКО"
              path="tko"
            >
              <NInputNumber
                v-model:value="formData.tko"
                :show-button="false"
              />
            </NFormItem>
          </div>

          <div class="fields__group">
            <NFormItem
              label="УК (квартплата)"
              path="managing_company"
            >
              <NInputNumber
                v-model:value="formData.managing_company"
                :show-button="false"
              />
            </NFormItem>

            <NFormItem
              label="Домофон"
              path="domofon"
            >
              <NInputNumber
                v-model:value="formData.domofon"
                :show-button="false"
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
  min-height: 500px;
  max-width: 800px;
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
