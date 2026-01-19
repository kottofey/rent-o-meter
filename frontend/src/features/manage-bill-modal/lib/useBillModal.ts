import {
  isRef,
  type MaybeRef,
  type Ref,
  ref,
  toRef,
  unref,
  watch,
  computed,
} from 'vue';
import { type FormInst } from 'naive-ui';
import { useQueryClient } from '@tanstack/vue-query';

import { type IBill } from '@/entities/bill';
import { useCreateBillMutation, useEditBillMutation } from '@/entities/bill';
import { dayjs } from '@/shared/lib/dayjs';
import { useTarifQueryClient } from '@/entities/tarif';
import { useCounterQueryClient, useCountersQuery } from '@/entities/counter';
import { getAllTarifs } from '@/entities/tarif/model/tarif-api';

export function useBillModal({
  initialData,
  formRef,
}: {
  initialData: MaybeRef<Partial<IBill> | undefined>;
  formRef: Ref<FormInst | null>;
}) {
  const isFormValidateError = ref(false);

  const initState = {
    agreementId: undefined,
    bill_date: dayjs().valueOf(),
    month: dayjs().startOf('month').valueOf(),

    status: false,

    comment: '',
  };

  // Init form data
  const formData = ref<Partial<IBill>>({ ...initState });

  watch(
    () => unref(initialData),
    (bill) => {
      if (bill) {
        formData.value = {
          agreementId: bill.agreementId,
          bill_date: bill.bill_date,
          month: bill.month,

          status: bill.status,

          comment: bill.comment,
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

  // const { data: actualTarif, refetch: fetchActualTarif } = useTarifsQuery({
  //   scopes: {
  //     actualFrom: dayjs(formData.value.bill_date).format('YYYY-MM-DD'),
  //   },
  //   isDisabled: true,
  // });
  //
  // const { data: counter, refetch: fetchCounter } = useCountersQuery({
  //   scopes: {
  //     byMonth: dayjs(formData.value.month).format('YYYY-MM-DD'),
  //     byAgreementId: formData.value.agreementId,
  //   },
  //   isDisabled: true,
  // });
  const queryClient = useQueryClient();

  const submit = async () => {
    // можно добавить валидацию
    try {
      await formRef.value?.validate(async (errors) => {
        isFormValidateError.value = false;

        if (!errors) {
          // Вычисляем актуальный тариф и показания за указанный месяц

          const actualTarif = await useTarifQueryClient({
            client: queryClient,
            scopes: {
              actualFrom: dayjs(formData.value.bill_date).format('YYYY-MM-DD'),
            },
          });

          const actualCounters = await useCounterQueryClient({
            client: queryClient,
            scopes: {
              byMonth: dayjs(formData.value.month).format('YYYY-MM-DD'),
              byAgreementId: formData.value.agreementId,
            },
          });

          formData.value = {
            ...formData.value,
            ammount: 2000,
            extra_ammount: 100,
            counterId: actualCounters[0]?.id,
            tarifId: actualTarif[0]?.id,
          };

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

          formData.value = { ...initState };
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
