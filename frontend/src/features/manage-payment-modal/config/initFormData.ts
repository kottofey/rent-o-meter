import { dayjs } from '@/shared/lib/dayjs';

export const initFormData = {
  date: dayjs().valueOf(),

  rentee_id: undefined,

  bill_id: undefined,
  ammount: 0,
  ammount_remain: undefined,

  comment: '',
};
