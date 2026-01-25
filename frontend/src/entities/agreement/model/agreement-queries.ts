import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { useNotification } from 'naive-ui';
import { MaybeRefOrGetter, toValue } from 'vue';

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

import { getErrorMessage } from '@/shared/lib/tanstack/onError';

// TODO дописать фильтры, они пойдут в queryKeys: renteeKeys.list(filters)
// TODO дописать оптимистичные апдейты

export const useAgreementsQuery = ({
  scopes,
  includes,
}: {
  scopes?: MaybeRefOrGetter<IAgreementScopes>;
  includes?: IAgreementIncludes;
}) => {
  return useQuery({
    queryKey: agreementKeys.list(scopes, includes),
    queryFn: () => getAllAgreements({ scopes: toValue(scopes), includes }),
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
  const notif = useNotification();

  return useMutation({
    mutationKey: agreementKeys.lists(),
    mutationFn: ({ agreement }: { agreement: Partial<IAgreement> }) =>
      createAgreement({ agreement }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: agreementKeys.lists() });
      notif.success({
        content: 'Создано',
        closable: true,
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      notif.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 3000,
      });
    },
  });
};

export const useEditAgreementMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

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
      notif.success({
        content: 'Отредактировано',
        closable: true,
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      notif.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 3000,
      });
    },
  });
};

export const useDeleteAgreementMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteAgreement({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: agreementKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: agreementKeys.detail(variables.id),
      });
      notif.success({
        content: 'Удалено',
        closable: true,
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      notif.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 3000,
      });
    },
  });
};

export const useRestoreAgreementMutation = () => {
  const queryClient = useQueryClient();
  const notif = useNotification();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreAgreement({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: agreementKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: agreementKeys.detail(variables.id),
      });
      notif.success({
        content: 'Восстановлено',
        closable: true,
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      notif.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 3000,
      });
    },
  });
};
