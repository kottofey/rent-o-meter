export function parsePhone(phone: string) {
  const prefix = phone.trim().at(0);
  const code = phone.trim().slice(1, 4);
  const number1 = phone.trim().slice(4, 7);
  const number2 = phone.trim().slice(7, 9);
  const number3 = phone.trim().slice(9);
  return `+${prefix} (${code}) ${number1} ${number2} ${number3}`;
}
