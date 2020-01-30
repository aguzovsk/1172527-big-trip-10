import {FilterTypes} from '../components/filters.js';
import {isSameDay} from '../utils/date-utils.js';
import {replaceElementInArray, removeFromArray, unshiftArray} from '../utils/common.js';

export default class PointsModel {
  constructor() {
    this._points = [];
    this._filterType = FilterTypes.EVERYTHING;
    this._filterChangeHandler = null;
    this.onFilterTypeChange = this.onFilterTypeChange.bind(this);
  }

  getAllPoints() {
    return this._points;
  }

  getPoints() {
    const now = new Date();
    switch (this._filterType) {
      case FilterTypes.EVERYTHING:
        return this._points;
      case FilterTypes.FUTURE:
        return this._points.filter((point) =>{
          const start = point.dateFrom;
          return start > now && !isSameDay(start, now);
        });
      case FilterTypes.PAST:
        return this._points.filter((point) => {
          const end = point.dateTo;
          return end < now && !isSameDay(end, now);
        });
      default:
        throw new Error(`unknown filter type ${this._filterType}.`);
    }
  }

  setPoints(points) {
    this._points = points;
  }

  updatePoint(oldPoint, newPoint) {
    this._points = replaceElementInArray(this._points, oldPoint, newPoint);
  }

  remove(oldPoint) {
    this._points = removeFromArray(this._points, oldPoint);
  }

  addPoint(newPoint) {
    if (!newPoint.id || Number.isNaN(newPoint.id)) {
      const id = this._points.reduce(
        (maxId, point) => Math.max(maxId, point.id), Number.NEGATIVE_INFINITY
      );
      newPoint.id = id + 1;
    }
    this._points = unshiftArray(this._points, newPoint);
  }

  onFilterTypeChange(filterType) {
    this._filterType = filterType;
    this._filterChangeHandler();
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandler = handler;
  }

  isEmpty() {
    return !this._points.length;
  }
}
