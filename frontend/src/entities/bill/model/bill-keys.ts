const BILL_QUERY_KEY = 'bill' as const;
import type { IBillIncludes, IBillScopes } from './bill-api';

export const billKeys = {
  all: [BILL_QUERY_KEY] as const,

  lists: () => [...billKeys.all, 'list'] as const,

  list: (
    scopes?: IBillScopes,
    includes?: IBillIncludes,
  ): ['bill', 'list', { scopes: typeof scopes; includes: typeof includes }] =>
    [...billKeys.lists(), { scopes, includes }] as const,

  details: () => [...billKeys.all, 'detail'] as const,

  detail: (id: number) => [...billKeys.details(), id] as const,
};
