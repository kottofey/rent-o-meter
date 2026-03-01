import { type FormRules } from 'naive-ui';
import { type Ref } from 'vue';

import type { IRentee } from '@/entities/rentee';

export const createFormRules = (
  formData: Ref<Partial<IRentee>>,
): FormRules => ({
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
});
