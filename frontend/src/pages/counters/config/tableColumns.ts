import { type DataTableColumns, NTag } from 'naive-ui';
import { h } from 'vue';

import { checkExpiry } from '@/shared/lib/checkExpiry';
import { RenteeInfoPopover } from '@/widgets/rentee-info-popover';
import { type IAgreement } from '@/entities/agreement';
import { dayjs } from '@/shared/lib/dayjs';

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

export const columns: DataTableColumns<IAgreement> = [
  {
    title: 'id',
    key: 'id',
  },
  {
    title: 'Название',
    key: 'name',
  },
  {
    title: 'Арендатор ФИО',
    key: 'rentee.id',
    defaultSortOrder: 'ascend',

    sorter: {
      compare: (row1: IAgreement, row2: IAgreement) =>
        row1.rentee.id - row2.rentee.id,
      multiple: 2,
    },
    render: (row: IAgreement) => {
      return h(
        RenteeInfoPopover,
        {
          rentee: row.rentee,
        },
        {
          default: () =>
            `${row.rentee.surname} ${row.rentee.firstname} ${row.rentee.patronymic}`,
        },
      );
    },
  },
  {
    title: 'Начало',
    key: 'date_start',
    defaultSortOrder: 'descend',
    sorter: {
      compare: (row1: IAgreement, row2: IAgreement) =>
        row1.date_start - row2.date_start,
      multiple: 1,
    },
    render: (row: IAgreement) => dayjs(row.date_start).format('YYYY-MM-DD'),
  },
  {
    title: 'Окончание',
    key: 'date_end',
    render: (row: IAgreement) => checkExpiry(row.date_end),
  },
  {
    title: 'Статус',
    key: 'status',
    align: 'center',
    render: (row: IAgreement) => {
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
          default: () => (row.status ? 'Активный' : 'Расторгнут'),
        },
      );
    },
  },
  {
    title: 'Комментарий',
    key: 'comment',
  },
];
