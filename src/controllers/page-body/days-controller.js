import DefaultContainer from "../../components/default-container-component";
import {isSameDay} from '../../utils/date-utils';
import DayController from "./day-controller";
import {empty, render, RenderPosition} from "../../utils/render";

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

const renderDay = (containerComponent, events, index, dependencies) => {
  const dayController =
    new DayController(containerComponent, events[0].dateFrom, index);

  return dayController.render(events, dependencies);
};

export default class DaysController {
  constructor(container, dependencies) {
    this._container = container;
    this._dependencies = dependencies;

    this._daysComponent = new DefaultContainer(`ul`, `trip-days`);
    this._alreadyReandered = false;
  }

  render(events, noDays) {
    empty(this._daysComponent.getElement());

    let pointControllers = [];

    if (noDays) {
      pointControllers = renderDay(this._daysComponent, events, 0, this._dependencies);
    } else {
      const eventsByDay = splitSortedEventsByDate(events);

      pointControllers = eventsByDay.reduce((acc, dayEvents, idx) => {
        const controllers =
          renderDay(this._daysComponent, dayEvents, idx + 1, this._dependencies);
        return acc.concat(controllers);
      }, []);
    }

    if (!this._alreadyReandered) {
      render(this._container, this._daysComponent, RenderPosition.BEFOREEND);
    }

    return pointControllers;
  }

  // empty() {
  //   empty(this._daysContainerComponent.getElement());
  // }
}
