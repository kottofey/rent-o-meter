import { dayjs } from '@/shared/lib/dayjs';

export function parseDate(date: number, format?: string) {
  return dayjs(date).format(`${format ? format : 'DD MMM YYYY'}`);
}
