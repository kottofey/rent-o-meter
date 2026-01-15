import { type DataTableColumns, NTag } from 'naive-ui';
import { h } from 'vue';

import { checkExpiry } from '@/shared/lib/checkExpiry';
import { type IAgreement } from '@/entities/agreement';
import { parseDate } from '@/shared/lib/parseDate';
import { RenteeInfoPopover } from '@/shared/ui';

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
    align: 'center',
  },
  {
    title: 'Название',
    key: 'name',
    align: 'center',
  },
  {
    title: 'Арендатор ФИО',
    key: 'rentee.id',
    defaultSortOrder: 'ascend',
    align: 'center',
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
          default: () => row.rentee.fullName,
        },
      );
    },
  },
  {
    title: 'Начало',
    key: 'date_start',
    align: 'center',
    defaultSortOrder: 'descend',
    sorter: {
      compare: (row1: IAgreement, row2: IAgreement) =>
        row1.date_start - row2.date_start,
      multiple: 1,
    },
    render: (row: IAgreement) => parseDate(row.date_start),
  },
  {
    title: 'Окончание',
    key: 'date_end',
    align: 'center',
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
