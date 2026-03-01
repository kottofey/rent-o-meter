import { dayjs } from '@/shared/lib/dayjs';

export const initFormData = {
  tarif_type: undefined,
  rate: undefined,
  valid_from: dayjs().valueOf(),
  valid_to: dayjs().valueOf(),
  comment: '',
};
