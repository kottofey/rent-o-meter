const RENTEE_QUERY_KEY = 'rentee' as const;
import type { IRenteeScopes, IRenteeIncludes } from './rentee-api';

export const renteeKeys = {
  all: [RENTEE_QUERY_KEY] as const,

  lists: () => [...renteeKeys.all, 'list'] as const,

  list: ({
    scopes,
    includes,
  }: {
    scopes?: IRenteeScopes;
    includes?: IRenteeIncludes;
  }): [
    'rentee',
    'list',
    { scopes: typeof scopes; includes: typeof includes },
  ] => [...renteeKeys.lists(), { scopes, includes }] as const,

  details: () => [...renteeKeys.all, 'detail'] as const,

  detail: ({
    id,
    scopes,
    includes,
  }: {
    id: number;
    scopes?: IRenteeScopes;
    includes?: IRenteeIncludes;
  }) => [...renteeKeys.details(), { scopes, includes, id }] as const,
};
