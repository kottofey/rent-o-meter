import {
  isRef,
  type MaybeRef,
  type Ref,
  ref,
  toRef,
  toValue,
  watch,
} from 'vue';
import { type FormInst } from 'naive-ui';
import { useQueryClient } from '@tanstack/vue-query';

import { calculateAmmount } from './calculateAmmount';

import { type IBill } from '@/entities/bill';
import { useCreateBillMutation, useEditBillMutation } from '@/entities/bill';
import { dayjs } from '@/shared/lib/dayjs';
import { useTarifQueryClient } from '@/entities/tarif';
import { useCountersQueryClient } from '@/entities/counter';

export function useBillModal({
  initialData,
  formRef,
}: {
  initialData: MaybeRef<Partial<IBill> | undefined>;
  formRef: Ref<FormInst | null>;
}) {
  const queryClient = useQueryClient();

  const isFormValidateError = ref(false);

  const initState: Partial<IBill> = {
    status: false,
    bill_date: dayjs().valueOf(),
    month: dayjs().startOf('month').valueOf(),

    extra_ammount: 0,
    ammount_paid: 0,

    agreementId: undefined,
    counterId: undefined,

    tarifs: [],
    comment: '',
  };

  // Init form data
  const formData = ref<Partial<IBill>>({ ...initState });

  watch(
    () => toValue(initialData),
    (bill) => {
      if (bill) {
        formData.value = {
          status: bill.status,
          bill_date: bill.bill_date,
          month: bill.month,

          ammount: bill.ammount,
          extra_ammount: bill.extra_ammount,
          ammount_paid: bill.ammount_paid,

          comment: bill.comment,

          agreementId: bill.agreementId,
          // tarifId: bill.tarifId,
          // counterId: bill.counterId,
        };
      } else {
        // Сброс при создании нового
        formData.value = { ...initState };
      }
    },
  );

  const {
    mutate: createBill,
    isPending: isCreatePending,
    error: createError,
  } = useCreateBillMutation();
  const {
    mutate: editBill,
    isPending: isEditPending,
    error: editError,
  } = useEditBillMutation();

  const submit = async () => {
    try {
      await formRef.value?.validate(async (errors) => {
        isFormValidateError.value = false;

        if (!errors) {
          // -----------------------------------------------------------------------------
          // Вычисляем актуальные счетчики и тарифы
          // -----------------------------------------------------------------------------

          const actualCounters = await useCountersQueryClient({
            client: queryClient,
            scopes: {
              'counter:byMonth': dayjs(formData.value.month).format(
                'YYYY-MM-DD',
              ),
              'counter:byAgreementId': formData.value.agreementId,
            },
          });

          if (actualCounters.length > 1) {
            throw new Error('More than one counter exist, check counters!');
          }

          if (actualCounters[0]) {
            const actualTarifs = await useTarifQueryClient({
              client: queryClient,
              scopes: {
                'tarif:actualBetween': {
                  dateStart: dayjs(actualCounters[0].date_start).format(
                    'YYYY-MM-DD',
                  ),
                  dateEnd: dayjs(actualCounters[0].date_end).format(
                    'YYYY-MM-DD',
                  ),
                },
              },
            });

            formData.value = {
              ...formData.value,

              counterId: actualCounters[0].id,
              tarifs: actualTarifs,
            };

            formData.value.ammount = calculateAmmount({
              tarifs: actualTarifs,
              counter: actualCounters[0],
            }).total;
          }

          // -----------------------------------------------------------------------------
          // Выполняем сабмит
          // -----------------------------------------------------------------------------

          if (isRef(initialData) && initialData.value) {
            editBill({
              id: initialData.value.id!,
              updatedBill: formData.value,
            });
          } else {
            createBill({
              bill: formData.value,
            });
          }
        }
      });
    } catch (errors) {
      isFormValidateError.value = true;
      console.error('Ошибка валидации', JSON.stringify(errors, null, 2));
    }
  };

  return {
    formData: toRef(formData),
    submit,

    isPending: initialData ? isCreatePending : isEditPending,
    error: initialData ? createError : editError,
    isFormValidateError,
  };
}
