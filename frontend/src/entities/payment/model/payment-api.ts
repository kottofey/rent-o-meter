import { useApi, httpMethod, serializeQuery } from '@/shared/api';
import { type IBill } from '@/entities/bill/@x/payment';

export interface IPayment {
  id: number;
  date: number;
  ammount: number;
  comment?: string;

  bill_id: number | null;
  bill?: IBill;

  deletedAt: number | null;
}

// TODO дописать скоупы если будут
// TODO написать алгоритм сериализации с проверкой через zod
export type IPaymentScopes = {
  'payment:byBill'?: number | null;
  'payment:byRentee'?: number | null;
};
export type IPaymentIncludes = Array<
  'Bill' | 'Bill.Agreement' | 'Bill.Agreement.Rentee'
>;

export async function getAllPayments({
  scopes,
  includes = [],
}: {
  scopes?: IPaymentScopes;
  includes?: IPaymentIncludes;
}): Promise<IPayment[]> {
  return await useApi<IPayment[]>({
    route: 'payments',
    method: httpMethod.GET,
    query: serializeQuery({ scopes, includes }),
  });
}

export async function getPayment({
  id,
  scopes,
  includes,
}: {
  id: number;
  scopes?: IPaymentScopes;
  includes?: IPaymentIncludes;
}): Promise<IPayment> {
  return await useApi<IPayment>({
    route: `payments/${id}`,
    method: httpMethod.GET,
    query: serializeQuery({ scopes, includes }),
  });
}

export async function createPayment({
  payment,
}: {
  payment: Partial<IPayment>;
}): Promise<IPayment> {
  return await useApi<IPayment>({
    route: `payments`,
    method: httpMethod.POST,
    body: JSON.stringify(payment),
  });
}

export async function deletePayment({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `payments/${id}`,
    method: httpMethod.DELETE,
  });
}

export async function restorePayment({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `payments/${id}/restore`,
    method: httpMethod.PUT,
  });
}

export async function editPayment({
  id,
  updatedPayment,
}: {
  id: number;
  updatedPayment: Partial<IPayment>;
}): Promise<IPayment> {
  return await useApi<IPayment>({
    route: `payments/${id}`,
    method: httpMethod.PUT,
    body: JSON.stringify(updatedPayment),
  });
}
