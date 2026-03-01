import { type FormRules } from 'naive-ui';

export const createFormRules = (): FormRules => ({
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
});
