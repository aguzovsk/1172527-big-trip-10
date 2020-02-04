import RouteController from "./route-controller";
import TripInfoComponent from "../components/trip-info-component";
import {render, RenderPosition} from "../utils/render";
import {getEventTotalPrice} from '../utils/common';

export default class TripInfoController {
  constructor(container, pointsModel) {
    this._container = container;
    this._onDataChange = this._onDataChange.bind(this);

    this._totalCost = pointsModel.getAllPoints()
      .reduce((acc, point) => acc + getEventTotalPrice(point), 0);

    this._tripInfoComponent = new TripInfoComponent(this._totalCost);
    this._routeController = new RouteController(this._tripInfoComponent, pointsModel);

    pointsModel.addEventHandler(this._onDataChange);
  }

  render() {
    this._routeController.render();
    render(this._container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _onDataChange(oldPoint, newPoint) {
    if (!oldPoint) {
      if (newPoint) {
        this._onNewPoint(newPoint);
      } else {
        throw new Error(`Invalid point model update operation, both arguments are undefined`);
      }
    } else {
      if (newPoint) {
        this._onUpdatePoint(oldPoint, newPoint);
      } else {
        this._onDeletePoint(oldPoint);
      }
    }

    this._tripInfoComponent.updateCost(this._totalCost);
  }


  _onUpdatePoint(oldPoint, newPoint) {
    this._onDeletePoint(oldPoint);
    this._onNewPoint(newPoint);
  }

  _onNewPoint(point) {
    this._totalCost = this._totalCost + getEventTotalPrice(point);
  }

  _onDeletePoint(point) {
    this._totalCost = this._totalCost - getEventTotalPrice(point);
  }
}
