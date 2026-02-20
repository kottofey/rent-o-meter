import { useApi, httpMethod, serializeQuery } from '@/shared/api';
import { IRentee } from '@/entities/rentee';

// TODO дописать скоупы если будут
// TODO написать алгоритм сериализации с проверкой через zod
export interface IUser {
  id: number;
  rentee_id: number;

  surname: string;
  firstname: string;
  patronymic: string;
  full_name: string;

  email: string;
  status: boolean;
  last_login: number;

  comment: string;

  roles: string[];
  rentee?: IRentee;
}

export type IUserScopes = {
  'user:activeOnly': boolean;
};
export type IUserIncludes = Array<'Role' | 'Rentee'>;

export async function getAllUsers({
  scopes,
  includes = [],
}: {
  scopes?: IUserScopes;
  includes?: IUserIncludes;
}): Promise<IUser[]> {
  return await useApi<IUser[]>({
    route: 'users',
    method: httpMethod.GET,
    query: serializeQuery({ scopes, includes }),
  });
}

export async function getUser({ id }: { id: number }): Promise<IUser> {
  return await useApi<IUser>({
    route: `users/${id}`,
    method: httpMethod.GET,
  });
}

export async function createUser({
  user,
}: {
  user: Partial<IUser>;
}): Promise<IUser> {
  return await useApi<IUser>({
    route: `users`,
    method: httpMethod.POST,
    body: JSON.stringify(user),
  });
}

export async function deleteUser({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `users/${id}`,
    method: httpMethod.DELETE,
  });
}

export async function restoreUser({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `users/${id}/restore`,
    method: httpMethod.PUT,
  });
}

export async function editUser({
  id,
  updatedUser,
}: {
  id: number;
  updatedUser: Partial<IUser>;
}): Promise<IUser> {
  return await useApi<IUser>({
    route: `users/${id}`,
    method: httpMethod.PUT,
    body: JSON.stringify(updatedUser),
  });
}
