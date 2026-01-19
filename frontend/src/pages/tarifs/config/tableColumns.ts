import { type DataTableColumns } from 'naive-ui';

import { type ITarif } from '@/entities/tarif';
import { parseDate } from '@/shared/lib/parseDate';

export const columns: DataTableColumns<ITarif> = [
  {
    title: 'id',
    key: 'id',
    align: 'center',
  },
  {
    title: 'Действует с',
    key: 'actual_from',
    align: 'center',
    render: (row: ITarif) => parseDate({ date: row.actual_from }),
  },
  {
    title: 'Вода',
    key: 'water',
    align: 'center',
  },
  {
    title: 'Электричество',
    key: 'electricity',
    align: 'center',
  },
  {
    title: 'Тепло',
    key: 'heat',
    align: 'center',
  },
  {
    title: 'Газ',
    key: 'gas',
    align: 'center',
  },
  {
    title: 'Капремонт',
    key: 'renovation',
    align: 'center',
  },
  {
    title: 'ТКО',
    key: 'tko',
    align: 'center',
  },
  {
    title: 'УК (квартплата)',
    key: 'managing_company',
    align: 'center',
  },
  {
    title: 'Домофон',
    key: 'domofon',
    align: 'center',
  },

  {
    title: 'Комментарий',
    key: 'comment',
    titleAlign: 'center',
  },
];
