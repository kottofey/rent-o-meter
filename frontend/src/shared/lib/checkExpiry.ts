import { NText } from 'naive-ui';
import type { h } from 'vue';

import { dayjs } from '@/shared/lib/dayjs';

export function checkExpiry({
  date_end,
  format,
  hFunc,
}: {
  date_end: number;
  hFunc: typeof h;
  format?: string;
}) {
  if (dayjs(date_end).isAfter(dayjs().add(1, 'month'))) {
    return hFunc(
      NText,
      { type: 'success' },
      {
        default: () =>
          dayjs(date_end).format(`${format ? format : 'DD MMM YYYY'}`),
      },
    );
  } else if (
    dayjs(date_end).isBefore(dayjs().add(1, 'month')) &&
    dayjs(date_end).isAfter(dayjs())
  ) {
    return hFunc(
      NText,
      { type: 'warning' },
      {
        default: () =>
          dayjs(date_end).format(`${format ? format : 'DD MMM YYYY'}`),
      },
    );
  } else if (dayjs(date_end).isBefore(dayjs())) {
    return hFunc(
      NText,
      { type: 'error', bold: true, italic: true },
      {
        default: () =>
          dayjs(date_end).format(`${format ? format : 'DD MMM YYYY'}`),
      },
    );
  }
}
