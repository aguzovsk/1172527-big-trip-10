import {getMonthDay} from "../date-utils.js";
import {formatDecimal} from "../util.js";
import {createElement} from '../util.js';

const last = (array) => array[array.length - 1];

export const createRouteTemplate = (eventList) => {
  if (!eventList.length) {
    return ``;
  }

  const queue = [];
  const citiesVisited = eventList.reduce((arr, {destination}) =>
    last(arr) === destination.name ? arr : arr.concat(destination.name),
  [eventList[0].destination.name]
  );

  queue.push(citiesVisited[0]);
  queue.push(last(citiesVisited));

  if (citiesVisited.length >= 3) {
    queue.splice(1, 0, citiesVisited.length === 3 ? citiesVisited[1] : `...`);
  }
  const title = queue.join(` &mdash; `);

  const startDate = eventList[0].dateFrom;
  const endDate = last(eventList).dateTo;
  const start = getMonthDay(startDate);
  const end = startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() ?
    formatDecimal(endDate.getDate()) : getMonthDay(endDate);

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>

      <p class="trip-info__dates">${start}&nbsp;&mdash;&nbsp;${end}</p>
    </div>`
  );
};

export default class RouteComponent {
  constructor(eventList) {
    this._element = null;
    this._eventList = eventList;
  }

  getTemplate() {
    return createRouteTemplate(this._eventList);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  clear() {
    this._element = null;
    this._eventList = null;
  }
}
