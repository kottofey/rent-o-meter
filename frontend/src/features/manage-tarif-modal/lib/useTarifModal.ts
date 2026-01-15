import { isRef, type MaybeRef, type Ref, ref, toRef, unref, watch } from 'vue';
import { type FormInst } from 'naive-ui';

import { type ITarif } from '@/entities/tarif';
import { useCreateTarifMutation, useEditTarifMutation } from '@/entities/tarif';

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
    water: undefined,
    electricity: undefined,
    heat: undefined,
    gas: undefined,
    renovation: undefined,
    tko: undefined,
    managing_company: undefined,
    domofon: undefined,
    comment: '',
  };

  const formData = ref<Partial<ITarif>>({ ...initState });

  watch(
    () => unref(initialData),
    (tarif) => {
      if (tarif) {
        formData.value = {
          water: tarif.water,
          electricity: tarif.electricity,
          heat: tarif.heat,
          gas: tarif.gas,
          renovation: tarif.renovation,
          tko: tarif.tko,
          managing_company: tarif.managing_company,
          domofon: tarif.domofon,
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

    isPending: initialData ? isCreatePending : isEditPending,
    error: initialData ? createError : editError,
    isFormValidateError,
  };
}
