export function parseNumber(value: string) {
  const nums = value.replace(/,/g, '.').trim();
  if (/^\d+(\.(\d+)?)?$/.test(nums)) {
    return Number(nums) * 100;
  }

  return null;
}
