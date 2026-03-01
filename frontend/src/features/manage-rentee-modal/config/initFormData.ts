import { dayjs } from '@/shared/lib/dayjs';

export const initFormData = {
  surname: '',
  firstname: '',
  patronymic: '',
  phone: '',
  email: '',
  status: true,
  date_start: dayjs().valueOf(),
  date_end: undefined,
  comment: '',
};
