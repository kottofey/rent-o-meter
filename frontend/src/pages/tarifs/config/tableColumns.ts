import { type DataTableColumns, NTag } from 'naive-ui';
import { h } from 'vue';

import { type ITarif } from '@/entities/tarif';

export const columns: DataTableColumns<ITarif> = [
  {
    title: 'id',
    key: 'id',
    align: 'center',
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
