import { type DataTableColumns } from 'naive-ui';

import { type ITarif } from '@/entities/tarif';
import { parseDate } from '@/shared/lib/parseDate';
import { parseMoney } from '@/shared/lib/parseMoney';

const tarifTypesMap = {
  electricity: 'Свет (до 150кВт)',
  electricity_over_150kw: 'Свет (сверх 150кВт)',
  water_in: 'Подведение воды',
  water_out: 'Отведение воды',
  heat: 'Тепло',
  gas: 'Газ',
  renovation: 'Капремонт',
  tko: 'ТКО',
  managing_company: 'УК (квартплата)',
  domofon: 'Домофон',
};

export const columns: DataTableColumns<ITarif> = [
  {
    title: 'id',
    key: 'id',
    align: 'center',
  },
  {
    title: 'Тип',
    key: 'tarif_type',
    align: 'center',
    render: (row: ITarif) => tarifTypesMap[row.tarif_type],
  },
  {
    title: 'Тариф',
    key: 'rate',
    align: 'center',
    render: (row: ITarif) => parseMoney({ ammount: row.rate, mode: 'kopeyki' }),
  },
  {
    title: 'Действует с',
    key: 'actual_from',
    align: 'center',
    render: (row: ITarif) => parseDate({ date: row.valid_from }),
  },
  {
    title: 'Действует по',
    key: 'actual_from',
    align: 'center',
    render: (row: ITarif) => parseDate({ date: row.valid_to }),
  },

  {
    title: 'Комментарий',
    key: 'comment',
    titleAlign: 'center',
  },
];
