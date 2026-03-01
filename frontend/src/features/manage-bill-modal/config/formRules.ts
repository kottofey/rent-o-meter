import type { FormRules } from 'naive-ui';

export const rules: FormRules = {
  month: {
    required: true,
    message: 'Введите название договора',
  },
  bill_date: {
    required: true,
    message: 'Выберите дату начала договора',
  },

  agreementId: {
    required: true,
    message: 'Выберите арендатора',
  },

  ammount_paid: {
    message: 'Не может быть null',
    validator(_rule, val) {
      return val !== null;
    },
  },
};
