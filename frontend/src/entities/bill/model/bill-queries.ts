import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';

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

// TODO дописать фильтры, они пойдут в queryKeys: renteeKeys.list(filters)
// TODO дописать оптимистичные апдейты

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

  return useMutation({
    mutationKey: billKeys.lists(),
    mutationFn: ({ bill }: { bill: Partial<IBill> }) => createBill({ bill }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: billKeys.lists() });
    },
  });
};

export const useEditBillMutation = () => {
  const queryClient = useQueryClient();
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
    },
  });
};

export const useDeleteBillMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteBill({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: billKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: billKeys.detail(variables.id),
      });
    },
  });
};

export const useRestoreBillMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreBill({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: billKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: billKeys.detail(variables.id),
      });
    },
  });
};
