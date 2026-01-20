import { type DataTableColumns, NTag } from 'naive-ui';
import { h } from 'vue';

import { type IBill } from '@/entities/bill';
import { parseDate } from '@/shared/lib/parseDate';

const statusColors = {
  paid: {
    color: 'green',
    textColor: 'black',
  },
  debt: {
    color: 'red',
    textColor: 'black',
  },
};

export const columns: DataTableColumns<IBill> = [
  {
    title: 'id',
    key: 'id',
    align: 'center',
  },
  {
    title: 'ФИО',
    key: 'agreement.rentee.fullName',
    align: 'center',
  },
  {
    title: 'Договор',
    key: 'agreement.name',
    align: 'center',
  },
  {
    title: 'Дата счёта',
    key: 'bill_date',
    align: 'center',
    render: (row: IBill) => parseDate({ date: row.bill_date }),
  },
  {
    title: 'Оплата за',
    key: 'month',
    align: 'center',
    render: (row: IBill) => {
      return parseDate({ date: row.month, format: 'MMMM YYYY' });
    },
  },
  {
    title: 'Статус оплаты',
    key: 'status',
    align: 'center',
    render: (row: IBill) => {
      return h(
        NTag,
        {
          color: {
            color: row.status
              ? statusColors.paid.color
              : statusColors.debt.color,
            textColor: row.status
              ? statusColors.paid.textColor
              : statusColors.debt.textColor,
          },
        },
        {
          default: () => (row.status ? 'Оплачено' : 'Не оплачено'),
        },
      );
    },
  },

  {
    title: 'Сумма',
    key: 'ammount',
    align: 'center',
  },
  {
    title: 'Дополнительно',
    key: 'extra_ammount',
    align: 'center',
  },

  {
    title: 'Оплачено',
    key: 'ammount_paid',
    align: 'center',
  },
  {
    title: 'Комментарий',
    key: 'comment',
    align: 'center',
  },
];
