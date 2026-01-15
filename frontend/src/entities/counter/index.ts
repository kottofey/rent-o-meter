export {
  useCountersQuery,
  useCounterQuery,
  useCreateCounterMutation,
  useEditCounterMutation,
  useDeleteCounterMutation,
  useRestoreCounterMutation,
} from './model/counter-queries';

export type {
  ICounter,
  ICounterIncludes,
  ICounterScopes,
} from './model/counter-api';
