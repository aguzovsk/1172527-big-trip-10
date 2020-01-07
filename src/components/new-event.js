import {citiesList} from '../const.js';
import {capitalize} from '../util.js';
import {offerTypes} from '../const.js';
import {createElement, getTypeText} from '../util.js';

const createCitiesMarkup = (cityList) => {
  return cityList
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

export const createNewEventTemplate = (event) => {
  const {basePrice, dateFrom, dateTo, type, destination, offers} = event;
  const {description, pictures} = destination;
  const totalPrice = basePrice + offers.reduce((acc, {price}) => acc + price, 0);
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" oninput="">
          <datalist id="destination-list-1">
            ${createCitiesMarkup(citiesList)}
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
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${totalPrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offers.map(showOffer).join(`\n`)}
          </div>
        </section>
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
      </section>
    </form>`
  );
};

export default class CardEditComponent {
  constructor(event, card, parent) {
    this._element = null;
    this._event = event;
    this._card = card;
    this._parent = parent;
  }

  getTemplate() {
    return createNewEventTemplate(this._event);
  }

  _setEventHandlers() {
    const form = this._element;
    const parent = this._parent;
    const document = this._element.ownerDocument;

    form.addEventListener(`submit`, () => {
      parent.replaceEditToCard(this, this._card);
      return false;
    });

    form.addEventListener(`reset`, () => {
      parent.replaceEditToCard(this, this._card);
    });

    document.addEventListener(`keydown`, this.onEscKeyDown.bind(this));
  }

  onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    const document = this._element.ownerDocument;

    if (isEscKey) {
      this._parent.replaceEditToCard(this, this._card);
      document.removeEventListener(`keydown`, this.onEscKeyDown);
    }
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._setEventHandlers();
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  clear() {
    this._element = null;
    this._event = null;
  }
}
