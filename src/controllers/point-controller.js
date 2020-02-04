import CardComponent from "../components/card-component";
import CardEditComponent from "../components/new-event-component";
import {render, RenderPosition, replaceOldToNew, remove} from '../utils/render';
import {generateOfferList} from "../mock/offer";
import {isValidPoint} from '../utils/common';

export const PointControllerMode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  CREATE: `create`
};

export default class PointController {
  constructor(container, dependencies) {
    const {destinations, onDataChange, onViewChange} = dependencies;
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._destinations = destinations;

    this._mode = PointControllerMode.DEFAULT;
    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, mode) {
    if (mode) {
      this._mode = mode;
    }

    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointComponent = new CardComponent(event);
    this._pointEditComponent = new CardEditComponent(event, this._destinations);

    this._pointComponent.setEditButtonClickHandler(() => {
      this._replacePointToEdit();
    });

    this._pointEditComponent.setFavoriteChangeHandler((oldPoint) => {
      this._onDataChange(this, oldPoint, oldPoint.clone({
        isFavorite: !oldPoint.isFavorite
      }));
    });

    this._pointEditComponent.setSubmitHandler((oldPoint, options) => {
      this._onDataChange(this, isValidPoint(oldPoint) && oldPoint, oldPoint.clone(options));
      this._replaceEditToPoint();
    });

    this._pointEditComponent.setRollupHandler(() => {
      this._replaceEditToPoint();
    });

    this._pointEditComponent.setDeleteHandler((oldPoint) => {
      this._onDataChange(this, oldPoint, null);
    });

    this._pointEditComponent.setEventTypeChangeHandler(() => {
      return generateOfferList();
    });

    if (this._mode !== PointControllerMode.CREATE) {
      if (oldPointEditComponent && oldPointComponent) {
        replaceOldToNew(oldPointComponent, this._pointComponent);
        replaceOldToNew(oldPointEditComponent, this._pointEditComponent);
      } else {
        render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
      }
    } else {
      this._onViewChange();
      render(this._container, this._pointEditComponent, RenderPosition.AFTEREND);
    }
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceOldToNew(this._pointEditComponent, this._pointComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _replacePointToEdit() {
    this._onViewChange();

    replaceOldToNew(this._pointComponent, this._pointEditComponent);
    this._mode = PointControllerMode.EDIT;
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    // this._pointEditComponent.reset();
    replaceOldToNew(this._pointEditComponent, this._pointComponent);
    this._mode = PointControllerMode.DEFAULT;
  }

  setDefaultView() {
    if (this._mode !== PointControllerMode.DEFAULT) {
      if (this._mode === PointControllerMode.CREATE) {
        this.empty();
      } else {
        this._replaceEditToPoint();
      }
    }
  }

  clear() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
    this._pointComponent = null;
    this._pointEditComponent = null;
  }

  empty() {
    this.clear();
    this._container = null;
    // this._onDataChange = null;
    // this._onViewChange = null;
    this._destinations = null;

    this._mode = null;

    // this._onEscKeyDown = null;
  }

  getMode() {
    return this._mode;
  }
}
