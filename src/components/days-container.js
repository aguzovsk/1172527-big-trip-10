import {isSameDay} from '../date-utils.js';
import DayComponent from './day.js';
import {createElement, render, RenderPosition} from '../util.js';

export default class DaysContainer {
  constructor(eventList, noDays) {
    this._element = null;
    this._eventList = eventList;
    this._noDays = noDays;
  }

  _computeDaysList(eventList) {
    if (!eventList.length) {
      return [];
    }

    const array = [[eventList[0]]];
    for (let i = 1; i < eventList.length; ++i) {
      const event = eventList[i];
      const prevArr = array[array.length - 1];
      const prevEvent = prevArr[prevArr.length - 1];
      if (this._noDays || isSameDay(event.dateFrom, prevEvent.dateFrom)) {
        prevArr.push(event);
      } else {
        array.push([event]);
      }
    }

    return array.map((eventArray, idx) =>
      new DayComponent(eventArray, !this._noDays ? idx + 1 : this._noDays)
    );
  }

  getTemplate() {
    return (
      `<ul class="trip-days">
      </ul>`
    );
  }

  _initInternals() {
    const days = this._computeDaysList(this._eventList);
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
    this._eventList = null;
    this._noDays = null;
  }
}
