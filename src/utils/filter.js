import {FilterTypes} from "../components/filters-component";
import {isSameDay} from './date-utils.js';

export default class FilterPredicate {
  constructor() {
    this._now = new Date();

    this.FUTURE = this.FUTURE.bind(this);
    this.PAST = this.PAST.bind(this);
  }

  getFilterPredicate(filterType) {
    this._updateTime();

    switch (filterType) {
      case FilterTypes.EVERYTHING:
        return this.EVERYTHING;
      case FilterTypes.FUTURE:
        return this.FUTURE;
      case FilterTypes.PAST:
        return this.PAST;
      default:
        throw new Error(`Undefined filter type: ${filterType}.`);
    }
  }

  EVERYTHING() {
    return true;
  }

  FUTURE(point) {
    const start = point.dateFrom;
    const pass = start > this._now && !isSameDay(start, this._now);
    return pass;
  }

  PAST(point) {
    const end = point.dateTo;
    const pass = end < this._now && !isSameDay(end, this._now);
    return pass;
  }

  _updateTime() {
    this._now = new Date();
  }
}
