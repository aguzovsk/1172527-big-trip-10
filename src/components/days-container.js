import {isSameDay} from '../utils/date-utils.js';
import DayComponent from './day.js';
import {createElement, render, RenderPosition} from '../utils/render.js';

export default class DaysContainer {
  constructor(events, noDays) {
    this._element = null;
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

  _initInternals() {
    const days = this._computeDaysList(this._events);
    days.forEach((day) => render(this._element, day.getElement(), RenderPosition.BEFOREEND));
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._initInternals();
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  clear() {
    this._element = null;
    this._events = null;
    this._noDays = null;
  }
}
