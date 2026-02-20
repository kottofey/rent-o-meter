import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from '@tanstack/vue-query';
import { useNotification } from 'naive-ui';

import {
  getAllUsers,
  editUser,
  restoreUser,
  createUser,
  deleteUser,
  getUser,
  type IUser,
  type IUserScopes,
  type IUserIncludes,
} from './user-api';
import { userKeys } from './user-keys';

import { getErrorMessage } from '@/shared/lib/tanstack/onError';

export const useUserQueryClient = async ({
  client,
  scopes,
  includes,
}: {
  client: QueryClient;
  scopes?: IUserScopes;
  includes?: IUserIncludes;
}) => {
  // Для разовых запросов
  return await client.fetchQuery({
    queryKey: userKeys.list(scopes, includes),
    queryFn: () => getAllUsers({ scopes, includes }),
  });
};

export const useUsersQueryClient = async ({
  scopes,
  includes,
  client,
}: {
  scopes?: IUserScopes;
  includes?: IUserIncludes;
  client: QueryClient;
}) => {
  return await client.fetchQuery({
    queryKey: userKeys.list(scopes, includes),
    queryFn: () => getAllUsers({ scopes, includes }),
  });
};

export const useUsersQuery = ({
  scopes,
  includes,
  isDisabled = false,
}: {
  scopes?: IUserScopes;
  includes?: IUserIncludes;
  isDisabled?: boolean;
}) => {
  return useQuery({
    queryKey: userKeys.list(scopes, includes),
    queryFn: () => getAllUsers({ scopes, includes }),
    enabled: !isDisabled,
  });
};

export const useUserQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser({ id }),
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationKey: userKeys.lists(),
    mutationFn: ({ user }: { user: Partial<IUser> }) => createUser({ user }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });
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

export const useEditUserMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({
      id,
      updatedUser,
    }: {
      id: number;
      updatedUser: Partial<IUser>;
    }) => editUser({ id, updatedUser }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
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

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteUser({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
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

export const useRestoreUserMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreUser({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
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
