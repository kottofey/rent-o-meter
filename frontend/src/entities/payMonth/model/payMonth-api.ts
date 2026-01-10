import { httpMethod, useApi, serializeQuery } from '@/shared/api';
import { ITarif } from '@/entities/tarif/@x/payMonth';
import { IAgreement } from '@/entities/agreement/@x/payMonth';

export interface IPayMonth {
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

  tarif?: ITarif;
  agreement?: IAgreement;
}

export type IPayMonthIncludes = Array<'Tarif' | 'Agreement'>;
export type IPayMonthScopes =
  | Array<'isDebt'>
  | {
      byAgreement?: number;
      withPeriod?: {
        start: number | string;
        end: number | string;
      };
    };

export async function getAllPayMonths({
  scopes = [],
  includes = [],
}: {
  scopes?: IPayMonthScopes;
  includes?: IPayMonthIncludes;
}): Promise<IPayMonth[]> {
  return await useApi<IPayMonth[]>({
    route: 'payMonths',
    method: httpMethod.GET,
    query: serializeQuery({ scopes, includes }),
  });
}

export async function getPayMonth({ id }: { id: number }): Promise<IPayMonth> {
  return await useApi<IPayMonth>({
    route: `payMonths/${id}`,
    method: httpMethod.GET,
  });
}

export async function createPayMonth({
  payMonth,
}: {
  payMonth: Partial<IPayMonth>;
}): Promise<IPayMonth> {
  return await useApi<IPayMonth>({
    route: `payMonths`,
    method: httpMethod.POST,
    body: JSON.stringify(payMonth),
  });
}

export async function deletePayMonth({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `payMonths/${id}`,
    method: httpMethod.DELETE,
  });
}

export async function restorePayMonth({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `payMonths/${id}/restore`,
    method: httpMethod.PUT,
  });
}

export async function editPayMonth({
  id,
  updatedPayMonth,
}: {
  id: number;
  updatedPayMonth: Partial<IPayMonth>;
}): Promise<IPayMonth> {
  return await useApi<IPayMonth>({
    route: `payMonths/${id}`,
    method: httpMethod.PUT,
    body: JSON.stringify(updatedPayMonth),
  });
}
