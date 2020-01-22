import {capitalize, getTypeText} from '../utils/common.js';
import {offerTypes} from '../const.js';
import AbstractSmartComponent from './abstract-smart-component.js';

const createCitiesMarkup = (cities) => {
  return cities
    .map((city) => `<option value="${city}"></option>`)
    .join(`\n`);
};

const showEventType = (type, isSelected) =>
  `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isSelected ? `checked` : ``}></input>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalize(type)}</label>
  </div>`;

const showGroupsOfEventTypes = (groups, selected) =>
  groups.map((group) => (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">${group.name}</legend>

      ${group.types.map((type) => showEventType(type, type === selected)).join(`\n`)}
    </fieldset>`
  ))
    .join(`\n`);

const showOffer = (offer) => {
  const {name, description, price} = offer;
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}" checked>
      <label class="event__offer-label" for="event-offer-${name}-1">
        <span class="event__offer-title">${description}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

export const createNewEventTemplate = (event, destinations, options = {}) => {
  const {isEditMode, isFavorite, offers, destination, type} = options;
  const {dateFrom, dateTo, basePrice} = event;
  const {description, pictures} = destination;
  const isValidDestination = !!destinations.get(destination.name);
  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            ${showGroupsOfEventTypes(offerTypes, type)}
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${getTypeText(type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createCitiesMarkup(Array.from(destinations.keys()))}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom.toDateString()}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo.toDateString()}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isEditMode ? `Delete` : `Cancel`}</button>
        ${isEditMode ?
      `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>` : ``
    }
      </header>
      ${isValidDestination ?
      `<section class="event__details">
      ${offers && offers.length ?
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offers.map(showOffer).join(`\n`)}
        </div>
      </section>` : ``}
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
              ${pictures.map(
      ({image, description: imgDescription}) =>
        `<img class="event__photo" src="${image}" alt="${imgDescription}"></img>`
    )
      .join(`\n`)}
            </div>
          </div>
        </section>
      </section>` : `` }
    </form>`
  );
};

export default class CardEditComponent extends AbstractSmartComponent {
  constructor(event, destinations) {
    super();
    this._event = event;
    this._isEditMode = true;
    this._isFavorite = event.isFavorite;
    this._type = event.type;
    this._offers = event.offers;
    this._destination = event.destination;
    this._destinations =
      destinations.reduce((hashmap, entry) =>
        hashmap.set(entry.name, entry), new Map()
      );

    this._submitHandler = null;
    this._deleteHandler = null;
    this._rollupHandler = null;
    this._favoriteChangeHandler = null;
    this._eventTypeChangeHandler = null;
    this.setDestinationInputListener();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setFavoriteChangeHandler(this._favoriteChangeHandler);
    this.setDeleteHandler(this._deleteHandler);
    this.setRollupHandler(this._rollupHandler);
    this.setEventTypeChangeHandler(this._eventTypeChangeHandler);
    this.setDestinationInputListener();
  }

  getTemplate() {
    return createNewEventTemplate(this._event, this._destinations, {
      isEditMode: this._isEditMode,
      isFavorite: this._isFavorite,
      destination: this._destination,
      offers: this._offers,
      type: this._type
    });
  }

  rerender() {
    super.rerender();

    this.recoveryListeners();
  }

  setSubmitHandler(handler) {
    const form = this.getElement();
    const options = {
      destination: this._destination,
      offers: this._offers,
      type: this._type
    };

    this._submitHandler = handler;

    form.addEventListener(`submit`, (evt) => handler(evt, this._event, options));
  }

  setDeleteHandler(handler) {
    const form = this.getElement();

    this._deleteHandler = handler;

    form.addEventListener(`reset`, () => handler(this._event));
  }

  setRollupHandler(handler) {
    const button = this.getElement().querySelector(`.event__rollup-btn`);

    this._rollupHandler = handler;

    button.addEventListener(`click`, handler);
  }

  setFavoriteChangeHandler(handler) {
    const button = this.getElement()
      .querySelector(`#event-favorite-1`);

    this._favoriteChangeHandler = handler;

    button.addEventListener(`change`, () => handler(this._event));
  }

  setEventTypeChangeHandler(handler) {
    this._eventTypeChangeHandler = handler;
    const element = this.getElement();
    const input = element.querySelector(`.event__type-list`);
    input.addEventListener(`change`, (evt) => {
      const type = evt.target.value;
      this._type = type;
      this._offers = handler(type);

      this.rerender();
    });
  }

  setDestinationInputListener() {
    const element = this.getElement();
    const destinationInput = element.querySelector(`#event-destination-1`);

    destinationInput.addEventListener(`change`, (evt) => {
      const city = evt.target.value;
      this._destination = this._destinations.get(city) || {name: city};

      this.rerender();
    });
  }

  // reset() {
  //   this._rollupHandler();
  // }
}
