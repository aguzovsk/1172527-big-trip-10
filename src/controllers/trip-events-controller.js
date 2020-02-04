import NoCardsComponent from "../components/no-cards-component";
import SortComponent, {SortTypes} from "../components/sort-component";
import {render, RenderPosition} from '../utils/render';
import {getEventTotalPrice} from '../utils/common';
import DaysController from "./days-controller";
import TripEventsComponent from '../components/trip-events-component';
import LoadingComponent from "../components/loading-component";
import PointController, {PointControllerMode} from "./point-controller";
import Point from "../models/point-model";

export default class TripEventsController {
  constructor(container, dependencies) {
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._container = container;
    this._dependencies = Object.assign({}, dependencies, {
      onDataChange: this._onDataChange,
      onViewChange: this._onViewChange
    });

    this._tripEventsComponent = new TripEventsComponent();
    this._noCardsComponent = new NoCardsComponent();
    this._loadingComponent = new LoadingComponent();
    this._sortComponent = new SortComponent();
    this._daysController = new DaysController(this._tripEventsComponent, this._dependencies);
    this._newEventController = new PointController(this._sortComponent, this._dependencies);
    this._newEventButtonController = null;

    this._pointControllers = [];
    this._pointsModel = dependencies.pointsModel;
    this._sortType = SortTypes.BY_EVENT;

    this._pointsModel.addOnFilterChangeHandler(this._filterChangeHandler);
    this._sortComponent.setEventHandlers(this._onSortTypeChange);
  }

  render() {
    const points = this._pointsModel.getPoints();
    if (!points.length) {
      render(this._tripEventsComponent, this._noCardsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._tripEventsComponent, this._sortComponent, RenderPosition.BEFOREEND);

    this._renderPoints();
  }

  _renderPoints() {
    this._pointControllers.forEach((ctrl) => ctrl.empty());

    const sortedPoints = this._sortPoints(this._sortType);
    this._pointControllers = this._daysController.render(sortedPoints, this._sortType !== SortTypes.BY_EVENT);

    render(this._container, this._tripEventsComponent, RenderPosition.BEFOREEND);
  }

  show() {
    this._tripEventsComponent.show();
  }

  hide() {
    if (!this._pointsModel.isEmpty()) {
      this._tripEventsComponent.hide();
    }
  }

  _onDataChange(controller, oldPoint, newPoint) {
    if (!oldPoint) {
      if (newPoint) {
        this._pointsModel.addPoint(newPoint);
        this._closeNewEventAdditionForm();
      }
    } else if (newPoint) {
      this._pointsModel.updatePoint(oldPoint, newPoint);
    } else {
      this._pointsModel.remove(oldPoint);
    }

    this._renderPoints();
  }

  _closeNewEventAdditionForm() {
    this._newEventButtonController.enable();
    this._newEventController.clear();
  }

  _onViewChange() {
    if (this._newEventButtonController.isDisabled()) {
      this._closeNewEventAdditionForm();
    }
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _filterChangeHandler() {
    this._renderPoints();
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

    this._renderPoints();
  }

  setNewEventButtonController(newEventButtonController) {
    this._newEventButtonController = newEventButtonController;
    newEventButtonController.setOnClickHandler(
      (function () {
        this._onViewChange();
        this._newEventController.render(new Point(), PointControllerMode.CREATE);
        this._newEventButtonController.disable();
      }).bind(this)
    );
  }
}
