import {isSameDay} from '../utils/date-utils.js';
import DayComponent from './day.js';
import {render, RenderPosition} from '../utils/render.js';
import AbstractComponentWithInit from './abstract-component-with-init.js';

export default class DaysContainer extends AbstractComponentWithInit {
  constructor(events, noDays) {
    super();
    this._events = events;
    this._noDays = noDays;
  }

  _computeDaysList(events) {
    if (!events.length) {
      return [];
    }

    const days = [[events[0]]];
    for (let i = 1; i < events.length; ++i) {
      const event = events[i];
      const prevDay = days[days.length - 1];
      const prevEvent = prevDay[prevDay.length - 1];
      if (this._noDays || isSameDay(event.dateFrom, prevEvent.dateFrom)) {
        prevDay.push(event);
      } else {
        days.push([event]);
      }
    }

    return days.map((day, idx) =>
      new DayComponent(day, !this._noDays ? idx + 1 : this._noDays)
    );
  }

  getTemplate() {
    return (
      `<ul class="trip-days">
      </ul>`
    );
  }

  _init() {
    const days = this._computeDaysList(this._events);
    days.forEach((day) => render(this._element, day.getElement(), RenderPosition.BEFOREEND));
  }
}
