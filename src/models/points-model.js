import {FilterTypes} from '../components/filters-component';
import {replaceElementInArray, removeFromArray, unshiftArray} from '../utils/common';
import FilterPredicate from '../utils/filter';

let nextId = 0;

const updateNextId = (points) => {
  nextId = points.reduce(
    (maxId, point) => Math.max(maxId, point.id), nextId
  );
};

export default class PointsModel {
  constructor(api) {
    this._points = [];
    this._filterType = FilterTypes.EVERYTHING;
    this._filterChangeHandlers = [];
    this.onFilterTypeChange = this.onFilterTypeChange.bind(this);
    this._eventHandlers = [];
    this._filterPredicate = new FilterPredicate();
    this._api = api;
  }

  getAllPoints() {
    return this._points;
  }

  getPoints() {
    const predicate = this._filterPredicate
      .getFilterPredicate(this._filterType);
    return this._points.filter((point) => predicate(point));
  }

  setPoints(points) {
    this._points = points;
    updateNextId(points);
  }

  updatePoint(oldPoint, newPoint) {
    this._points = replaceElementInArray(this._points, oldPoint, newPoint);

    this._callEventHandlersWithAdjustment(oldPoint, newPoint);

    this._api.updatePoint(newPoint.id, newPoint);
  }

  remove(oldPoint) {
    this._points = removeFromArray(this._points, oldPoint);

    this._callEventHandlersWithAdjustment(oldPoint);
  }

  addPoint(newPoint) {
    newPoint.id = this.getNextId();

    this._points = unshiftArray(this._points, newPoint);

    this._callEventHandlersWithAdjustment(undefined, newPoint);
  }

  onFilterTypeChange(filterType) {
    this._filterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  addOnFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  isEmpty() {
    return !this.size();
  }

  size() {
    return this._points.length;
  }

  addEventHandler(handler) {
    this._eventHandlers.push(handler);
  }

  _callEventHandlersWithAdjustment(oldPoint, newPoint) {
    const predicate = this._filterPredicate
      .getFilterPredicate(this._filterType);

    const nextPoint = newPoint &&
      predicate(newPoint) && newPoint;

    if (oldPoint || nextPoint) {
      this._callEventHandlers(oldPoint, nextPoint);
    }
  }

  _callEventHandlers(oldPoint, newPoint) {
    this._eventHandlers.forEach(
      (handler) => handler(oldPoint, newPoint)
    );
  }

  getNextId() {
    return nextId++;
  }
}
