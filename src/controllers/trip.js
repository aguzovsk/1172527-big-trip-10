import NoCardsComponent from "../components/no-cards";
import SortComponent, {SortTypes} from "../components/sort";
import DaysContainer from "../components/days-container";
import DayComponent from '../components/day.js';
import {render, RenderPosition, empty} from '../utils/render.js';
import {isSameDay} from '../utils/date-utils.js';
import {getEventTotalPrice} from '../utils/common.js';

export default class TripController {
  constructor(container) {
    this._container = container;
    this._noCardsComponent = new NoCardsComponent();
    this._sortComponent = new SortComponent();
    this._daysContainerComponent = new DaysContainer();
  }

  render(events) {
    const container = this._container;
    if (!events.length) {
      render(container, this._noCardsComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }
    const daysContainerElement = this._daysContainerComponent.getElement();
    render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    render(container, daysContainerElement, RenderPosition.BEFOREEND);

    const computeDays = this._computeDaysList.bind(this);
    const computedDays = computeDays(events, false);
    computedDays.forEach((day) =>
      render(daysContainerElement, day.getElement(), RenderPosition.BEFOREEND));

    this._sortComponent.setEventHandlers((sortType) => {
      switch (sortType) {
        case SortTypes.BY_EVENT:
          events.sort((a, b) => a.dateFrom - b.dateFrom);
          break;
        case SortTypes.BY_PRICE:
          events.sort((a, b) => {
            const aPrice = getEventTotalPrice(a);
            const bPrice = getEventTotalPrice(b);
            return bPrice - aPrice;
          });
          break;
        case SortTypes.BY_TIME:
          events.sort((a, b) => {
            const aTime = a.dateTo - a.dateFrom;
            const bTime = b.dateTo - b.dateFrom;
            return bTime - aTime;
          });
          break;
      }

      empty(daysContainerElement);

      const days = computeDays(events, sortType !== SortTypes.BY_EVENT);
      days.forEach((day) =>
        render(daysContainerElement, day.getElement(), RenderPosition.BEFOREEND));
    });
  }

  _computeDaysList(events, noDays) {
    if (!events.length || noDays) {
      const day = new DayComponent(events, 0);
      return [day];
    }

    const days = [[events[0]]];
    for (let i = 1; i < events.length; ++i) {
      const event = events[i];
      const prevDay = days[days.length - 1];
      const prevEvent = prevDay[prevDay.length - 1];
      if (isSameDay(event.dateFrom, prevEvent.dateFrom)) {
        prevDay.push(event);
      } else {
        days.push([event]);
      }
    }

    return days.map((day, idx) =>
      new DayComponent(day, idx + 1)
    );
  }
}
