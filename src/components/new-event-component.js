import {capitalize, getTypeText, isValidPoint} from '../utils/common';
import {offerTypes} from '../const';
import AbstractSmartComponent from './abstract-smart-component';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import {formatDate} from '../utils/date-utils';
import Offers from '../models/offers-model';
import OffersWithType from '../models/offers-model';

const createCitiesMarkup = (cities) => {
  return cities
    .map((city) => `<option value="${city}"></option>`)
    .join(`\n`);
};

const showEventType = (type, isSelected) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isSelected ? `checked` : ``}></input>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalize(type)}</label>
    </div>`
  );
};

const showGroupsOfEventTypes = (selected) => {
  const groups = Array.from(offerTypes.keys());

  return groups.map((group) => (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">${group}</legend>

      ${offerTypes.get(group).map((type) => showEventType(type, type === selected)).join(`\n`)}
    </fieldset>`
  ))
    .join(`\n`);
};

const showOffer = (offer) => {
  const {name, description, price, checked} = offer;
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}" ${checked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${name}-1">
        <span class="event__offer-title">${description}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

export const createNewEventTemplate = (destinations, options = {}) => {
  const {isEditMode, isFavorite, offers, type, dateFrom, dateTo, basePrice} = options;
  const {destination} = options;
  const {description, pictures} = destination || {};
  const isValidDestination = destination && !!destinations.get(destination.name);
  const isEnabledSaveButton = isValidDestination && dateFrom <= dateTo;
  const name = isValidDestination && destination.name || ``;

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
            ${showGroupsOfEventTypes(type)}
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${getTypeText(type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createCitiesMarkup(Array.from(destinations.keys()))}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isEnabledSaveButton ? `` : `disabled`}>Save</button>
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
          ${offers.map((offer) => showOffer(offer, true)).concat(
      Offers.getUncheckedOffers(type, offers).map((offer) => showOffer(offer, false))
    ).join(`\n`)}
        </div>
      </section>` : ``}
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
              ${pictures.map(
      ({src, description: imgDescription}) =>
        `<img class="event__photo" src="${src}" alt="${imgDescription}"></img>`
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

    const safeEvent = event;

    this._isEditMode = isValidPoint(event);
    this._isFavorite = safeEvent.isFavorite;
    this._type = safeEvent.type;
    this._offers = OffersWithType.copmleteOfferList(this._type, event.offers);
    this._initialOffers = this._offers;
    this._destination = safeEvent.destination;
    this._dateFrom = safeEvent.dateFrom;
    this._dateTo = safeEvent.dateTo;
    this._basePrice = safeEvent.basePrice;

    this._destinations = destinations;

    this._startFlatpickr = null;
    this._endFlatpickr = null;

    this._submitHandler = null;
    this._deleteHandler = null;
    this._rollupHandler = null;
    this._favoriteChangeHandler = null;
    this._eventTypeChangeHandler = null;
    this.setDestinationInputListener();
    this._applyFlatpickr();
    this.setPriceInputListener();
    this.setOffersToggleListener();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setFavoriteChangeHandler(this._favoriteChangeHandler);
    this.setDeleteHandler(this._deleteHandler);
    this.setRollupHandler(this._rollupHandler);
    this.setEventTypeChangeHandler(this._eventTypeChangeHandler);
    this.setDestinationInputListener();
    this._applyFlatpickr();
    this.setPriceInputListener();
    this.setOffersToggleListener();
  }

  getTemplate() {
    return createNewEventTemplate(this._destinations, {
      isEditMode: this._isEditMode,
      isFavorite: this._isFavorite,
      destination: this._destination,
      offers: this._offers,
      type: this._type,
      dateFrom: this._dateFrom,
      dateTo: this._dateTo,
      basePrice: this._basePrice
    });
  }

  setSubmitHandler(handler) {
    const form = this.getElement();
    this._submitHandler = handler;

    form.addEventListener(`submit`, (evt) => {
      evt.preventDefault();

      const options = {
        destination: this._destination,
        offers: this._offers.filter((offer) => offer.checked),
        type: this._type,
        dateFrom: this._dateFrom,
        dateTo: this._dateTo,
        basePrice: this._basePrice,
      };
      handler(this._event, options);
    });
  }

  setDeleteHandler(handler) {
    const form = this.getElement();

    this._deleteHandler = handler;

    form.addEventListener(`reset`, (evt) => {
      evt.preventDefault();
      handler(this._event);
    });
  }

  setRollupHandler(handler) {
    if (!this._isEditMode) {
      return;
    }

    const button = this.getElement().querySelector(`.event__rollup-btn`);

    this._rollupHandler = handler;

    button.addEventListener(`click`, handler);
  }

  setFavoriteChangeHandler(handler) {
    if (!this._isEditMode) {
      return;
    }

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
      const isInitialType = this._isEditMode && type === this._event.type;
      this._type = type;
      if (isInitialType) {
        this._offers = this._initialOffers;
      } else {
        this._offers = OffersWithType.getAllOffers(this._type);
      }

      this.rerender();
    });
  }

  setDestinationInputListener() {
    const element = this.getElement();
    const destinationInput = element.querySelector(`#event-destination-1`);

    destinationInput.addEventListener(`change`, (evt) => {
      const city = evt.target.value;
      this._destination = this._destinations.get(city);

      this.rerender();
    });
  }

  setPriceInputListener() {
    const element = this.getElement();
    const basePriceInput = element.querySelector(`#event-price-1`);
    basePriceInput.addEventListener(`input`, (evt) => {
      this._basePrice = parseInt(evt.target.value, 10);
    });
  }

  setOffersToggleListener() {
    const element = this.getElement();
    const toggles = element.querySelectorAll(`.event__offer-checkbox`);
    toggles.forEach((toggle) => toggle.addEventListener(`change`, (evt) => {
      const id = evt.target.id;
      const regexp = /event-offer-([A-Za-z_]+)-1/;
      const name = id.match(regexp)[1];
      const index = this._offers.findIndex((offer) => offer.name === name);

      if (index === -1) {
        throw new Error(`Can't find ${id}.`);
      }

      this._offers[index].toggle();
    }));
  }

  _destroyFlatpickr() {
    if (this._startFlatpickr) {
      this._startFlatpickr.destroy();
      this._startFlatpickr = null;
    }

    if (this._endFlatpickr) {
      this._endFlatpickr.destroy();
      this._endFlatpickr = null;
    }
  }

  removeElement() {
    super.removeElement();
    this._destroyFlatpickr();
  }

  _applyFlatpickr() {
    this._destroyFlatpickr();

    const startDateElement = this.getElement().querySelector(`#event-start-time-1`);
    const endDateElement = this.getElement().querySelector(`#event-end-time-1`);

    this._startFlatpickr = flatpickr(startDateElement, {
      // altInput: true,
      allowInput: true,
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      defaultDate: this._dateFrom,
      minuteIncrement: 1,
      onChange: (selectedDates) => {
        const dateFrom = new Date(selectedDates);
        this._dateFrom = dateFrom;
        // this._endFlatpickr.config.minDate = dateFrom;
        this.rerender();
      }
    });

    this._endFlatpickr = flatpickr(endDateElement, {
      // altInput: true,
      allowInput: true,
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      minuteIncrement: 1,
      minDate: this._dateFrom,
      defaultDate: this._dateTo,
      onChange: (selectedDates) => {
        this._dateTo = new Date(selectedDates);
        this.rerender();
      }
    });
  }

  // reset() {
  //   this._rollupHandler();
  // }
}
