const PAYMONTH_QUERY_KEY = 'payMonth' as const;
import type { IPayMonthIncludes, IPayMonthScopes } from './payMonth-api';

export const payMonthKeys = {
  all: [PAYMONTH_QUERY_KEY] as const,

  lists: () => [...payMonthKeys.all, 'list'] as const,

  list: (
    scopes?: IPayMonthScopes,
    includes?: IPayMonthIncludes,
  ): [
    'payMonth',
    'list',
    { scopes: typeof scopes; includes: typeof includes },
  ] => [...payMonthKeys.lists(), { scopes, includes }] as const,

  details: () => [...payMonthKeys.all, 'detail'] as const,

  detail: (id: number) => [...payMonthKeys.details(), id] as const,
};
