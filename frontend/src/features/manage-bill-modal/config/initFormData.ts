import { dayjs } from '@/shared/lib/dayjs';

export const initFormData = {
  agreementId: null,
  bill_date: dayjs().valueOf(),
  month: dayjs().startOf('month').valueOf(),

  extra_ammount: 0,
  ammount_paid: 0,

  status: false,
  comment: '',

  counterId: undefined,
  tarifs: [],
};
