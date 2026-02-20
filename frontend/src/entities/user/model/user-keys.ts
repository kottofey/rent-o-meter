const USER_QUERY_KEY = 'user' as const;
import type {
  IUserScopes,
  IUserIncludes,
} from 'src/entities/user/model/user-api';

export const userKeys = {
  all: [USER_QUERY_KEY] as const,

  lists: () => [...userKeys.all, 'list'] as const,

  list: (
    scopes?: IUserScopes,
    includes?: IUserIncludes,
  ): [
    typeof USER_QUERY_KEY,
    'list',
    { scopes: typeof scopes; includes: typeof includes },
  ] => [...userKeys.lists(), { scopes, includes }] as const,

  details: () => [...userKeys.all, 'detail'] as const,

  detail: (id: number) => [...userKeys.details(), id] as const,
};
