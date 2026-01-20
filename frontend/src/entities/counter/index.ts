export {
  useCountersQuery,
  useCounterQuery,
  useCreateCounterMutation,
  useEditCounterMutation,
  useDeleteCounterMutation,
  useRestoreCounterMutation,
  useCountersQueryClient,
  useCounterQueryClient,
} from './model/counter-queries';

export type {
  ICounter,
  ICounterIncludes,
  ICounterScopes,
} from './model/counter-api';
