import { httpMethod, useApi, serializeQuery } from '@/shared/api';
import { IRentee } from '@/entities/rentee';

export interface ICounter {
  id: number;
  month: number;
  date_start: number;
  date_end: number;
  status: boolean;
  counter_water: number;
  counter_electricity: number;
  penalty: number;
  debt: number;
  comment?: string;

  renteeId: number;

  rentee?: IRentee;
}

export type ICounterIncludes = Array<'Rentee'>;

export type ICounterScopes = {
  withRentees: '';
  isDebt: '';
  byAgreement?: number;
  withPeriod?: {
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

export async function getCounter({ id }: { id: number }): Promise<ICounter> {
  return await useApi<ICounter>({
    route: `counters/${id}`,
    method: httpMethod.GET,
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
