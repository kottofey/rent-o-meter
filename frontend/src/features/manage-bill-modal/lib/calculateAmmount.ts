import { requiredTarifs } from './requiredTarifs';

import { ITarif } from '@/entities/tarif';
import { ICounter } from '@/entities/counter';
import { dayjs } from '@/shared/lib/dayjs';

const checkTarifs = (tarifs: ITarif[]): string[] => {
  const tarifTypes = new Set<string>(tarifs.map((t) => t.tarif_type));
  return requiredTarifs.filter((type) => !tarifTypes.has(type));
};
export function calculateAmmount({
  tarifs,
  counter,
}: {
  tarifs: ITarif[];
  counter: ICounter;
}): {
  total: number;
  water: number;
  electricity: number;
  heat: number;
  gas: number;
  managing_company: number;
  domofon: number;
  tko: number;
  renovation: number;
} {
  // -----------------------------------------------------------------------------
  // Валидация
  // -----------------------------------------------------------------------------

  const check = checkTarifs(tarifs);

  if (check.length > 0) {
    throw new Error(`Отсутствуют тарифы: ${JSON.stringify(check)}`);
  }

  if (!counter) {
    throw new Error(`Отсутствуют показания счетчиков`);
  }

  // -----------------------------------------------------------------------------
  // Даты и дни
  // -----------------------------------------------------------------------------

  const dateStart = counter.date_start;
  const dateEnd = counter.date_end;

  const daysPrevMonth = dayjs(dateStart).isSame(dateEnd, 'month')
    ? dayjs(dateEnd).diff(dayjs(dateStart), 'day') + 1
    : dayjs(dateStart).endOf('month').diff(dayjs(dateStart), 'days') + 1;

  const daysThisMonth = dayjs(dateStart).isSame(dateEnd, 'month')
    ? 0
    : dayjs(dateEnd).diff(dayjs(dateEnd).startOf('month'), 'days') + 1;

  const totalDaysInPrevMonth = dayjs(dateStart).daysInMonth();
  const totalDaysInThisMonth = dayjs(dateEnd).daysInMonth();

  // -----------------------------------------------------------------------------
  // Вычисление тарифов
  // -----------------------------------------------------------------------------

  const actualTarifs = {
    water: {
      prevMonth:
        (tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'water_in' && tarif.valid_from <= dateStart,
        )?.rate || NaN) +
        (tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'water_out' && tarif.valid_from <= dateStart,
        )?.rate || NaN),
      thisMonth:
        (tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'water_in' && tarif.valid_to >= dateEnd,
        )?.rate || NaN) +
        (tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'water_out' && tarif.valid_to >= dateEnd,
        )?.rate || NaN),
    },
    electricity: {
      prevMonth:
        tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'electricity' && tarif.valid_from <= dateStart,
        )?.rate || NaN,
      thisMonth:
        tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'electricity' && tarif.valid_to >= dateEnd,
        )?.rate || NaN,
    },
    electricity_over_150kw: {
      prevMonth:
        tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'electricity_over_150kw' &&
            tarif.valid_from <= dateStart,
        )?.rate || NaN,
      thisMonth:
        tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'electricity_over_150kw' &&
            tarif.valid_to >= dateEnd,
        )?.rate || NaN,
    },
    managing_company: {
      prevMonth:
        tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'managing_company' &&
            tarif.valid_from <= dateStart,
        )?.rate || NaN,
      thisMonth:
        tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'managing_company' &&
            tarif.valid_to >= dateEnd,
        )?.rate || NaN,
    },
    domofon: {
      prevMonth:
        tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'domofon' && tarif.valid_from <= dateStart,
        )?.rate || NaN,
      thisMonth:
        tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'domofon' && tarif.valid_to >= dateEnd,
        )?.rate || NaN,
    },
    heat: {
      prevMonth:
        tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'heat' && tarif.valid_from <= dateStart,
        )?.rate || NaN,
      thisMonth:
        tarifs.find(
          (tarif) => tarif.tarif_type === 'heat' && tarif.valid_to >= dateEnd,
        )?.rate || NaN,
    },
    gas: {
      prevMonth:
        tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'gas' && tarif.valid_from <= dateStart,
        )?.rate || NaN,
      thisMonth:
        tarifs.find(
          (tarif) => tarif.tarif_type === 'gas' && tarif.valid_to >= dateEnd,
        )?.rate || NaN,
    },
    renovation: {
      prevMonth:
        tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'renovation' && tarif.valid_from <= dateStart,
        )?.rate || NaN,
      thisMonth:
        tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'renovation' && tarif.valid_to >= dateEnd,
        )?.rate || NaN,
    },
    tko: {
      prevMonth:
        tarifs.find(
          (tarif) =>
            tarif.tarif_type === 'tko' && tarif.valid_from <= dateStart,
        )?.rate || NaN,
      thisMonth:
        tarifs.find(
          (tarif) => tarif.tarif_type === 'tko' && tarif.valid_to >= dateEnd,
        )?.rate || NaN,
    },
  };

  // -----------------------------------------------------------------------------
  // Расчет сумм для коммуналки без счетчиков
  // -----------------------------------------------------------------------------

  const constAmmount =
    ((actualTarifs.managing_company.prevMonth +
      actualTarifs.domofon.prevMonth +
      actualTarifs.heat.prevMonth +
      actualTarifs.gas.prevMonth +
      actualTarifs.renovation.prevMonth +
      actualTarifs.tko.prevMonth) /
      totalDaysInPrevMonth) *
      daysPrevMonth +
    ((actualTarifs.managing_company.thisMonth +
      actualTarifs.domofon.thisMonth +
      actualTarifs.heat.thisMonth +
      actualTarifs.gas.thisMonth +
      actualTarifs.renovation.thisMonth +
      actualTarifs.tko.thisMonth) /
      totalDaysInThisMonth) *
      daysThisMonth;

  // -----------------------------------------------------------------------------
  // Расчет воды
  //
  //   Берём среднее арифметическое от тарифов прошлого и текущего месяцев,
  //   так как неизвестно сколько потрачено кубов в прошлом и текущем месяце.
  //   Вряд ли повышение тарифа будет сильно резким, разницей пренебрегаем.
  // -----------------------------------------------------------------------------

  const wTarifAv =
    (actualTarifs.water.thisMonth + actualTarifs.water.prevMonth) / 2;

  const waterAmmount = wTarifAv * counter.water_diff;

  // -----------------------------------------------------------------------------
  // Расчет света
  //
  //    То же, что и для воды, считаем среднее арифметическое для тарифа
  // -----------------------------------------------------------------------------

  let electricityAmmount = 0;

  const elTarifAv =
    (actualTarifs.electricity.prevMonth + actualTarifs.electricity.thisMonth) /
    2;

  const el150TarifAv =
    (actualTarifs.electricity_over_150kw.prevMonth +
      actualTarifs.electricity_over_150kw.thisMonth) /
    2;

  if (counter.electricity_diff <= 150) {
    electricityAmmount = elTarifAv * counter.electricity_diff;
  } else {
    electricityAmmount =
      150 * elTarifAv + (counter.electricity_diff - 150) * el150TarifAv;
  }

  // -----------------------------------------------------------------------------
  // DEBUG
  // -----------------------------------------------------------------------------
  /**
  console.log('dateStart', dayjs(dateStart).format('YYYY-MM-DD'));
  console.log(
    'dateStartEOM',
    dayjs(dateStart).endOf('month').format('YYYY-MM-DD'),
  );
  console.log('dateEnd', dayjs(dateEnd).format('YYYY-MM-DD'));
  console.log(
    'dateEndSOM',
    dayjs(dateEnd).startOf('month').format('YYYY-MM-DD'),
  );

  console.log('daysPrevMonth', daysPrevMonth);
  console.log('daysThisMonth', daysThisMonth);

  console.log('totalDaysInPrevMonth', totalDaysInPrevMonth);
  console.log('totalDaysInThisMonth', totalDaysInThisMonth);

  // console.log('waterTarif', wTarifAv);
  // console.log('elecTarif', elTarifAv);
  // console.log('elecTarif150', el150TarifAv);

  console.log('waterAmmount', waterAmmount);
  console.log('electricityAmmount', electricityAmmount);

  console.log(
    'heatAmmount',
    (actualTarifs.heat.prevMonth / totalDaysInPrevMonth) * daysPrevMonth +
      (actualTarifs.heat.thisMonth / totalDaysInThisMonth) * daysThisMonth,
    (actualTarifs.heat.prevMonth + actualTarifs.heat.thisMonth) / 2,
    actualTarifs.heat.prevMonth === actualTarifs.heat.thisMonth,
  );
  console.log(
    'gasAmmount',
    (actualTarifs.gas.prevMonth / totalDaysInPrevMonth) * daysPrevMonth +
      (actualTarifs.gas.thisMonth / totalDaysInThisMonth) * daysThisMonth,
    (actualTarifs.gas.prevMonth + actualTarifs.gas.thisMonth) / 2,
    actualTarifs.gas.prevMonth === actualTarifs.gas.thisMonth,
  );
  console.log(
    'managing_companyAmmount',
    (actualTarifs.managing_company.prevMonth / totalDaysInPrevMonth) *
      daysPrevMonth +
      (actualTarifs.managing_company.thisMonth / totalDaysInThisMonth) *
        daysThisMonth,
    (actualTarifs.managing_company.prevMonth +
      actualTarifs.managing_company.thisMonth) /
      2,
    actualTarifs.managing_company.prevMonth ===
      actualTarifs.managing_company.thisMonth,
  );
  console.log(
    'domofonAmmount',
    (actualTarifs.domofon.prevMonth / totalDaysInPrevMonth) * daysPrevMonth +
      (actualTarifs.domofon.thisMonth / totalDaysInThisMonth) * daysThisMonth,
    (actualTarifs.domofon.prevMonth + actualTarifs.domofon.thisMonth) / 2,
    actualTarifs.domofon.prevMonth === actualTarifs.domofon.thisMonth,
  );
  console.log(
    'tkoAmmount',
    (actualTarifs.tko.prevMonth / totalDaysInPrevMonth) * daysPrevMonth +
      (actualTarifs.tko.thisMonth / totalDaysInThisMonth) * daysThisMonth,
    (actualTarifs.tko.prevMonth + actualTarifs.tko.thisMonth) / 2,
    actualTarifs.tko.prevMonth === actualTarifs.tko.thisMonth,
  );
  console.log(
    'renovationAmmount',
    (actualTarifs.renovation.prevMonth / totalDaysInPrevMonth) * daysPrevMonth +
      (actualTarifs.renovation.thisMonth / totalDaysInThisMonth) *
        daysThisMonth,
    (actualTarifs.renovation.prevMonth + actualTarifs.renovation.thisMonth) / 2,
    actualTarifs.renovation.prevMonth === actualTarifs.renovation.thisMonth,
  );

  console.log(
    'oops',
    Number(
      waterAmmount +
        electricityAmmount +
        constAmmount -
        (actualTarifs.renovation.prevMonth / totalDaysInPrevMonth) *
          daysPrevMonth -
        (actualTarifs.renovation.thisMonth / totalDaysInThisMonth) *
          daysThisMonth -
        (actualTarifs.tko.prevMonth / totalDaysInPrevMonth) * daysPrevMonth -
        (actualTarifs.tko.thisMonth / totalDaysInThisMonth) * daysThisMonth,
    ).toFixed(2),
  );

  console.log('counter', JSON.stringify(counter, null, 2));

  console.log(
    'tarifs',
    JSON.stringify(
      tarifs
        .map((t) => ({
          type: t.tarif_type,
          from: dayjs(t.valid_from).format('DD MM YYYY'),
          to: dayjs(t.valid_to).format('DD MM YYYY'),
          rate: t.rate,
        }))
        .sort((a, b) => a.type.toString().localeCompare(b.type.toString())),
      null,
      2,
    ),
  );

  // console.log('actualTarifs', JSON.stringify(actualTarifs, null, 2));
  /**/

  return {
    domofon:
      (actualTarifs.domofon.prevMonth / totalDaysInPrevMonth) * daysPrevMonth +
      (actualTarifs.domofon.thisMonth / totalDaysInThisMonth) * daysThisMonth,

    gas:
      (actualTarifs.gas.prevMonth / totalDaysInPrevMonth) * daysPrevMonth +
      (actualTarifs.gas.thisMonth / totalDaysInThisMonth) * daysThisMonth,

    managing_company:
      (actualTarifs.managing_company.prevMonth / totalDaysInPrevMonth) *
        daysPrevMonth +
      (actualTarifs.managing_company.thisMonth / totalDaysInThisMonth) *
        daysThisMonth,

    tko:
      (actualTarifs.tko.prevMonth / totalDaysInPrevMonth) * daysPrevMonth +
      (actualTarifs.tko.thisMonth / totalDaysInThisMonth) * daysThisMonth,

    heat:
      (actualTarifs.heat.prevMonth / totalDaysInPrevMonth) * daysPrevMonth +
      (actualTarifs.heat.thisMonth / totalDaysInThisMonth) * daysThisMonth,

    renovation:
      (actualTarifs.renovation.prevMonth / totalDaysInPrevMonth) *
        daysPrevMonth +
      (actualTarifs.renovation.thisMonth / totalDaysInThisMonth) *
        daysThisMonth,

    water: waterAmmount,

    electricity: electricityAmmount,

    total: waterAmmount + electricityAmmount + constAmmount,
  };
}
