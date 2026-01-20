import { type DataTableColumns } from 'naive-ui';

import { type ITarif } from '@/entities/tarif';
import { parseDate } from '@/shared/lib/parseDate';
import { parseMoney } from '@/shared/lib/parseMoney';

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
    render: (row: ITarif) =>
      parseMoney({ ammount: row.water, mode: 'kopeyki' }),
  },
  {
    title: 'Свет (до 150кВт)',
    key: 'electricity',
    align: 'center',
    render: (row: ITarif) =>
      parseMoney({ ammount: row.electricity, mode: 'kopeyki' }),
  },
  {
    title: 'Свет (более 150кВт)',
    key: 'electricity_over_150kw',
    align: 'center',
    render: (row: ITarif) =>
      parseMoney({ ammount: row.electricity_over_150kw, mode: 'kopeyki' }),
  },
  {
    title: 'Тепло',
    key: 'heat',
    align: 'center',
    render: (row: ITarif) => parseMoney({ ammount: row.heat, mode: 'kopeyki' }),
  },
  {
    title: 'Газ',
    key: 'gas',
    align: 'center',
    render: (row: ITarif) => parseMoney({ ammount: row.gas, mode: 'kopeyki' }),
  },
  {
    title: 'Капремонт',
    key: 'renovation',
    align: 'center',
    render: (row: ITarif) =>
      parseMoney({ ammount: row.renovation, mode: 'kopeyki' }),
  },
  {
    title: 'ТКО',
    key: 'tko',
    align: 'center',
    render: (row: ITarif) => parseMoney({ ammount: row.tko, mode: 'kopeyki' }),
  },
  {
    title: 'УК (квартплата)',
    key: 'managing_company',
    align: 'center',
    render: (row: ITarif) =>
      parseMoney({ ammount: row.managing_company, mode: 'kopeyki' }),
  },
  {
    title: 'Домофон',
    key: 'domofon',
    align: 'center',
    render: (row: ITarif) =>
      parseMoney({ ammount: row.domofon, mode: 'kopeyki' }),
  },

  {
    title: 'Комментарий',
    key: 'comment',
    titleAlign: 'center',
  },
];
