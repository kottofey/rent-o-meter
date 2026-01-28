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
} from 'naive-ui';
import { ref, toRef, unref } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';

import { useCountersModal } from '../lib/useCountersModal';

import { type ICounter, useCountersQueryClient } from '@/entities/counter';
import { SelectAgreements } from '@/widgets/select-agreements';
import { dayjs } from '@/shared/lib/dayjs';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const formRef = ref();
// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
const isOpened = defineModel('isOpened', { default: false });
const queryClient = useQueryClient();

const { counter = undefined } = defineProps<{
  counter?: ICounter;
}>();

const counterRef = toRef(() => counter);

const { formData, submit, isPending, isFormValidateError } = useCountersModal({
  initialData: counterRef,
  formRef: formRef,
});

const rules: FormRules = {
  month: {
    required: true,
    message: 'Обязательное поле',
  },
  date_start: {
    required: true,
    message: 'Обязательное поле',
  },
  date_end: [
    {
      required: true,
      message: 'Обязательное поле',
    },
    {
      message: 'Эта дата не может быть раньше начальной',
      validator: (_rule, value) => {
        return !(
          formData.value.date_start && formData.value.date_start > value
        );
      },
    },
  ],
  agreementId: {
    required: true,
    message: 'Обязательное поле',
  },
  counter_water: {
    required: true,
    message: 'Обязательное поле',
  },
  counter_electricity: {
    required: true,
    message: 'Обязательное поле',
  },
};

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------
const fetchPrevCounters = async ({
  currentMonth,
  agreementId,
}: {
  currentMonth?: number;
  agreementId?: number;
}) => {
  const prevCounters = await useCountersQueryClient({
    client: queryClient,
    scopes: {
      'counter:byAgreementId': agreementId,
      'counter:byMonth': dayjs(currentMonth)
        .startOf('month')
        .subtract(1, 'month')
        .format('YYYY-MM-DD'),
    },
  });

  if (prevCounters[0]) {
    formData.value.counter_prev_electricity =
      prevCounters[0].counter_electricity;
    formData.value.counter_prev_water = prevCounters[0].counter_water;
    formData.value.date_start = dayjs(prevCounters[0].date_end)
      .add(1, 'day')
      .valueOf();
  }
};
</script>

<template>
  <NModal
    :show="isOpened"
    @mask-click="isOpened = false"
    @esc="isOpened = false"
    @keyup.prevent.enter="
      async () => {
        await submit();
        isOpened = isFormValidateError;
      }
    "
  >
    <NCard
      class="manage-counter-modal"
      :title="counter ? 'Редактирование показаний' : 'Создание показаний'"
    >
      <NForm
        :disabled="isPending"
        :model="unref(formData)"
        ref="formRef"
        :rules="rules"
        @submit.prevent
        class="fields"
      >
        <NFormItem
          class="fields__item--grid-month"
          label="Месяц на оплату"
          path="month"
        >
          <NDatePicker
            type="month"
            month-format="LLLL"
            format="LLLL yyyy"
            :actions="['confirm']"
            close-on-select
            clearable
            v-model:value="formData.month"
            @update-value="
              async (val) => {
                formData.date_start = val;
                formData.date_end = val;

                if (formData?.agreementId) {
                  await fetchPrevCounters({
                    currentMonth: val,
                    agreementId: formData.agreementId,
                  });
                }
              }
            "
          />
        </NFormItem>

        <NFormItem
          class="fields__item--grid-start"
          label="От"
          path="date_start"
        >
          <NDatePicker
            close-on-select
            clearable
            format="dd MMMM yyyy"
            v-model:value="formData.date_start"
          />
        </NFormItem>

        <NFormItem
          class="fields__item--grid-end"
          label="До"
          path="date_end"
        >
          <NDatePicker
            close-on-select
            format="dd MMMM yyyy"
            clearable
            v-model:value="formData.date_end"
          />
        </NFormItem>

        <NFormItem
          class="fields__item--grid-agreement"
          label="Арендатор"
          path="agreementId"
        >
          <SelectAgreements
            v-model:value="formData.agreementId"
            label-by="rentee"
            placeholder="Выберите арендатора"
            withActiveAgreements
            @update:value="
              async (val) => {
                if (formData?.month) {
                  await fetchPrevCounters({
                    currentMonth: formData.month,
                    agreementId: val,
                  });
                }
              }
            "
          />
        </NFormItem>

        <!--  Показания  -->
        <NFormItem
          class="fields__item--grid-water-prev"
          label="Прошлые показания вода"
          path="counter_water_prev"
        >
          <NInputNumber
            v-model:value="formData.counter_prev_water"
            :show-button="false"
          />
        </NFormItem>

        <NFormItem
          class="fields__item--grid-water"
          label="Показания вода"
          path="counter_water"
        >
          <NInputNumber
            v-model:value="formData.counter_water"
            :show-button="false"
          />
        </NFormItem>

        <NFormItem
          class="fields__item--grid-elec"
          label="Показания свет"
          path="counter_electricity"
        >
          <NInputNumber
            v-model:value="formData.counter_electricity"
            :show-button="false"
          />
        </NFormItem>

        <NFormItem
          class="fields__item--grid-elec-prev"
          label="Прошлые показания свет"
          path="counter_electricity_prev"
        >
          <NInputNumber
            v-model:value="formData.counter_prev_electricity"
            :show-button="false"
          />
        </NFormItem>

        <!--  Комментарий  -->
        <NFormItem
          class="fields__item--grid-comment"
          label="Комментарий"
          path="comment"
        >
          <NInput
            type="textarea"
            rows="5"
            v-model:value="formData.comment"
          />
        </NFormItem>
      </NForm>

      <NButtonGroup class="manage-counter-modal__buttons">
        <NButton
          type="success"
          @click="
            async () => {
              await submit();
              isOpened = isFormValidateError;
            }
          "
          >{{ counter ? 'Сохранить' : 'Создать' }}
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
.manage-counter-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: auto;
  max-width: 1000px;
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
  display: grid;
  column-gap: 20px;

  grid-template-areas:
    'agreement agreement agreement'
    'month start end'
    'waterprev water comment'
    'elecprev elec comment';

  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);

  &__item {
    &--grid-month {
      grid-area: month;
    }

    &--grid-start {
      grid-area: start;
    }

    &--grid-end {
      grid-area: end;
    }

    &--grid-water-prev {
      grid-area: waterprev;
    }
    &--grid-water {
      grid-area: water;
    }

    &--grid-elec-prev {
      grid-area: elecprev;
    }
    &--grid-elec {
      grid-area: elec;
    }

    &--grid-agreement {
      grid-area: agreement;
    }

    &--grid-comment {
      grid-area: comment;
    }
  }
}
</style>
