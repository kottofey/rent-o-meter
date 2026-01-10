import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';

import {
  getAllPayMonths,
  editPayMonth,
  restorePayMonth,
  createPayMonth,
  deletePayMonth,
  getPayMonth,
  type IPayMonth,
  type IPayMonthScopes,
  type IPayMonthIncludes,
} from './payMonth-api';
import { payMonthKeys } from './payMonth-keys';

// TODO дописать фильтры, они пойдут в queryKeys: renteeKeys.list(filters)
// TODO дописать оптимистичные апдейты

export const usePayMonthsQuery = ({
  scopes,
  includes,
}: {
  scopes?: IPayMonthScopes;
  includes?: IPayMonthIncludes;
}) => {
  return useQuery({
    queryKey: payMonthKeys.list(scopes, includes),
    queryFn: () => getAllPayMonths({ scopes, includes }),
  });
};

export const usePayMonthQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: payMonthKeys.detail(id),
    queryFn: () => getPayMonth({ id }),
  });
};

export const useCreatePayMonthMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: payMonthKeys.lists(),
    mutationFn: ({ payMonth }: { payMonth: Partial<IPayMonth> }) =>
      createPayMonth({ payMonth }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: payMonthKeys.lists() });
    },
  });
};

export const useEditPayMonthMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updatedPayMonth,
    }: {
      id: number;
      updatedPayMonth: Partial<IPayMonth>;
    }) => editPayMonth({ id, updatedPayMonth }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: payMonthKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: payMonthKeys.detail(variables.id),
      });
    },
  });
};

export const useDeletePayMonthMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deletePayMonth({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: payMonthKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: payMonthKeys.detail(variables.id),
      });
    },
  });
};

export const useRestorePayMonthMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => restorePayMonth({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: payMonthKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: payMonthKeys.detail(variables.id),
      });
    },
  });
};
