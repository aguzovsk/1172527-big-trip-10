import NoCardsComponent from "../components/no-cards";
import SortComponent, {SortTypes} from "../components/sort";
import DaysContainer from "../components/days-container";
import DayComponent from '../components/day.js';
import {render, RenderPosition, empty} from '../utils/render.js';
import {isSameDay} from '../utils/date-utils.js';
import {getEventTotalPrice, unshiftArray} from '../utils/common.js';
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
    pointControllers = renderDay(containerComponent, events, 0, onDataChange, onViewChange);
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
  constructor(container, pointsModel) {
    this._container = container;
    this._noCardsComponent = new NoCardsComponent();
    this._sortComponent = new SortComponent();
    this._daysContainerComponent = new DaysContainer();
    this._pointControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._sortType = SortTypes.BY_EVENT;
    this._pointsModel = pointsModel;
    pointsModel.setFilterChangeHandler(this._filterChangeHandler);

    this._addNewEventButton = document.querySelector(`button.trip-main__event-add-btn`);
    this.setAddNewEventListener();
    this._newEventController = null;
  }

  render() {
    const container = this._container;
    const points = this._pointsModel.getPoints();
    if (!points.length) {
      render(container, this._noCardsComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }
    const daysContainerElement = this._daysContainerComponent.getElement();

    render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    const sortedPoints = this._sortPoints(this._sortType);

    this._pointControllers =
      renderDays(this._daysContainerComponent, sortedPoints, this._sortType !== SortTypes.BY_EVENT, this._onDataChange, this._onViewChange);

    render(container, daysContainerElement, RenderPosition.BEFOREEND);

    this._sortComponent.setEventHandlers(this._onSortTypeChange);
  }

  show() {
    const somePoints = this._pointsModel.isEmpty();
    if (somePoints) {
      this._daysContainerComponent.show();
    } else {
      this._noCardsComponent.show();
    }
  }

  hide() {
    const somePoints = this._pointsModel.isEmpty();
    if (somePoints) {
      this._daysContainerComponent.hide();
    } else {
      this._noCardsComponent.hide();
    }
  }

  _onDataChange(controller, oldPoint, newPoint) {
    if (!oldPoint) {
      this._clearNewEventController();
      if (newPoint) {
        this._pointsModel.addPoint(newPoint);
        this._pointControllers = unshiftArray(this._pointControllers, controller);
        empty(this._daysContainerComponent.getElement());
        this.render();
      }
    } else if (!newPoint) {
      this._pointsModel.remove(oldPoint);
      this._pointControllers.forEach((ctrl) => ctrl.empty());
      // this._pointControllers = removeFromArray(this._pointControllers, controller);
      empty(this._daysContainerComponent.getElement());
      this.render();
    } else {
      this._pointsModel.updatePoint(oldPoint, newPoint);
      // this._pointControllers.forEach((ctrl) => ctrl.empty());
      empty(this._daysContainerComponent.getElement());
      this.render();
    }
  }

  _onViewChange() {
    if (this._newEventController) {
      this._clearNewEventController();
    }
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _sortPoints(sortType, points = this._pointsModel.getPoints()) {
    let sortedPoints = [];
    switch (sortType) {
      case SortTypes.BY_EVENT:
        sortedPoints =
          points.slice().sort((a, b) => a.dateFrom - b.dateFrom);
        break;
      case SortTypes.BY_PRICE:
        sortedPoints = points.slice().sort((a, b) => {
          const aPrice = getEventTotalPrice(a);
          const bPrice = getEventTotalPrice(b);
          return bPrice - aPrice;
        });
        break;
      case SortTypes.BY_TIME:
        sortedPoints = points.slice().sort((a, b) => {
          const aTime = a.dateTo - a.dateFrom;
          const bTime = b.dateTo - b.dateFrom;
          return bTime - aTime;
        });
        break;
      default: throw new Error(`Undefined sort type: ${sortType}`);
    }

    return sortedPoints;
  }

  _onSortTypeChange(sortType) {
    this._sortType = sortType;
    const sortedEvents = this._sortPoints(sortType);
    empty(this._daysContainerComponent.getElement());
    this._pointControllers.forEach((ctrl) => ctrl.empty());
    this._pointControllers =
      renderDays(this._daysContainerComponent, sortedEvents, this._sortType !== SortTypes.BY_EVENT, this._onDataChange, this._onViewChange);
  }

  _filterChangeHandler() {
    this._onSortTypeChange(this._sortType);
  }

  setAddNewEventListener() {
    const button = this._addNewEventButton;
    button.addEventListener(`click`, () => {
      this._onViewChange();
      const pointController = new PointController(this._sortComponent, destinations, this._onDataChange, this._onViewChange);
      pointController.render();
      button.disabled = true;
      this._newEventController = pointController;
    });
  }

  _clearNewEventController() {
    this._addNewEventButton.disabled = false;
    this._newEventController.empty();
    this._newEventController = null;
  }
}
