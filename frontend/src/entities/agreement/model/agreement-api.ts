import { httpMethod, useApi, serializeQuery } from '@/shared/api';
import { IRentee } from '@/entities/rentee/@x/agreement';
import { ICounter } from '@/entities/counter/@x/agreement';
import { IBill } from '@/entities/bill/@x/agreement';

export interface IAgreement {
  id: number;
  name: string;
  status: boolean;
  date_start: number;
  date_end: number;
  penalty: number;
  debt: number;
  comment: string;

  deletedAt: Date;

  renteeId: number;
  rentee: IRentee;

  counters: ICounter[];
  bills: IBill[];
}

export type IAgreementScopes = {
  'agreements:activeOnly'?: boolean;
  'agreements:isNotExpired'?: boolean;
  'agreements:isExpired'?: boolean;
  'agreements:isExpiredAndActive'?: boolean;
  'agreements:byRentee'?: number;
  'agreements:withDeleted'?: boolean;
};

export type IAgreementIncludes = Array<'Rentee' | 'Counter' | 'Bill'>;

export async function getAllAgreements({
  scopes,
  includes = [],
}: {
  scopes?: IAgreementScopes;
  includes?: IAgreementIncludes;
}): Promise<IAgreement[]> {
  return await useApi<IAgreement[]>({
    route: 'agreements',
    method: httpMethod.GET,
    query: serializeQuery({ scopes, includes }),
  });
}

export async function getAgreement({
  id,
}: {
  id: number;
}): Promise<IAgreement> {
  return await useApi<IAgreement>({
    route: `agreements/${id}`,
    method: httpMethod.GET,
  });
}

export async function createAgreement({
  agreement,
}: {
  agreement: Partial<IAgreement>;
}): Promise<IAgreement> {
  return await useApi<IAgreement>({
    route: `agreements`,
    method: httpMethod.POST,
    body: JSON.stringify(agreement),
  });
}

export async function deleteAgreement({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `agreements/${id}`,
    method: httpMethod.DELETE,
  });
}

export async function restoreAgreement({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `agreements/${id}/restore`,
    method: httpMethod.PUT,
  });
}

export async function editAgreement({
  id,
  updatedAgreement,
}: {
  id: number;
  updatedAgreement: Partial<IAgreement>;
}): Promise<IAgreement> {
  return await useApi<IAgreement>({
    route: `agreements/${id}`,
    method: httpMethod.PUT,
    body: JSON.stringify(updatedAgreement),
  });
}
