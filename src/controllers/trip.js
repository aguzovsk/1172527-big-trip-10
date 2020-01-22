import NoCardsComponent from "../components/no-cards";
import SortComponent, {SortTypes} from "../components/sort";
import DaysContainer from "../components/days-container";
import DayComponent from '../components/day.js';
import {render, RenderPosition, empty} from '../utils/render.js';
import {isSameDay} from '../utils/date-utils.js';
import {getEventTotalPrice} from '../utils/common.js';
import CardListComponent from "../components/card-container";
import PointController from "./point";
import {generateDestinationList} from "../mock/destination";

const destinations = generateDestinationList();

const renderDay = (containerComponent, events, index, onDataChange, onViewChange) => {
  const dayComponent = new DayComponent(events[0].dateFrom, index);
  const dayElement = dayComponent.getElement();
  const cardListComponent = new CardListComponent();
  const cardContainerElement = cardListComponent.getElement();
  const pointControllers = events.map((event) =>{
    const controller = new PointController(cardListComponent, destinations, onDataChange, onViewChange);
    controller.render(event);
    return controller;
  });

  render(dayComponent, cardContainerElement, RenderPosition.BEFOREEND);

  render(containerComponent, dayElement, RenderPosition.BEFOREEND);

  return pointControllers;
};

const splitSortedEventsByDate = (events) => {
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

  return days;
};

const renderDays = (containerComponent, events, noDays, onDataChange, onViewChange) => {
  let pointControllers = [];
  if (noDays) {
    pointControllers = renderDay(containerComponent, events, 0, onDataChange);
  } else {
    const eventsByDay = splitSortedEventsByDate(events);

    pointControllers = eventsByDay.reduce((acc, dayEvents, idx) => {
      const controllers =
        renderDay(containerComponent, dayEvents, idx + 1, onDataChange, onViewChange);
      return acc.concat(controllers);
    }, []);
  }

  return pointControllers;
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._noCardsComponent = new NoCardsComponent();
    this._sortComponent = new SortComponent();
    this._daysContainerComponent = new DaysContainer();
    this._pointControllers = [];
    this._events = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._sortType = SortTypes.BY_EVENT;
  }

  render(events) {
    const container = this._container;
    this._events = events;
    if (!events.length) {
      render(container, this._noCardsComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }
    const daysContainerElement = this._daysContainerComponent.getElement();

    render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    const sortedEvents = this._sortEvents(this._sortType);

    this._pointControllers =
      renderDays(this._daysContainerComponent, sortedEvents, this._sortType !== SortTypes.BY_EVENT, this._onDataChange, this._onViewChange);

    render(container, daysContainerElement, RenderPosition.BEFOREEND);

    this._sortComponent.setEventHandlers(this._onSortTypeChange);
  }

  _onDataChange(controller, oldEvent, newEvent) {
    const index = this._events.findIndex((event) => event.id === oldEvent.id);

    if (index === -1) {
      throw new Error(`Unexpected event modification`);
    }

    const firstPart = this._events.slice(0, index);
    const secondPart = this._events.slice(index + 1);

    if (!newEvent) {
      controller.empty();
      this._events = [].concat(firstPart, secondPart);

      const ctrls = this._pointControllers;
      const controllerIdx = ctrls.indexOf(controller);

      if (controllerIdx === -1) {
        throw new Error(`Can not delete point controller`);
      }

      const firstControllers = ctrls.slice(0, controllerIdx);
      const secondControllers = ctrls.slice(controllerIdx + 1);
      this._pointControllers = [].concat(firstControllers, secondControllers);
    } else {
      this._events = [].concat(firstPart, newEvent, secondPart);

      controller.render(newEvent);
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _sortEvents(sortType, events = this._events) {
    let sortedEvents = [];
    switch (sortType) {
      case SortTypes.BY_EVENT:
        sortedEvents =
          events.slice().sort((a, b) => a.dateFrom - b.dateFrom);
        break;
      case SortTypes.BY_PRICE:
        sortedEvents = events.slice().sort((a, b) => {
          const aPrice = getEventTotalPrice(a);
          const bPrice = getEventTotalPrice(b);
          return bPrice - aPrice;
        });
        break;
      case SortTypes.BY_TIME:
        sortedEvents = events.slice().sort((a, b) => {
          const aTime = a.dateTo - a.dateFrom;
          const bTime = b.dateTo - b.dateFrom;
          return bTime - aTime;
        });
        break;
      default: throw new Error(`Undefined sort type: ${sortType}`);
    }

    return sortedEvents;
  }

  _onSortTypeChange(sortType) {
    this._sortType = sortType;
    const sortedEvents = this._sortEvents(sortType);
    empty(this._daysContainerComponent.getElement());
    // this._pointControllers =
    renderDays(this._daysContainerComponent, sortedEvents, this.sortType !== SortTypes.BY_EVENT, this._onDataChange, this._onViewChange);
  }
}
