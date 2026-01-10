import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';

import {
  getAllRentees,
  editRentee,
  restoreRentee,
  createRentee,
  deleteRentee,
  getRentee,
  type IRentee,
  IRenteeScopes,
} from './rentee-api';
import { renteeKeys } from './rentee-keys';

// TODO дописать фильтры, они пойдут в queryKeys: renteeKeys.list(filters)
// TODO дописать оптимистичные апдейты

export const useRenteesQuery = ({ scopes }: { scopes?: IRenteeScopes }) => {
  return useQuery({
    queryKey: renteeKeys.list(scopes),
    queryFn: () => getAllRentees({ scopes }),
  });
};

export const useRenteeQuery = (id: number) => {
  return useQuery({
    queryKey: renteeKeys.detail(id),
    queryFn: () => getRentee({ id }),
  });
};

export const useCreateRenteeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: renteeKeys.lists(),
    mutationFn: ({ rentee }: { rentee: Partial<IRentee> }) =>
      createRentee({ rentee }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: renteeKeys.lists() });
    },
  });
};

export const useEditRenteeMutation = () => {
  const queryClient = useQueryClient();
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
        queryKey: renteeKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteRenteeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteRentee({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: renteeKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: renteeKeys.detail(variables.id),
      });
    },
  });
};

export const useRestoreRenteeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreRentee({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: renteeKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: renteeKeys.detail(variables.id),
      });
    },
  });
};
