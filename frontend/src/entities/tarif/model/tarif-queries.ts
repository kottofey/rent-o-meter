import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';

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

// TODO дописать фильтры, они пойдут в queryKeys: tarifKeys.list(filters)
// TODO дописать оптимистичные апдейты

export const useTarifsQuery = ({
  scopes,
  includes,
}: {
  scopes?: ITarifScopes;
  includes?: ITarifIncludes;
}) => {
  return useQuery({
    queryKey: tarifKeys.list(scopes, includes),
    queryFn: () => getAllTarifs({ scopes, includes }),
  });
};

export const useTarifQuery = (id: number) => {
  return useQuery({
    queryKey: tarifKeys.detail(id),
    queryFn: () => getTarif({ id }),
  });
};

export const useCreateTarifMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: tarifKeys.lists(),
    mutationFn: ({ tarif }: { tarif: Partial<ITarif> }) =>
      createTarif({ tarif }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tarifKeys.lists() });
    },
  });
};

export const useEditTarifMutation = () => {
  const queryClient = useQueryClient();
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
    },
  });
};

export const useDeleteTarifMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteTarif({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: tarifKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: tarifKeys.detail(variables.id),
      });
    },
  });
};

export const useRestoreTarifMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreTarif({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: tarifKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: tarifKeys.detail(variables.id),
      });
    },
  });
};
