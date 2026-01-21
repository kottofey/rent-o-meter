import { isRef, type MaybeRef, type Ref, ref, toRef, unref, watch } from 'vue';
import { type FormInst } from 'naive-ui';

import { type ITarif, useDeleteTarifMutation } from '@/entities/tarif';
import { useCreateTarifMutation, useEditTarifMutation } from '@/entities/tarif';
import { dayjs } from '@/shared/lib/dayjs';

export function useTarifModal({
  initialData,
  formRef,
}: {
  initialData: MaybeRef<Partial<ITarif> | undefined>;
  formRef: Ref<FormInst | null>;
}) {
  const isFormValidateError = ref(false);

  // Init form data
  const initState = {
    tarif_type: undefined,
    rate: undefined,
    valid_from: dayjs().valueOf(),
    valid_to: dayjs().valueOf(),
    comment: '',
  };

  const formData = ref<Partial<ITarif>>({ ...initState });

  watch(
    () => unref(initialData),
    (tarif) => {
      if (tarif) {
        formData.value = {
          tarif_type: tarif.tarif_type,
          rate: tarif.rate,
          valid_from: tarif.valid_from,
          valid_to: tarif.valid_to,

          comment: tarif.comment,
        };
      } else {
        // Сброс при создании нового
        formData.value = { ...initState };
      }
    },
  );

  const {
    mutate: createTarif,
    isPending: isCreatePending,
    error: createError,
  } = useCreateTarifMutation();
  const {
    mutate: editTarif,
    isPending: isEditPending,
    error: editError,
  } = useEditTarifMutation();

  const { mutate: deleteTarif } = useDeleteTarifMutation();

  const submit = async () => {
    // можно добавить валидацию
    try {
      await formRef.value?.validate((errors) => {
        isFormValidateError.value = false;

        if (!errors) {
          if (isRef(initialData) && initialData.value) {
            editTarif({
              id: initialData.value.id!,
              updatedTarif: formData.value,
            });
          } else {
            createTarif({
              tarif: formData.value,
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
    deleteTarif,

    isPending: initialData ? isCreatePending : isEditPending,
    error: initialData ? createError : editError,
    isFormValidateError,
  };
}
