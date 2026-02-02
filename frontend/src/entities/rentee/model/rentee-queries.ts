import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { MaybeRefOrGetter, toValue } from 'vue';
import { useNotification } from 'naive-ui';

import {
  getAllRentees,
  editRentee,
  restoreRentee,
  createRentee,
  deleteRentee,
  getRentee,
  type IRentee,
  type IRenteeScopes,
  type IRenteeIncludes,
} from './rentee-api';
import { renteeKeys } from './rentee-keys';

import { getErrorMessage } from '@/shared/lib/tanstack/onError';

export const useRenteesQuery = ({
  scopes,
  includes,
}: {
  scopes?: MaybeRefOrGetter<IRenteeScopes>;
  includes?: IRenteeIncludes;
}) => {
  return useQuery({
    queryKey: renteeKeys.list({ scopes: toValue(scopes), includes }),
    queryFn: () => getAllRentees({ scopes: toValue(scopes), includes }),
  });
};

export const useRenteeQuery = ({
  id,
  includes,
  scopes,
}: {
  id: number;
  scopes?: IRenteeScopes;
  includes?: IRenteeIncludes;
}) => {
  return useQuery({
    queryKey: renteeKeys.detail({ scopes, includes, id }),
    queryFn: () => getRentee({ id, scopes, includes }),
  });
};

export const useCreateRenteeMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationKey: renteeKeys.lists(),
    mutationFn: ({ rentee }: { rentee: Partial<IRentee> }) =>
      createRentee({ rentee }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: renteeKeys.lists() });
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

export const useEditRenteeMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({
      id,
      updatedRentee,
    }: {
      id: number;
      updatedRentee: Partial<IRentee>;
    }) => editRentee({ id, updatedRentee }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: renteeKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: renteeKeys.detail({ id: variables.id }),
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

export const useDeleteRenteeMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteRentee({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: renteeKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: renteeKeys.detail({ id: variables.id }),
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

export const useRestoreRenteeMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreRentee({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: renteeKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: renteeKeys.detail({ id: variables.id }),
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
