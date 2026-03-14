import { type DataTableColumns, NTag } from 'naive-ui';
import { type h } from 'vue';

import { type IBill } from '@/entities/bill';
import { parseDate } from '@/shared/lib/parseDate';
import { parseMoney } from '@/shared/lib';

const statusColors = {
  paid: {
    color: 'springgreen',
    textColor: 'black',
  },
  debt: {
    color: 'tomato',
    textColor: 'black',
  },
};

export const createColumns = ({
  hFunc,
}: {
  hFunc: typeof h;
}): DataTableColumns<IBill> => [
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
      return hFunc(
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
    render: (row: IBill) =>
      parseMoney({ ammount: row.ammount, mode: 'rubbles' }),
  },
  {
    title: 'Дополнительно',
    key: 'extra_ammount',
    align: 'center',
    render: (row: IBill) =>
      parseMoney({ ammount: row.extra_ammount, mode: 'rubbles' }),
  },
  {
    title: 'Оплачено',
    key: 'ammount_paid',
    align: 'center',
    render: (row: IBill) =>
      parseMoney({ ammount: row.ammount_paid, mode: 'rubbles' }),
  },
  {
    title: 'Δ',
    key: 'ammount_paid',
    align: 'center',
    render: (row: IBill) =>
      hFunc(
        'p',
        {
          style: {
            color:
              row.ammount + row.extra_ammount - row.ammount_paid !== 0
                ? 'red'
                : 'green',
          },
        },
        {
          default: () =>
            parseMoney({
              ammount: row.ammount + row.extra_ammount - row.ammount_paid,
              mode: 'rubbles',
            }),
        },
      ),
  },
  {
    title: 'Комментарий',
    key: 'comment',
    align: 'center',
  },
];
