import { type FormRules } from 'naive-ui';
import { type Ref } from 'vue';

import type { IAgreement } from '@/entities/agreement';

export const createFormRules = (
  formData: Ref<Partial<IAgreement>>,
): FormRules => ({
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
      },
    },
  ],
  renteeId: {
    required: true,
    message: 'Выберите арендатора',
  },
});
