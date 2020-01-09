import {formatDecimal} from './util.js';

const MILLISECOND = 1;
const SECOND = 1000 * MILLISECOND;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

const getYearMonthDay = (date) => date
  .toISOString().split(`T`)[0];
export const getMonthDay = (date) => date
  .toDateString().split(` `)
  .slice(1, 3).join(` `);
export const getHourMinute = (date) => {
  const hours = formatDecimal(date.getHours());
  const minutes = formatDecimal(date.getMinutes());
  return `${hours}:${minutes}`;
};

export const isSameMonth = (date1, date2) =>
  date1.getMonth() === date2.getMonth() &&
  date1.getFullYear() === date2.getFullYear();
export const isSameDay = (date1, date2) =>
  date1.getDate() === date2.getDate() &&
  isSameMonth(date1, date2);

export const convertDateToDatetime = (date) => {
  const day = getYearMonthDay(date);
  const time = getHourMinute(date);
  return `${day}T${time}`;
};

export const getDateDiff = (startDate, endDate) => {
  let min = Math.min(startDate, endDate);
  let max = Math.max(startDate, endDate);
  min = min - (min % MINUTE);
  max = max - (max % MINUTE);

  const diff = max - min;

  const diffDays = Math.floor(diff / DAY);
  const diffHours = Math.floor((diff % DAY) / HOUR);
  const diffMinutes = Math.floor((diff % HOUR) / MINUTE);

  const items = [];
  if (diffDays > 0) {
    const days = formatDecimal(diffDays) + `D`;
    items.push(days);
  }
  if (diffHours > 0) {
    const hours = formatDecimal(diffHours) + `H`;
    items.push(hours);
  }
  if (diffMinutes > 0) {
    const minutes = formatDecimal(diffMinutes) + `M`;
    items.push(minutes);
  }

  return items.join(` `);
};
