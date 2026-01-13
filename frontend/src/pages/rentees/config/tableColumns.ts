import { type DataTableColumns, NTag } from 'naive-ui';
import { h } from 'vue';

import { type IRentee } from '@/entities/rentee';
import { dayjs } from '@/shared/lib/dayjs';
import { parsePhone } from '@/shared/lib/parsePhone';

const statusColors = {
  active: {
    color: 'green',
    textColor: 'black',
  },
  expired: {
    color: 'red',
    textColor: 'black',
  },
};

export const columns: DataTableColumns<IRentee> = [
  {
    title: 'id',
    key: 'id',
  },
  {
    title: 'Название',
    key: 'name',
  },
  {
    title: 'Фамилия',
    key: 'surname',
  },
  {
    title: 'Имя',
    key: 'firstname',
  },
  {
    title: 'Отчество',
    key: 'patronymic',
  },
  {
    title: 'Телефон',
    key: 'phone',
    render: (row: IRentee) => {
      return parsePhone(row.phone);
    },
  },
  {
    title: 'Почта',
    key: 'email',
  },
  {
    title: 'Статус',
    key: 'status',
    align: 'center',
    render: (row: IRentee) => {
      return h(
        NTag,
        {
          color: {
            color: row.status
              ? statusColors.active.color
              : statusColors.expired.color,
            textColor: row.status
              ? statusColors.active.textColor
              : statusColors.expired.textColor,
          },
        },
        {
          default: () => (row.status ? 'Активный' : 'Не активный'),
        },
      );
    },
  },
  {
    title: 'Начало',
    key: 'date_start',
    render: (row: IRentee) => dayjs(row.date_start).format('YYYY-MM-DD'),
  },
  {
    title: 'Окончание',
    key: 'date_end',
    render: (row: IRentee) =>
      row.date_end && dayjs(row.date_end).format('YYYY-MM-DD'),
  },
  {
    title: 'Комментарий',
    key: 'comment',
  },
];
