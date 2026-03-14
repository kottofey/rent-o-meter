import { type DataTableColumns, NCheckbox } from 'naive-ui';
import type { h } from 'vue';

import { dayjs } from '@/shared/lib/dayjs';
import type { IUser } from '@/entities/user';

export const createColumns = ({
  hFunc,
}: {
  hFunc: typeof h;
}): DataTableColumns<IUser> => [
  {
    title: 'id',
    key: 'id',
    width: 80,
    align: 'center',
  },
  {
    title: 'ФИО',
    key: 'full_name',
    align: 'center',
  },
  {
    title: 'Статус',
    key: 'status',
    width: 80,
    align: 'center',
    render: (row: IUser) =>
      hFunc(NCheckbox, {
        disabled: true,
        checked: row.status,
      }),
  },
  {
    title: 'Арендатор',
    key: 'rentee_id',
    width: 110,
    align: 'center',
    render: (row: IUser) =>
      hFunc(NCheckbox, {
        disabled: true,
        checked: !!row.rentee_id,
      }),
  },
  {
    title: 'Последний вход',
    key: 'last_login',
    align: 'center',
    render: (row: IUser) =>
      row.last_login && dayjs(row.last_login).format('DD.MM.YYYY HH:mm:ss'),
  },
  {
    title: 'Email',
    key: 'email',
    align: 'center',
  },

  {
    title: 'Комментарий',
    key: 'comment',
    align: 'center',
  },
];
