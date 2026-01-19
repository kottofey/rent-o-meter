import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from '@tanstack/vue-query';

import {
  getAllCounters,
  editCounter,
  restoreCounter,
  createCounter,
  deleteCounter,
  getCounter,
  type ICounter,
  type ICounterScopes,
  type ICounterIncludes,
} from './counter-api';
import { counterKeys } from './counter-keys';

import type { ITarifIncludes, ITarifScopes } from '@/entities/tarif';
import { tarifKeys } from '@/entities/tarif/model/tarif-keys';
import { getAllTarifs } from '@/entities/tarif/model/tarif-api';

// TODO дописать фильтры, они пойдут в queryKeys: renteeKeys.list(filters)
// TODO дописать оптимистичные апдейты

export const useCounterQueryClient = async ({
  client,
  scopes,
  includes,
}: {
  client: QueryClient;
  scopes?: ICounterScopes;
  includes?: ICounterIncludes;
}) => {
  // Для разовых запросов
  return await client.fetchQuery({
    queryKey: counterKeys.list(scopes, includes),
    queryFn: () => getAllCounters({ scopes, includes }),
  });
};

export const useCountersQuery = ({
  scopes,
  includes,
  isDisabled = false,
}: {
  scopes?: ICounterScopes;
  includes?: ICounterIncludes;
  isDisabled?: boolean;
}) => {
  return useQuery({
    queryKey: counterKeys.list(scopes, includes),
    queryFn: () => getAllCounters({ scopes, includes }),
    enabled: !isDisabled,
  });
};

export const useCounterQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: counterKeys.detail(id),
    queryFn: () => getCounter({ id }),
  });
};

export const useCreateCounterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: counterKeys.lists(),
    mutationFn: ({ counter }: { counter: Partial<ICounter> }) =>
      createCounter({ counter }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: counterKeys.lists() });
    },
  });
};

export const useEditCounterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updatedCounter,
    }: {
      id: number;
      updatedCounter: Partial<ICounter>;
    }) => editCounter({ id, updatedCounter }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: counterKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: counterKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteCounterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteCounter({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: counterKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: counterKeys.detail(variables.id),
      });
    },
  });
};

export const useRestoreCounterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreCounter({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: counterKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: counterKeys.detail(variables.id),
      });
    },
  });
};
