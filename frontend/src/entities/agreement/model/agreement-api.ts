import { httpMethod, useApi, serializeQuery } from '@/shared/api';
import { IRentee } from '@/entities/rentee/@x/agreement';
import { IPayMonth } from '@/entities/payMonth/@x/agreement';

export interface IAgreement {
  id: number;
  renteeId: number;
  rentee: IRentee;

  pay_months: IPayMonth[];

  name: string;
  status: boolean;
  date_start: number;
  date_end: number;
  comment: string;
}

export type IAgreementScopes = Array<
  'isActive' | 'isActual' | 'isExpired' | 'isExpiredAndActive'
>;
export type IAgreementIncludes = Array<'PayMonth' | 'Rentee'>;

export async function getAllAgreements({
  scopes = [],
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
