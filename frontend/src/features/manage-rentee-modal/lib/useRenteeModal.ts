import { isRef, type MaybeRef, type Ref, ref, toRef, unref, watch } from 'vue';
import { type FormInst } from 'naive-ui';

import { type IRentee } from '@/entities/rentee/model/rentee-api';
import {
  useCreateRenteeMutation,
  useEditRenteeMutation,
  useDeleteRenteeMutation,
} from '@/entities/rentee';
import { dayjs } from '@/shared/lib/dayjs';

export function useRenteeModal({
  initialData,
  formRef,
}: {
  initialData: MaybeRef<Partial<IRentee> | undefined>;
  formRef: Ref<FormInst | null>;
}) {
  const isFormValidateError = ref(false);

  // Init form data
  const formData = ref<Partial<IRentee>>({
    surname: '',
    firstname: '',
    patronymic: '',
    phone: '',
    email: '',
    status: true,
    date_start: dayjs().valueOf(),
    date_end: undefined,
    comment: '',
  });

  watch(
    () => unref(initialData),
    (rentee) => {
      if (rentee) {
        formData.value = {
          surname: rentee.surname,
          firstname: rentee.firstname,
          patronymic: rentee.patronymic,
          phone: rentee.phone,
          email: rentee.email,
          status: rentee.status,
          date_start: rentee.date_start,
          date_end: rentee.date_end,
          comment: rentee.comment,
        };
      } else {
        // Сброс при создании нового
        formData.value = {
          surname: '',
          firstname: '',
          patronymic: '',
          phone: '',
          email: '',
          status: true,
          date_start: dayjs().valueOf(),
          date_end: undefined,
          comment: '',
        };
      }
    },
  );

  const {
    mutate: createRentee,
    isPending: isCreatePending,
    error: createError,
  } = useCreateRenteeMutation();
  const {
    mutate: editRentee,
    isPending: isEditPending,
    error: editError,
  } = useEditRenteeMutation();

  const submit = async () => {
    // можно добавить валидацию
    try {
      await formRef.value?.validate((errors) => {
        isFormValidateError.value = false;

        if (!errors) {
          if (isRef(initialData) && initialData.value) {
            editRentee({
              id: initialData.value.id!,
              updatedRentee: formData.value,
            });
          } else {
            createRentee({
              rentee: formData.value,
            });
          }
        }
      });
    } catch (errors) {
      isFormValidateError.value = true;
      console.error('Ошибка валидации', JSON.stringify(errors, null, 2));
    }
  };

  const checkActiveAgreements = () => {
    if (isRef(initialData) && initialData.value) {
      return !!initialData.value.agreements?.find(
        (agreement) => agreement.status === true,
      );
    }
  };
  return {
    formData: toRef(formData),
    submit,
    checkActiveAgreements,

    isPending: initialData ? isCreatePending : isEditPending,
    error: initialData ? createError : editError,
    isFormValidateError,
  };
}
