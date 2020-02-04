import {getMonthDay, isSameMonth} from "../utils/date-utils";
import {formatDecimal} from "../utils/common";
import AbstractSmartComponent from "./abstract-smart-component";

export const createRouteTemplate = (title, startDate, finnishDate) => {
  const start = getMonthDay(startDate);
  const finnish = isSameMonth(startDate, finnishDate) ?
    formatDecimal(finnishDate.getDate()) : getMonthDay(finnishDate);

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>

      <p class="trip-info__dates">${start}&nbsp;&mdash;&nbsp;${finnish}</p>
    </div>`
  );
};

export default class RouteComponent extends AbstractSmartComponent {
  constructor(startPoint, midPointName, finnishPoint) {
    super();

    this._startPoint = startPoint;
    this._midPointName = midPointName;
    this._finnishPoint = finnishPoint;

    this._createTitle = this._createTitle.bind(this);
  }

  getTemplate() {
    if (!(this._startPoint && this._finnishPoint)) {
      return ``;
    }
    const title = this._createTitle();
    return createRouteTemplate(title, this._startPoint.dateFrom, this._finnishPoint.dateTo);
  }

  _createTitle() {
    const names = [this._startPoint.destination.name,
      this._finnishPoint.destination.name];

    if (this._midPointName) {
      names.splice(1, 0, this._midPointName);
    }

    return names.join(` &mdash; `);
  }

  recoveryListeners() {}

  rerender(startPoint, midPointName, finnishPoint) {
    this._startPoint = startPoint;
    this._midPointName = midPointName;
    this._finnishPoint = finnishPoint;

    super.rerender();
  }
}
