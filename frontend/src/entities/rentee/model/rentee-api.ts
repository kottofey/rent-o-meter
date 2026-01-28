import { useApi, httpMethod, serializeQuery } from '@/shared/api';
import { IAgreement } from '@/entities/agreement/@x/rentee';

export interface IRentee {
  id: number;
  surname: string;
  firstname: string;
  patronymic?: string;
  comment?: string;
  status: boolean;
  date_start: number;
  date_end: number;
  phone: string;
  email: string;

  deletedAt: Date;

  agreements: IAgreement[];

  // Virtuals
  fullName: string;
}

// TODO дописать скоупы если будут
// TODO написать алгоритм сериализации с проверкой через zod
export type IRenteeScopes = {
  'rentee:withActiveAgreement'?: boolean;
  'rentee:withDeleted'?: boolean;
};
export type IRenteeIncludes = Array<'Agreement'>;

export async function getAllRentees({
  scopes,
  includes = [],
}: {
  scopes?: IRenteeScopes;
  includes?: IRenteeIncludes;
}): Promise<IRentee[]> {
  return await useApi<IRentee[]>({
    route: 'rentees',
    method: httpMethod.GET,
    query: serializeQuery({ scopes, includes }),
  });
}

export async function getRentee({
  id,
  scopes,
  includes,
}: {
  id: number;
  scopes?: IRenteeScopes;
  includes?: IRenteeIncludes;
}): Promise<IRentee> {
  return await useApi<IRentee>({
    route: `rentees/${id}`,
    method: httpMethod.GET,
    query: serializeQuery({ scopes, includes }),
  });
}

export async function createRentee({
  rentee,
}: {
  rentee: Partial<IRentee>;
}): Promise<IRentee> {
  return await useApi<IRentee>({
    route: `rentees`,
    method: httpMethod.POST,
    body: JSON.stringify(rentee),
  });
}

export async function deleteRentee({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `rentees/${id}`,
    method: httpMethod.DELETE,
  });
}

export async function restoreRentee({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `rentees/${id}/restore`,
    method: httpMethod.PUT,
  });
}

export async function editRentee({
  id,
  updatedRentee,
}: {
  id: number;
  updatedRentee: Partial<IRentee>;
}): Promise<IRentee> {
  return await useApi<IRentee>({
    route: `rentees/${id}`,
    method: httpMethod.PUT,
    body: JSON.stringify(updatedRentee),
  });
}
