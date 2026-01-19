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
  // {
  //   title: 'Название',
  //   key: 'name',
  // },
  // {
  //   title: 'Арендатор ФИО',
  //   key: 'rentee.id',
  //   defaultSortOrder: 'ascend',
  //
  //   sorter: {
  //     compare: (row1: IAgreement, row2: IAgreement) =>
  //       row1.rentee.id - row2.rentee.id,
  //     multiple: 2,
  //   },
  //   render: (row: IAgreement) => {
  //     return h(
  //       RenteeInfoPopover,
  //       {
  //         rentee: row.rentee,
  //       },
  //       {
  //         default: () =>
  //           `${row.rentee.surname} ${row.rentee.firstname} ${row.rentee.patronymic}`,
  //       },
  //     );
  //   },
  // },
  // {
  //   title: 'Начало',
  //   key: 'date_start',
  //   defaultSortOrder: 'descend',
  //   sorter: {
  //     compare: (row1: IAgreement, row2: IAgreement) =>
  //       row1.date_start - row2.date_start,
  //     multiple: 1,
  //   },
  //   render: (row: IAgreement) => dayjs(row.date_start).format('YYYY-MM-DD'),
  // },
  // {
  //   title: 'Окончание',
  //   key: 'date_end',
  //   render: (row: IAgreement) => checkExpiry(row.date_end),
  // },
  // {
  //   title: 'Статус',
  //   key: 'status',
  //   align: 'center',
  //   render: (row: IAgreement) => {
  //     return h(
  //       NTag,
  //       {
  //         color: {
  //           color: row.status
  //             ? statusColors.active.color
  //             : statusColors.expired.color,
  //           textColor: row.status
  //             ? statusColors.active.textColor
  //             : statusColors.expired.textColor,
  //         },
  //       },
  //       {
  //         default: () => (row.status ? 'Активный' : 'Расторгнут'),
  //       },
  //     );
  //   },
  // },
  // {
  //   title: 'Комментарий',
  //   key: 'comment',
  // },
];
