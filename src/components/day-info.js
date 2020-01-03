import {getMonthDay, convertDateToDatetime} from '../date-utils.js';

export const createDayInfo = (counter, date) => {
  return (
    `<div class="day__info"> ${counter ?
      `<span class="day__counter">${counter}</span>
      <time class="day__date" datetime="${convertDateToDatetime(date)}">${getMonthDay(date)}</time>`
      : ``}
    </div>`
  );
};
