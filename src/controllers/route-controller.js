import RouteComponent from '../components/route-component';
import {render, RenderPosition} from "../utils/render";

export default class RouteController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._onDataChange = this._onDataChange.bind(this);

    const [startPoint, finishPoint] = this._getBoundaryPoints();
    const midPointName = this._getMidPointName();
    this._startPoint = startPoint;
    this._finnishPoint = finishPoint;

    this._routeComponent = new RouteComponent(startPoint, midPointName, finishPoint);

    pointsModel.addEventHandler(this._onDataChange);
  }

  render() {
    render(this._container, this._routeComponent, RenderPosition.AFTERBEGIN);
  }

  _updateBoundaries() {
    const [startPoint, finnishPoint] = this._getBoundaryPoints();
    this._startPoint = startPoint;
    this._finnishPoint = finnishPoint;
  }

  _updateRouteComponent() {
    const midPointName = this._getMidPointName();
    this._routeComponent.rerender(this._startPoint, midPointName, this._finnishPoint);
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
  }

  _onUpdatePoint(oldPoint, newPoint) {
    this._onDeletePoint(oldPoint);
    this._onNewPoint(newPoint);
  }

  _onNewPoint(point) {
    if (!this._startPoint || !this._finnishPoint) {
      this._startPoint = point;
      this._finnishPoint = point;

      this._routeComponent.rerender(point, undefined, point);
      return;
    }

    let isBoundaryChanged = false;
    if (this._startPoint.dateFrom > point.dateFrom) {
      isBoundaryChanged = true;
      this._startPoint = point;
    }
    if (this._finnishPoint.dateTo < point.dateTo) {
      isBoundaryChanged = true;
      this._finnishPoint = point;
    }

    const shouldChangeMidPointName = this._pointsModel.size() < 5;
    if (isBoundaryChanged || shouldChangeMidPointName) {
      this._updateRouteComponent();
    }
  }

  _onDeletePoint(point) {
    const isBoundaryChanged = point === this._finnishPoint || point === this._finnishPoint;
    const shouldChangeMidPointName = this._pointsModel.size() < 4;

    if (isBoundaryChanged || shouldChangeMidPointName) {
      if (isBoundaryChanged) {
        this._updateBoundaries();
      }

      this._updateRouteComponent();
    }
  }

  _getBoundaryPoints() {
    const points = this._pointsModel.getAllPoints();

    let min = points[0];
    let max = points[0];
    for (let i = 1; i < points.length; ++i) {
      const point = points[i];
      if (point.dateFrom < min.dateFrom) {
        min = point;
      }

      if (point.dateTo > max.dateTo) {
        max = point;
      }
    }

    return [min, max];
  }

  _getMidPointName() {
    const points = this._pointsModel.getAllPoints();

    if (points.length < 3) {
      return undefined;
    } else if (points.length === 3) {
      if (!(this._startPoint && this._finnishPoint)) {
        this._updateBoundaries();
      }

      for (const point of points) {
        if (point !== this._startPoint &&
          point !== this._finnishPoint) {
          return point.destination.name;
        }
      }
    }

    return `...`;
  }
}
