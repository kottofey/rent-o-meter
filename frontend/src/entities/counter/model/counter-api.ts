import { IAgreement } from '@/entities/agreement/@x/counter';
import { IBill } from '@/entities/bill/@x/counter';
import { httpMethod, useApi, serializeQuery } from '@/shared/api';

export interface ICounter {
  id: number;
  month: number;
  date_start: number;
  date_end: number;

  counter_water: number;
  counter_prev_water: number;
  counter_electricity: number;
  counter_prev_electricity: number;

  electricity_diff: number; // virtual
  water_diff: number; // virtual

  comment?: string;

  deletedAt: Date;

  agreementId: number;
  agreement: IAgreement;

  bill: IBill;
}

export type ICounterIncludes = Array<'Agreement' | 'Bill' | 'Agreement.Rentee'>;

export type ICounterScopes = {
  'counter:byAgreementId'?: number;
  'counter:byMonth'?: string;
  'counter:byPeriod'?: {
    start: string;
    end: string;
  };
};

export async function getAllCounters({
  scopes,
  includes = [],
}: {
  scopes?: ICounterScopes;
  includes?: ICounterIncludes;
}): Promise<ICounter[]> {
  return await useApi<ICounter[]>({
    route: 'counters',
    method: httpMethod.GET,
    query: serializeQuery({ scopes, includes }),
  });
}

export async function getCounter({
  id,
  scopes,
  includes = [],
}: {
  id: number;
  scopes?: ICounterScopes;
  includes?: ICounterIncludes;
}): Promise<ICounter> {
  return await useApi<ICounter>({
    route: `counters/${id}`,
    method: httpMethod.GET,
    query: serializeQuery({ scopes, includes }),
  });
}

export async function createCounter({
  counter,
}: {
  counter: Partial<ICounter>;
}): Promise<ICounter> {
  return await useApi<ICounter>({
    route: `counters`,
    method: httpMethod.POST,
    body: JSON.stringify(counter),
  });
}

export async function deleteCounter({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `counters/${id}`,
    method: httpMethod.DELETE,
  });
}

export async function restoreCounter({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `counters/${id}/restore`,
    method: httpMethod.PUT,
  });
}

export async function editCounter({
  id,
  updatedCounter,
}: {
  id: number;
  updatedCounter: Partial<ICounter>;
}): Promise<ICounter> {
  return await useApi<ICounter>({
    route: `counters/${id}`,
    method: httpMethod.PUT,
    body: JSON.stringify(updatedCounter),
  });
}
