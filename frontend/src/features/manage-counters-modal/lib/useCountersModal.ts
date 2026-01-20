import { isRef, type MaybeRef, type Ref, ref, toRef, unref, watch } from 'vue';
import { type FormInst } from 'naive-ui';

import { type ICounter } from '@/entities/counter';
import {
  useCreateCounterMutation,
  useEditCounterMutation,
} from '@/entities/counter';

export function useCountersModal({
  initialData,
  formRef,
}: {
  initialData: MaybeRef<Partial<ICounter> | undefined>;
  formRef: Ref<FormInst | null>;
}) {
  const isFormValidateError = ref(false);

  const initState = {
    month: undefined,
    date_start: undefined,
    date_end: undefined,

    counter_water: undefined,
    counter_prev_water: undefined,

    counter_electricity: undefined,
    counter_prev_electricity: undefined,

    comment: '',

    agreementId: undefined,
  };

  // Init form data
  const formData = ref<Partial<ICounter>>({ ...initState });

  watch(
    () => unref(initialData),
    (counter) => {
      if (counter !== undefined && counter.agreement !== undefined) {
        formData.value = {
          month: counter.month,
          date_start: counter.date_start,
          date_end: counter.date_end,
          agreementId: counter.agreement.id,

          counter_water: counter.counter_water,
          counter_prev_water: counter.counter_prev_water,

          counter_electricity: counter.counter_electricity,
          counter_prev_electricity: counter.counter_prev_electricity,

          comment: counter.comment,
        };
      } else {
        // Сброс при создании нового
        formData.value = { ...initState };
      }
    },
  );

  const {
    mutate: createCounter,
    isPending: isCreatePending,
    error: createError,
  } = useCreateCounterMutation();
  const {
    mutate: editCounter,
    isPending: isEditPending,
    error: editError,
  } = useEditCounterMutation();

  const submit = async () => {
    // можно добавить валидацию
    try {
      await formRef.value?.validate((errors) => {
        isFormValidateError.value = false;

        if (!errors) {
          if (isRef(initialData) && initialData.value) {
            editCounter({
              id: initialData.value.id!,
              updatedCounter: formData.value,
            });
          } else {
            createCounter({
              counter: formData.value,
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
