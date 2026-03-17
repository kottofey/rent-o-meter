import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import {
  getAllPayments,
  editPayment,
  restorePayment,
  createPayment,
  deletePayment,
  getPayment,
  type IPayment,
  type IPaymentScopes,
  type IPaymentIncludes,
} from './payment-api';
import { paymentKeys } from './payment-keys';

import { notification } from '@/shared/lib';
import { getErrorMessage } from '@/shared/lib/tanstack/onError';

export const usePaymentsQuery = ({
  scopes,
  includes,
}: {
  scopes?: MaybeRefOrGetter<IPaymentScopes>;
  includes?: IPaymentIncludes;
}) => {
  return useQuery({
    queryKey: paymentKeys.list({ scopes: toValue(scopes), includes }),
    queryFn: () => getAllPayments({ scopes: toValue(scopes), includes }),
  });
};

export const usePaymentQuery = ({
  id,
  includes,
  scopes,
}: {
  id: number;
  scopes?: IPaymentScopes;
  includes?: IPaymentIncludes;
}) => {
  return useQuery({
    queryKey: paymentKeys.detail({ scopes, includes, id }),
    queryFn: () => getPayment({ id, scopes, includes }),
  });
};

export const useCreatePaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: paymentKeys.lists(),
    mutationFn: ({ payment }: { payment: Partial<IPayment> }) =>
      createPayment({ payment }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      notification.success({
        content: 'Создано',
        closable: true,
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      notification.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 5000,
      });
    },
  });
};

export const useEditPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updatedPayment,
    }: {
      id: number;
      updatedPayment: Partial<IPayment>;
    }) => editPayment({ id, updatedPayment }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: paymentKeys.detail({ id: variables.id }),
      });
      notification.success({
        content: 'Отредактировано',
        closable: true,
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      notification.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 5000,
      });
    },
  });
};

export const useDeletePaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deletePayment({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: paymentKeys.detail({ id: variables.id }),
      });
      notification.success({
        content: 'Удалено',
        closable: true,
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      notification.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 5000,
      });
    },
  });
};

export const useRestorePaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => restorePayment({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: paymentKeys.detail({ id: variables.id }),
      });
      notification.success({
        content: 'Восстановлено',
        closable: true,
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      notification.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 5000,
      });
    },
  });
};
