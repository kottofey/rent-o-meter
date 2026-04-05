import type { FormRules } from 'naive-ui';
import type { Ref } from 'vue';

import type { IBill } from '@/entities/bill';

export const createFormRules = (formData: Ref<Partial<IBill>>): FormRules => ({
  agreementId: {
    required: true,
    message: 'Выберите арендатора',
  },

  bill_date: {
    required: true,
    message: 'Выберите дату начала договора',
  },

  ammount: [
    {
      required: !formData.value.month,
      message: 'Введите сумму',
    },
    {
      message: 'Отсутствуют показания счетчиков за выбранный месяц',
      validator: (_rule, value?: number) => {
        if (formData.value.month) {
          return !!value && value !== 0;
        }
      },
    },
  ],
});
