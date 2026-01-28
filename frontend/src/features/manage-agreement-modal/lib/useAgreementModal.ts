import { isRef, type MaybeRef, type Ref, ref, toRef, unref, watch } from 'vue';
import { type FormInst } from 'naive-ui';

import { type IAgreement } from '@/entities/agreement';
import {
  useCreateAgreementMutation,
  useEditAgreementMutation,
} from '@/entities/agreement';
import { dayjs } from '@/shared/lib/dayjs';

export function useAgreementModal({
  initialData,
  formRef,
}: {
  initialData: MaybeRef<Partial<IAgreement> | undefined>;
  formRef: Ref<FormInst | null>;
}) {
  const isFormValidateError = ref(false);

  const initState = {
    name: '',
    date_start: dayjs().valueOf(),
    date_end: dayjs().add(6, 'months').valueOf(),
    renteeId: undefined,
    status: true,
    comment: '',
  };

  // Init form data
  const formData = ref<Partial<IAgreement>>({ ...initState });

  watch(
    () => unref(initialData),
    (agreement) => {
      if (agreement) {
        formData.value = {
          name: agreement.name,
          date_start: agreement.date_start,
          date_end: agreement.date_end,
          renteeId: agreement.renteeId,
          status: agreement.status,
          comment: agreement.comment,
        };
      } else {
        // Сброс при создании нового
        formData.value = { ...initState };
      }
    },
  );

  const {
    mutate: createAgreement,
    isPending: isCreatePending,
    error: createError,
  } = useCreateAgreementMutation();

  const {
    mutate: editAgreement,
    isPending: isEditPending,
    error: editError,
  } = useEditAgreementMutation();

  const submit = async () => {
    try {
      await formRef.value?.validate((errors) => {
        isFormValidateError.value = false;

        if (!errors) {
          if (isRef(initialData) && initialData.value) {
            editAgreement({
              id: initialData.value.id!,
              updatedAgreement: formData.value,
            });
          } else {
            createAgreement({
              agreement: formData.value,
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
