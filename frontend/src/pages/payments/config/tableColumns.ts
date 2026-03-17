import { type DataTableColumns } from 'naive-ui';

import { parseDate } from '@/shared/lib/parseDate';
import { parseMoney } from '@/shared/lib';
import type { IPayment } from '@/entities/payment';

export const createColumns = (): DataTableColumns<IPayment> => [
  {
    title: 'id',
    key: 'id',
    align: 'center',
  },
  {
    title: 'Договор',
    align: 'center',
    key: 'bill.agreement.name',
  },
  {
    title: 'Арендатор',
    align: 'center',
    key: 'bill.agreement.rentee.fullName',
  },
  {
    title: 'Счет за',
    key: 'bill.month',
    align: 'center',
    render: (row: IPayment) => {
      if (row.bill) {
        return parseDate({ date: row.bill.month, format: 'MMMM YYYY' });
      } else {
        return '???';
      }
    },
  },
  {
    title: 'Дата оплаты',
    key: 'date',
    align: 'center',
    render: (row) => parseDate({ date: row.date }),
  },
  {
    title: 'Сумма',
    key: 'ammount',
    align: 'center',
    render: (row) => parseMoney({ ammount: row.ammount, mode: 'rubbles' }),
  },
  {
    title: 'Комментарий',
    key: 'comment',
    align: 'center',
  },
];
