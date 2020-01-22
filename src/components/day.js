import {getMonthDay, convertDateToDatetime} from '../utils/date-utils.js';
import AbstractComponent from './abstract-component.js';

const createDayMarkup = (index, date) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
      ${index ?
      `<span class="day__counter">${index}</span>
        <time class="day__date" datetime="${convertDateToDatetime(date)}">${getMonthDay(date)}</time>`
      : ``}
      </div>
    </li>`
  );
};

export default class DayComponent extends AbstractComponent {
  constructor(date, index) {
    super();
    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return createDayMarkup(this._index, this._date);
  }
}
