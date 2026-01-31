export function parseMoney({
  ammount,
  mode = 'rubbles',
  digits = 2,
}: {
  ammount: number;
  mode?: 'rubbles' | 'kopeyki';
  digits?: number;
}): string {
  const result: number =
    mode === 'kopeyki' ? Number(ammount) / 100 : Number(ammount);

  return result.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
