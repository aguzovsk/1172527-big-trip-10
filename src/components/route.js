import {getMonthDay, isSameMonth} from "../utils/date-utils.js";
import {formatDecimal} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const getLast = (items) => items[items.length - 1];

export const createRouteTemplate = (events) => {
  if (!events.length) {
    return ``;
  }

  const items = [];
  const citiesVisited = events.reduce((cities, {destination}) =>
    getLast(cities) === destination.name ? cities : cities.concat(destination.name),
  [events[0].destination.name]
  );

  items.push(citiesVisited[0]);
  items.push(getLast(citiesVisited));

  if (citiesVisited.length >= 3) {
    items.splice(1, 0, citiesVisited.length === 3 ? citiesVisited[1] : `...`);
  }
  const title = items.join(` &mdash; `);

  const startDate = events[0].dateFrom;
  const endDate = getLast(events).dateTo;
  const start = getMonthDay(startDate);
  const end = isSameMonth(startDate, endDate) ?
    formatDecimal(endDate.getDate()) : getMonthDay(endDate);

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>

      <p class="trip-info__dates">${start}&nbsp;&mdash;&nbsp;${end}</p>
    </div>`
  );
};

export default class RouteComponent extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createRouteTemplate(this._events);
  }
}
