const extractDigits = (phone: string) => {
  return phone.replace(/\D/g, '');
};

export const parsePhone = (phone: string) => {
  const digits = extractDigits(phone);
  let normalized = digits;

  if (digits.length === 11 && digits[0] === '8') {
    normalized = '7' + digits.slice(1);
  }

  if (normalized.length < 10) {
    return '';
  }

  const last10 = normalized.slice(-10);
  return `+7 (${last10.slice(0, 3)}) ${last10.slice(3, 6)}-${last10.slice(6, 8)}-${last10.slice(8, 10)}`;
};
