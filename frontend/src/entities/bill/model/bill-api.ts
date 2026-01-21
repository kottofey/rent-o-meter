import { httpMethod, useApi, serializeQuery } from '@/shared/api';
import { type IAgreement } from '@/entities/agreement/@x/bill';
import { type ICounter } from '@/entities/counter/@x/bill';
import { type ITarif } from '@/entities/tarif/@x/bill';

export interface IBill {
  id: number;
  status: boolean;
  bill_date: number;
  month: number;

  ammount: number;
  extra_ammount: number;
  ammount_paid: number;

  comment: string;

  agreementId: number;
  agreement: IAgreement;

  counterId: number;
  counter: ICounter;

  tarifId: number;
  tarif: ITarif;
}

export type IBillScopes = {
  'bills:isDebt'?: boolean;
};
export type IBillIncludes = Array<'Agreement' | 'Counter' | 'Tarif'>;

export async function getAllBills({
  scopes,
  includes = [],
}: {
  scopes?: IBillScopes;
  includes?: IBillIncludes;
}): Promise<IBill[]> {
  return await useApi<IBill[]>({
    route: 'bills',
    method: httpMethod.GET,
    query: serializeQuery({ scopes, includes }),
  });
}

export async function getBill({ id }: { id: number }): Promise<IBill> {
  return await useApi<IBill>({
    route: `bills/${id}`,
    method: httpMethod.GET,
  });
}

export async function createBill({
  bill,
}: {
  bill: Partial<IBill>;
}): Promise<IBill> {
  return await useApi<IBill>({
    route: `bills`,
    method: httpMethod.POST,
    body: JSON.stringify(bill),
  });
}

export async function deleteBill({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `bills/${id}`,
    method: httpMethod.DELETE,
  });
}

export async function restoreBill({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `bills/${id}/restore`,
    method: httpMethod.PUT,
  });
}

export async function editBill({
  id,
  updatedBill,
}: {
  id: number;
  updatedBill: Partial<IBill>;
}): Promise<IBill> {
  return await useApi<IBill>({
    route: `bills/${id}`,
    method: httpMethod.PUT,
    body: JSON.stringify(updatedBill),
  });
}
