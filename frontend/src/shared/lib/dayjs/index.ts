import dayjs from 'dayjs';
import 'dayjs/locale/ru.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(timezone);
dayjs.extend(utc);

dayjs.locale('ru');

dayjs.tz.setDefault('Europe/Moscow');

export { dayjs };
