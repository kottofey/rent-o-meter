import { dayjs } from '@/shared/lib/dayjs';

export const initFormData = {
  name: '',
  date_start: dayjs().valueOf(),
  date_end: dayjs().add(6, 'months').valueOf(),
  renteeId: undefined,
  status: true,
  comment: '',
};
