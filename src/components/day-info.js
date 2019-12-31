import {getMonthDay} from '../date-utils.js';

export const createDayInfo = (counter, dayOfYear) => {
  const monthDay = getMonthDay(new Date(dayOfYear));
  return (
    `<div class="day__info">
      <span class="day__counter">${counter}</span>
      <time class="day__date" datetime="${dayOfYear}">${monthDay}</time>
    </div>`
  );
};
