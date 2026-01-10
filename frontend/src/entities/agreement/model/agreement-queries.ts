import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';

import {
  getAllAgreements,
  editAgreement,
  restoreAgreement,
  createAgreement,
  deleteAgreement,
  getAgreement,
  type IAgreement,
  type IAgreementScopes,
  type IAgreementIncludes,
} from './agreement-api';
import { agreementKeys } from './agreement-keys';

// TODO дописать фильтры, они пойдут в queryKeys: renteeKeys.list(filters)
// TODO дописать оптимистичные апдейты

export const useAgreementsQuery = ({
  scopes,
  includes,
}: {
  scopes?: IAgreementScopes;
  includes?: IAgreementIncludes;
}) => {
  return useQuery({
    queryKey: agreementKeys.list(scopes, includes),
    queryFn: () => getAllAgreements({ scopes, includes }),
  });
};

export const useAgreementQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: agreementKeys.detail(id),
    queryFn: () => getAgreement({ id }),
  });
};

export const useCreateAgreementMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: agreementKeys.lists(),
    mutationFn: ({ agreement }: { agreement: Partial<IAgreement> }) =>
      createAgreement({ agreement }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: agreementKeys.lists() });
    },
  });
};

export const useEditAgreementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updatedAgreement,
    }: {
      id: number;
      updatedAgreement: Partial<IAgreement>;
    }) => editAgreement({ id, updatedAgreement }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: agreementKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: agreementKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteAgreementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteAgreement({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: agreementKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: agreementKeys.detail(variables.id),
      });
    },
  });
};

export const useRestoreAgreementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreAgreement({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: agreementKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: agreementKeys.detail(variables.id),
      });
    },
  });
};
