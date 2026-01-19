import { dayjs } from '@/shared/lib/dayjs';

export function parseDate({
  date,
  format,
  capitalize = true,
}: {
  date: number;
  format?: string;
  capitalize?: boolean;
}) {
  const dateParsed = dayjs(date).format(`${format ? format : 'DD MMM YYYY'}`);
  return `${capitalize ? dateParsed[0].toUpperCase() : dateParsed[0]}${dateParsed.slice(1)}`;
}
