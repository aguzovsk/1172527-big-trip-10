import NoCardsComponent from "../components/no-cards";
import SortComponent from "../components/sort";
import DaysContainer from "../components/days-container";
import DayComponent from '../components/day.js';
import {render, RenderPosition} from '../utils/render.js';
import {isSameDay} from '../utils/date-utils.js';

export default class TripController {
  constructor(container) {
    this._container = container;
    this._noCardsComponent = new NoCardsComponent();
    this._sortComponent = new SortComponent();
    this._daysContainerComponent = new DaysContainer();
    this._noDays = false;
  }

  render(events) {
    const container = this._container;
    render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);

    if (!events.length) {
      render(container, this._noCardsComponent.getElement(), RenderPosition.BEFOREEND);
    } else {
      const daysContainerComponent = this._daysContainerComponent;
      const days = this._computeDaysList(events);
      const daysContainerElement = daysContainerComponent.getElement();
      days.forEach((day) =>
        render(daysContainerElement, day.getElement(), RenderPosition.BEFOREEND));
      render(container, daysContainerElement, RenderPosition.BEFOREEND);
    }
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
}
