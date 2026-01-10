const TARIF_QUERY_KEY = 'tarif' as const;
import type { ITarifScopes, ITarifIncludes } from './tarif-api';

export const tarifKeys = {
  all: [TARIF_QUERY_KEY] as const,

  lists: () => [...tarifKeys.all, 'list'] as const,

  list: (
    scopes?: ITarifScopes,
    includes?: ITarifIncludes,
  ): [
    typeof TARIF_QUERY_KEY,
    'list',
    { scopes: typeof scopes; includes: typeof includes },
  ] => [...tarifKeys.lists(), { scopes, includes }] as const,

  details: () => [...tarifKeys.all, 'detail'] as const,

  detail: (id: number) => [...tarifKeys.details(), id] as const,
};
