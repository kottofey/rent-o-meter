import { type DataTableColumns, NTag } from 'naive-ui';
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
    title: 'Месяц',
    key: 'month',
    align: 'center',
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
    key: 'counter_water',
    align: 'center',
  },
  {
    title: 'Свет',
    key: 'counter_electricity',
    align: 'center',
  },
  {
    title: 'Комментарий',
    key: 'comment',
    align: 'center',
  },
];
