import { NText } from 'naive-ui';
import { h } from 'vue';

import { dayjs } from '@/shared/lib/dayjs';

export function checkExpiry(date_end: number) {
  if (dayjs(date_end).isAfter(dayjs().add(1, 'month'))) {
    return h(
      NText,
      { type: 'success' },
      {
        default: () => dayjs(date_end).format('YYYY-MM-DD'),
      },
    );
  } else if (
    dayjs(date_end).isBefore(dayjs().add(1, 'month')) &&
    dayjs(date_end).isAfter(dayjs())
  ) {
    return h(
      NText,
      { type: 'warning' },
      {
        default: () => dayjs(date_end).format('YYYY-MM-DD'),
      },
    );
  } else if (dayjs(date_end).isBefore(dayjs())) {
    return h(
      NText,
      { type: 'error', bold: true, italic: true },
      {
        default: () => dayjs(date_end).format('YYYY-MM-DD'),
      },
    );
  }
}
