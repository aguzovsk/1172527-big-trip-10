import {formatDecimal} from './util.js';

const MILLISECOND = 1;
const SECOND = 1000 * MILLISECOND;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const getYearMonthDay = (date) => date.toISOString().split('T')[0];
export const getMonthDay = (date) => date.toDateString().split(` `).slice(1, 3).join(` `);
export const getHourMinute = (date) => `${date.getHours()}:${date.getMinutes()}`;

export const convertDateToDatetime = (date) => {
  const day = getYearMonthDay(date);
  const time = getHourMinute(date);
  return `${day}T${time}`;
};

export const getDateDiff = (startDate, endDate) => {
  const min = Math.min(startDate, endDate);
  const max = Math.max(startDate, endDate);
  
  const diff = max - min;

  const diffDays = Math.ceil(diff / DAY);
  const diffHours = Math.ceil((diff % DAY) / HOUR);
  const diffMinutes = Math.ceil((diff % HOUR) / MINUTE);

  const queue = [];
  if (diffDays > 0) {
    const days = formatDecimal(diffDays) + 'D';
    queue.push(days);
  }
  if (diffHours > 0) {
    const hours = formatDecimal(diffHours) + 'H';
    queue.push(hours);
  }
  if (diffMinutes > 0) {
    const minutes = formatDecimal(diffMinutes) + 'M';
    queue.push(minutes);
  }

  return queue.join(` `);
};
