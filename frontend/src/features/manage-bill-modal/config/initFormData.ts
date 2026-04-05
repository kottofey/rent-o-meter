import { dayjs } from '@/shared/lib/dayjs';
import type { IBill } from '@/entities/bill';

export const initFormData: Partial<IBill> = {
  agreementId: null,
  bill_date: dayjs().valueOf(),
  month: null,

  extra_ammount: 0,
  ammount: undefined,

  status: false,
  comment: '',

  counterId: undefined,
  tarifs: [],
};
