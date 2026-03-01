import { type FormRules } from 'naive-ui';
import { type Ref } from 'vue';

import { type ICounter } from '@/entities/counter';

export const createFormRules = (
  formData: Ref<Partial<ICounter>>,
): FormRules => ({
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
});
