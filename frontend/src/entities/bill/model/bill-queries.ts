import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { useNotification } from 'naive-ui';

import {
  getAllBills,
  editBill,
  restoreBill,
  createBill,
  deleteBill,
  getBill,
  type IBill,
  type IBillScopes,
  type IBillIncludes,
} from './bill-api';
import { billKeys } from './bill-keys';

import { getErrorMessage } from '@/shared/lib/tanstack/onError';

export const useBillsQuery = ({
  scopes,
  includes,
}: {
  scopes?: IBillScopes;
  includes?: IBillIncludes;
}) => {
  return useQuery({
    queryKey: billKeys.list(scopes, includes),
    queryFn: () => getAllBills({ scopes, includes }),
  });
};

export const useBillQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: billKeys.detail(id),
    queryFn: () => getBill({ id }),
  });
};

export const useCreateBillMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationKey: billKeys.lists(),
    mutationFn: ({ bill }: { bill: Partial<IBill> }) => createBill({ bill }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: billKeys.lists() });
      notif.success({
        content: 'Создано',
        closable: true,
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      notif.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 5000,
      });
    },
  });
};

export const useEditBillMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({
      id,
      updatedBill,
    }: {
      id: number;
      updatedBill: Partial<IBill>;
    }) => editBill({ id, updatedBill }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: billKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: billKeys.detail(variables.id),
      });
      notif.success({
        content: 'Отредактировано',
        closable: true,
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      notif.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 5000,
      });
    },
  });
};

export const useDeleteBillMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteBill({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: billKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: billKeys.detail(variables.id),
      });
      notif.success({
        content: 'Удалено',
        closable: true,
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      notif.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 5000,
      });
    },
  });
};

export const useRestoreBillMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreBill({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: billKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: billKeys.detail(variables.id),
      });
      notif.success({
        content: 'Восстановлено',
        closable: true,
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      notif.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 5000,
      });
    },
  });
};
