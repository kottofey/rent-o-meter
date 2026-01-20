export function parseMoney({
  ammount,
  mode = 'rubbles',
  digits = 2,
}: {
  ammount: number;
  mode?: 'rubbles' | 'kopeyki';
  digits?: number;
}) {
  const result: number = mode === 'kopeyki' ? ammount / 100 : ammount;

  return result.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: digits,
  });
}
