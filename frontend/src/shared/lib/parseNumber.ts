export function parseNumber(value: string) {
  const reg = /^([ \d]*[,.]?\d+).?$/;
  const nums = value.replace(/,/g, '.').trim();

  if (reg.test(nums)) {
    return Number(reg.exec(nums)?.[1]);
  }

  return null;
}
