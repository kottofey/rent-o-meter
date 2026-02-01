export function parseNumber(value: string): number {
  // const reg = /^(-?\d+\D+[\d,.]*).*$/;
  // const reg = /^(-?[ \d]*[,.]?\d+).*$/;
  // const nums = value
  //   .replace(/,/g, '.')
  //   .replace(/[^\d,.-]/g, '')
  //   .trim();
  //
  // console.log('parseNum', nums);
  // if (reg.test(nums)) {
  //   return Number(reg.exec(nums)?.[1]);
  // }

  return Number(
    value
      .replace(/,/g, '.')
      .replace(/[^\d,.-]/g, '')
      .trim(),
  );
}
