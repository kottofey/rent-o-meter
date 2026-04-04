import dayjs, { locale, extend } from 'dayjs';
import 'dayjs/locale/ru.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';

extend(localizedFormat);
extend(customParseFormat);
extend(weekOfYear);
extend(timezone);
extend(utc);

locale('ru');

dayjs.tz.setDefault('Europe/Moscow');

export { dayjs };
