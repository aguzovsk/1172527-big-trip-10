import {formatDecimal} from './common.js';
import moment from 'moment';

export const getMonthDay = (date) => moment(date).format(`MMM DD`);

export const getHourMinute = (date) => moment(date).format(`HH:mm`);

export const isSameMonth = (date1, date2) => moment(date1).isSame(date2, `month`);
export const isSameDay = (date1, date2) => moment(date1).isSame(date2, `day`);

export const convertDateToDatetime = (date) => moment(date).format(`YYYY-MM-DDTHH:mm`);
export const formatDate = (date) => moment(date).format(`DD/MM/YYYY HH:mm`);

export const computeDuration = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  const min = moment.min(start, end);
  const max = moment.max(start, end);

  const duration = moment.duration(max.diff(min));

  return duration;
};

export const getDateDiff = (startDate, endDate) => {
  const duration = computeDuration(startDate, endDate);

  const diffDays = duration.days();
  const diffHours = duration.hours();
  const diffMinutes = duration.minutes();

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
