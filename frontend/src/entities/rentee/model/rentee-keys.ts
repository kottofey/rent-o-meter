const RENTEE_QUERY_KEY = 'rentee' as const;

export const renteeKeys = {
  all: [RENTEE_QUERY_KEY] as const,

  lists: () => [...renteeKeys.all, 'list'] as const,

  list: (filters: string) => [...renteeKeys.lists(), { filters }] as const,

  details: () => [...renteeKeys.all, 'detail'] as const,

  detail: (id: number) => [...renteeKeys.details(), id] as const,
};
