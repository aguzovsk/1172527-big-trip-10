import {getMonthDay, convertDateToDatetime} from '../date-utils.js';
import CardListComponent from './card-container.js';
import {createElement, render, RenderPosition} from '../util.js';

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

export default class DayComponent {
  constructor(events, counter) {
    this._element = null;
    this._date = events[0].dateFrom;
    this._counter = counter;
    this._cardList = new CardListComponent(events);
  }

  getTemplate() {
    return createDayMarkup(this._counter, this._date);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      render(this._element, this._cardList.getElement(), RenderPosition.BEFOREEND);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  clear() {
    this._element = null;
    this._date = null;
    this._counter = null;
    this._cardList = null;
  }
}
