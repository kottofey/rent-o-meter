import { useApi, httpMethod, serializeQuery } from '@/shared/api';

// TODO дописать скоупы если будут
// TODO написать алгоритм сериализации с проверкой через zod
export interface ITarif {
  id: number;
  water: number;
  electricity: number;
  heat: number;
  gas: number;
  renovation: number;
  tko: number;
  managing_company: number;
  domofon: number;
  comment?: string;
}

export type ITarifScopes = Array<''>;
export type ITarifIncludes = Array<'Counter'>;

export async function getAllTarifs({
  scopes,
  includes = [],
}: {
  scopes?: ITarifScopes;
  includes?: ITarifIncludes;
}): Promise<ITarif[]> {
  return await useApi<ITarif[]>({
    route: 'tarifs',
    method: httpMethod.GET,
    query: serializeQuery({ scopes, includes }),
  });
}

export async function getTarif({ id }: { id: number }): Promise<ITarif> {
  return await useApi<ITarif>({
    route: `tarifs/${id}`,
    method: httpMethod.GET,
  });
}

export async function createTarif({
  tarif,
}: {
  tarif: Partial<ITarif>;
}): Promise<ITarif> {
  return await useApi<ITarif>({
    route: `tarifs`,
    method: httpMethod.POST,
    body: JSON.stringify(tarif),
  });
}

export async function deleteTarif({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `tarifs/${id}`,
    method: httpMethod.DELETE,
  });
}

export async function restoreTarif({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `tarifs/${id}/restore`,
    method: httpMethod.PUT,
  });
}

export async function editTarif({
  id,
  updatedTarif,
}: {
  id: number;
  updatedTarif: Partial<ITarif>;
}): Promise<ITarif> {
  return await useApi<ITarif>({
    route: `tarifs/${id}`,
    method: httpMethod.PUT,
    body: JSON.stringify(updatedTarif),
  });
}
