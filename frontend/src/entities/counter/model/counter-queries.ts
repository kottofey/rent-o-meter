import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/vue-query';

import {
  createCounter,
  deleteCounter,
  editCounter,
  getAllCounters,
  getCounter,
  type ICounter,
  type ICounterIncludes,
  type ICounterScopes,
  restoreCounter,
} from './counter-api';
import { counterKeys } from './counter-keys';

// TODO дописать фильтры, они пойдут в queryKeys: renteeKeys.list(filters)
// TODO дописать оптимистичные апдейты

export const useCountersQueryClient = async ({
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

export const useCounterQueryClient = async ({
  client,
  scopes,
  includes,
  id,
}: {
  id: number;
  client: QueryClient;
  scopes?: ICounterScopes;
  includes?: ICounterIncludes;
}) => {
  // Для разовых запросов
  return await client.fetchQuery({
    queryKey: counterKeys.detail({ id, scopes, includes }),
    queryFn: () => getCounter({ id, scopes, includes }),
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
    select: (data) => {
      return data.filter(
        (counter: ICounter) => counter.agreement && counter.agreement.status,
      );
    },
  });
};

export const useCounterQuery = ({
  id,
  scopes,
  includes,
}: {
  scopes?: ICounterScopes;
  includes?: ICounterIncludes;
  id: number;
}) => {
  return useQuery({
    queryKey: counterKeys.detail({ id, scopes, includes }),
    queryFn: () => getCounter({ id, scopes, includes }),
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
        queryKey: counterKeys.detail({ id: variables.id }),
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
        queryKey: counterKeys.detail({ id: variables.id }),
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
        queryKey: counterKeys.detail({ id: variables.id }),
      });
    },
  });
};
