const RENTEE_QUERY_KEY = 'rentee' as const;
import type { IRenteeScopes } from './rentee-api';

export const renteeKeys = {
  all: [RENTEE_QUERY_KEY] as const,

  lists: () => [...renteeKeys.all, 'list'] as const,

  list: (
    scopes?: IRenteeScopes,
  ): ['rentee', 'list', { scopes: typeof scopes }] =>
    [...renteeKeys.lists(), { scopes }] as const,

  details: () => [...renteeKeys.all, 'detail'] as const,

  detail: (id: number) => [...renteeKeys.details(), id] as const,
};
