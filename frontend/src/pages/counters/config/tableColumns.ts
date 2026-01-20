import { type DataTableColumns } from 'naive-ui';
import { h } from 'vue';

import { type ICounter } from '@/entities/counter';
import { parseDate } from '@/shared/lib/parseDate';
import { RenteeInfoPopover } from '@/shared/ui';

export const columns: DataTableColumns<ICounter> = [
  {
    title: 'id',
    key: 'id',
    align: 'center',
  },
  {
    title: 'Арендатор',
    key: 'renteeId',
    align: 'center',
    render: (row: ICounter) => {
      return h(
        RenteeInfoPopover,
        {
          rentee: row.agreement?.rentee,
        },
        {
          default: () => row.agreement.rentee.fullName,
        },
      );
    },
  },
  {
    title: 'Договор',
    key: 'agreement.name',
    align: 'center',
  },
  {
    title: 'Месяц',
    key: 'month',
    align: 'center',
    sorter: 'default',
    defaultSortOrder: 'descend',
    render: (row: ICounter) =>
      parseDate({ date: row.month, format: 'MMMM YYYY' }),
  },
  {
    title: 'С',
    key: 'date_start',
    align: 'center',
    render: (row: ICounter) =>
      parseDate({ date: row.date_start, format: 'DD MMM YYYY' }),
  },
  {
    title: 'По',
    key: 'date_end',
    align: 'center',
    render: (row: ICounter) =>
      parseDate({ date: row.date_end, format: 'DD MMM YYYY' }),
  },

  {
    title: 'Вода',
    key: 'water_diff',
    align: 'center',
    render: (row: ICounter) => row.water_diff + ' м\u00B3',
  },
  {
    title: 'Свет',
    key: 'electricity_diff',
    align: 'center',
    render: (row: ICounter) => row.electricity_diff + ' кВт',
  },
  {
    title: 'Комментарий',
    key: 'comment',
    align: 'center',
  },
];
