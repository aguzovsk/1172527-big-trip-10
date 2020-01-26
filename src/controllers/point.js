import CardComponent from "../components/card";
import CardEditComponent from "../components/new-event";
import {render, RenderPosition, replaceOldToNew, remove} from '../utils/render.js';
import {generateOfferList} from "../mock/offer";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  CREATE: `create`
};

export default class PointController {
  constructor(container, destinations, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._destinations = destinations;

    this._mode = Mode.DEFAULT;
    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event/* , mode */) {
    // if (mode) {
    //   this._mode = Mode.CREATION;
    // }

    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointComponent = new CardComponent(event);
    this._pointEditComponent = new CardEditComponent(event, this._destinations);

    this._pointComponent.setEditButtonClickHandler(() => {
      this._replacePointToEdit();
    });

    this._pointEditComponent.setFavoriteChangeHandler((oldEvent) => {
      this._onDataChange(this, oldEvent, Object.assign({}, oldEvent, {
        isFavorite: !oldEvent.isFavorite
      }));
    });

    this._pointEditComponent.setSubmitHandler((oldEvent, options) => {
      this._onDataChange(this, oldEvent, Object.assign({}, oldEvent, options));
      this._replaceEditToPoint();
    });

    this._pointEditComponent.setRollupHandler(() => {
      this._replaceEditToPoint();
    });

    this._pointEditComponent.setDeleteHandler((oldEvent) => {
      this._onDataChange(this, oldEvent, null);
    });

    this._pointEditComponent.setEventTypeChangeHandler(() => {
      return generateOfferList();
    });

    if (event) {
      if (oldPointEditComponent && oldPointComponent) {
        replaceOldToNew(oldPointComponent, this._pointComponent);
        replaceOldToNew(oldPointEditComponent, this._pointEditComponent);
      } else {
        render(this._container, this._pointComponent.getElement(), RenderPosition.BEFOREEND);
      }
    } else {
      this._onViewChange();
      this._mode = Mode.CREATE;
      render(this._container, this._pointEditComponent.getElement(), RenderPosition.AFTEREND);
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
    this._mode = Mode.EDIT;
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    // this._pointEditComponent.reset();
    replaceOldToNew(this._pointEditComponent, this._pointComponent);
    this._mode = Mode.DEFAULT;
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      if (this._mode === Mode.CREATE) {
        this.empty();
      } else {
        this._replaceEditToPoint();
      }
    }
  }

  empty() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
    this._container = null;
    // this._onDataChange = null;
    // this._onViewChange = null;
    this._destinations = null;

    this._mode = null;
    this._pointComponent = null;
    this._pointEditComponent = null;

    // this._onEscKeyDown = null;
  }
}
