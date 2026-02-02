import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/vue-query';
import { useNotification } from 'naive-ui';

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

import { getErrorMessage } from '@/shared/lib/tanstack/onError';

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
  const notif = useNotification();

  return useMutation({
    mutationKey: counterKeys.lists(),
    mutationFn: ({ counter }: { counter: Partial<ICounter> }) =>
      createCounter({ counter }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: counterKeys.lists() });
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

export const useEditCounterMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

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

export const useDeleteCounterMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteCounter({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: counterKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: counterKeys.detail({ id: variables.id }),
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

export const useRestoreCounterMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreCounter({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: counterKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: counterKeys.detail({ id: variables.id }),
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
