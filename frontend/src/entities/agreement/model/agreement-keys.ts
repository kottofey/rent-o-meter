const AGREEMENT_QUERY_KEY = 'agreement' as const;
import type { IAgreementIncludes, IAgreementScopes } from './agreement-api';

export const agreementKeys = {
  all: [AGREEMENT_QUERY_KEY] as const,

  lists: () => [...agreementKeys.all, 'list'] as const,

  list: (
    scopes?: IAgreementScopes,
    includes?: IAgreementIncludes,
  ): [
    'agreement',
    'list',
    { scopes: typeof scopes; includes: typeof includes },
  ] => [...agreementKeys.lists(), { scopes, includes }] as const,

  details: () => [...agreementKeys.all, 'detail'] as const,

  detail: (id: number) => [...agreementKeys.details(), id] as const,
};
