import type { FormRules } from 'naive-ui';

export const rules: FormRules = {
  date: {
    required: true,
    message: 'Выберите дату оплаты',
  },
  bill_id: {
    required: true,
    message: 'Выберите арендатора и счет, который оплачивается',
  },

  ammount: {
    message: 'Сумма должна быть больше нуля',
    validator(_rule, val) {
      return val !== null && val > 0;
    },
  },
};
