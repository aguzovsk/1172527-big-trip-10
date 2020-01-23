import CardComponent from "../components/card";
import CardEditComponent from "../components/new-event";
import {render, RenderPosition, replaceOldToNew, remove} from '../utils/render.js';
import {generateOfferList} from "../mock/offer";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
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

  render(event) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointComponent = new CardComponent(event);
    this._pointEditComponent = new CardEditComponent(event, this._destinations);

    this._pointComponent.setEditButtonClickHandler(() => {
      this._replacePointToEdit();
    });

    this._pointEditComponent.setFavoriteChangeHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite
      }));
    });

    this._pointEditComponent.setSubmitHandler((evt/* , oldEvent, options */) => {
      // alert("Update is not implemented yet.");
      evt.preventDefault();
      // this._onDataChange(this, oldEvent, Object.assign({}, oldEvent, options));
      // this._replaceEditToPoint();
    });

    this._pointEditComponent.setRollupHandler(() => {
      this._replaceEditToPoint();
    });

    this._pointEditComponent.setDeleteHandler((/* oldEvent */) => {
      // alert("Deletion is not implement yet");
      // this._onDataChange(this, oldEvent, null);
    });

    this._pointEditComponent.setEventTypeChangeHandler(() => {
      return generateOfferList();
    });

    if (oldPointEditComponent && oldPointComponent) {
      replaceOldToNew(oldPointComponent, this._pointComponent);
      replaceOldToNew(oldPointEditComponent, this._pointEditComponent);
    } else {
      render(this._container, this._pointComponent.getElement(), RenderPosition.BEFOREEND);
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
      this._replaceEditToPoint();
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
