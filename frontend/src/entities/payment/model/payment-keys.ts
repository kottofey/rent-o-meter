import { type MaybeRefOrGetter, toValue } from 'vue';

const PAYMENT_QUERY_KEY = 'payment' as const;
import type { IPaymentScopes, IPaymentIncludes } from './payment-api';

export const paymentKeys = {
  all: [PAYMENT_QUERY_KEY] as const,

  lists: () => [...paymentKeys.all, 'list'] as const,

  list: ({
    scopes,
    includes,
  }: {
    scopes?: MaybeRefOrGetter<IPaymentScopes>;
    includes?: IPaymentIncludes;
  }): [
    'payment',
    'list',
    { scopes: typeof scopes; includes: typeof includes },
  ] => [...paymentKeys.lists(), { scopes: toValue(scopes), includes }] as const,

  details: () => [...paymentKeys.all, 'detail'] as const,

  detail: ({
    id,
    scopes,
    includes,
  }: {
    id: number;
    scopes?: IPaymentScopes;
    includes?: IPaymentIncludes;
  }) => [...paymentKeys.details(), { scopes, includes, id }] as const,
};
