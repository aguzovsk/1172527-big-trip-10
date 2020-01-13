import {getMonthDay, convertDateToDatetime} from '../utils/date-utils.js';
import CardListComponent from './card-container.js';
import {render, RenderPosition} from '../utils/render.js';
import AbstractComponentWithInit from './abstract-component-with-init.js';

const createDayMarkup = (counter, date) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
      ${counter ?
      `<span class="day__counter">${counter}</span>
        <time class="day__date" datetime="${convertDateToDatetime(date)}">${getMonthDay(date)}</time>`
      : ``}
      </div>
    </li>`
  );
};

export default class DayComponent extends AbstractComponentWithInit {
  constructor(events, counter) {
    super();
    this._date = events[0].dateFrom;
    this._counter = counter;
    this._cardList = new CardListComponent(events);
  }

  getTemplate() {
    return createDayMarkup(this._counter, this._date);
  }

  _init() {
    render(this._element, this._cardList.getElement(), RenderPosition.BEFOREEND);
  }
}
