import { useApi, method } from '@/shared/api';
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

  agreements: IAgreement[];
}

export async function getAllRentees(): Promise<IRentee[]> {
  return await useApi<IRentee[]>({
    route: 'rentees',
    method: method.GET,
  });
}

export async function getRentee(id: number): Promise<IRentee> {
  return await useApi<IRentee>({
    route: `rentees/${id}`,
    method: method.GET,
  });
}

export async function createRentee(rentee: IRentee): Promise<IRentee> {
  return await useApi<IRentee>({
    route: `rentees`,
    method: method.POST,
    body: JSON.stringify(rentee),
  });
}

export async function deleteRentee(id: number): Promise<void> {
  return await useApi({
    route: `rentees/${id}`,
    method: method.DELETE,
  });
}

export async function restoreRentee(id: number): Promise<void> {
  return await useApi({
    route: `rentees/${id}/restore`,
    method: method.PUT,
  });
}

export async function editRentee(
  id: number,
  updatedRentee: Partial<IRentee>,
): Promise<IRentee> {
  return await useApi<IRentee>({
    route: `rentees/${id}`,
    method: method.PUT,
    body: JSON.stringify(updatedRentee),
  });
}
