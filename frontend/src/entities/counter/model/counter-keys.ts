const COUNTER_QUERY_KEY = 'counter' as const;
import type { ICounterIncludes, ICounterScopes } from './counter-api';

export const counterKeys = {
  all: [COUNTER_QUERY_KEY] as const,

  lists: () => [...counterKeys.all, 'list'] as const,

  list: (
    scopes?: ICounterScopes,
    includes?: ICounterIncludes,
  ): [
    'counter',
    'list',
    { scopes: typeof scopes; includes: typeof includes },
  ] => [...counterKeys.lists(), { scopes, includes }] as const,

  details: () => [...counterKeys.all, 'detail'] as const,

  detail: ({
    id,
    scopes = {},
    includes = [],
  }: {
    id: number;
    scopes?: ICounterScopes;
    includes?: ICounterIncludes;
  }) => [...counterKeys.details(), { id, scopes, includes }] as const,
};
