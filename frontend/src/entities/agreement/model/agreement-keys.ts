const AGREEMENT_QUERY_KEY = 'agreement' as const;
import { type IAgreementScopes } from './agreement-api';

export const agreementKeys = {
  all: [AGREEMENT_QUERY_KEY] as const,

  lists: () => [...agreementKeys.all, 'list'] as const,

  list: (
    scopes?: IAgreementScopes,
  ): ['agreement', 'list', { scopes: typeof scopes }] =>
    [...agreementKeys.lists(), { scopes }] as const,

  details: () => [...agreementKeys.all, 'detail'] as const,

  detail: (id: number) => [...agreementKeys.details(), id] as const,
};
