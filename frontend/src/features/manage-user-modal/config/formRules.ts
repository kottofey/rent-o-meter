import { type FormRules } from 'naive-ui';
import { type Ref } from 'vue';

import type { IUser } from '@/entities/user';

export const createFormRules = (
  formData: Ref<Partial<IUser> & { repeat_password?: string }>,
): FormRules => ({
  surname: {
    required: true,
    message: 'Введите фамилию',
  },
  firstname: {
    required: true,
    message: 'Введите имя',
  },
  email: {
    required: true,
    type: 'email',
    message: 'Неверный формат почты',
  },
  password: [
    {
      required: !formData.value.id,
      message: 'Введите пароль',
    },
    {
      message: 'Пароли не совпадают',
      validator(_rule, val) {
        if (formData.value.password && formData.value.repeat_password) {
          return val === formData.value.repeat_password;
        }
        return true;
      },
    },
  ],
  repeat_password: {
    required: !!formData.value.password,
    message: 'Введите пароль',
  },
});
