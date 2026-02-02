import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from '@tanstack/vue-query';
import { useNotification } from 'naive-ui';

import {
  getAllTarifs,
  editTarif,
  restoreTarif,
  createTarif,
  deleteTarif,
  getTarif,
  type ITarif,
  type ITarifScopes,
  type ITarifIncludes,
} from './tarif-api';
import { tarifKeys } from './tarif-keys';

import { getErrorMessage } from '@/shared/lib/tanstack/onError';

export const useTarifQueryClient = async ({
  client,
  scopes,
  includes,
}: {
  client: QueryClient;
  scopes?: ITarifScopes;
  includes?: ITarifIncludes;
}) => {
  // Для разовых запросов
  return await client.fetchQuery({
    queryKey: tarifKeys.list(scopes, includes),
    queryFn: () => getAllTarifs({ scopes, includes }),
  });
};

export const useTarifsQueryClient = async ({
  scopes,
  includes,
  client,
}: {
  scopes?: ITarifScopes;
  includes?: ITarifIncludes;
  client: QueryClient;
}) => {
  return await client.fetchQuery({
    queryKey: tarifKeys.list(scopes, includes),
    queryFn: () => getAllTarifs({ scopes, includes }),
  });
};

export const useTarifsQuery = ({
  scopes,
  includes,
  isDisabled = false,
}: {
  scopes?: ITarifScopes;
  includes?: ITarifIncludes;
  isDisabled?: boolean;
}) => {
  return useQuery({
    queryKey: tarifKeys.list(scopes, includes),
    queryFn: () => getAllTarifs({ scopes, includes }),
    enabled: !isDisabled,
  });
};

export const useTarifQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: tarifKeys.detail(id),
    queryFn: () => getTarif({ id }),
  });
};

export const useCreateTarifMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationKey: tarifKeys.lists(),
    mutationFn: ({ tarif }: { tarif: Partial<ITarif> }) =>
      createTarif({ tarif }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tarifKeys.lists() });
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

export const useEditTarifMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({
      id,
      updatedTarif,
    }: {
      id: number;
      updatedTarif: Partial<ITarif>;
    }) => editTarif({ id, updatedTarif }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: tarifKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: tarifKeys.detail(variables.id),
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

export const useDeleteTarifMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteTarif({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: tarifKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: tarifKeys.detail(variables.id),
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

export const useRestoreTarifMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreTarif({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: tarifKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: tarifKeys.detail(variables.id),
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
