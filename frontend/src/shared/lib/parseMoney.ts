export function parseMoney({
  ammount,
  mode = 'rubbles',
  digits = 2,
  removeMinus = false,
}: {
  ammount: number;
  mode?: 'rubbles' | 'kopeyki';
  digits?: number;
  removeMinus?: boolean;
}): string {
  let result: number =
    mode === 'kopeyki' ? Number(ammount) / 100 : Number(ammount);

  if (removeMinus) {
    result = Math.abs(result);
  }

  return result.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
