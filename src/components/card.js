import {getHourMinute, convertDateToDatetime, getDateDiff} from '../date-utils.js';
import CardEditComponent from './new-event.js';
import {getTypeText} from '../util.js';
import {createElement} from '../util.js';

const createEventOfferMarkup = (offer) => {
  const {description, price} = offer;
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${description}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>`
  );
};

const showOffers =
  (offerList) => offerList.map(createEventOfferMarkup).join(`\n`);

const createCardTemplate = (event) => {
  const {type, basePrice, dateFrom, dateTo, offers, destination} = event;
  const totalPrice = basePrice + offers.reduce((acc, {price}) => acc + price, 0);
  const start = convertDateToDatetime(dateFrom);
  const end = convertDateToDatetime(dateTo);
  const duration = getDateDiff(dateFrom, dateTo);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${getTypeText(type)} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${start}">${getHourMinute(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${end}">${getHourMinute(dateTo)}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${totalPrice}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${showOffers(offers)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class CardComponent {
  constructor(event, parent) {
    this._element = null;
    this._event = event;
    this._cardEdit = null;
    this._parent = parent;
  }

  getTemplate() {
    return createCardTemplate(this._event);
  }

  setEditEventHandler() {
    const button = this._element.querySelector(`.event__rollup-btn`);
    const parent = this._parent;
    button.addEventListener(`click`, () =>
      parent.replaceCardToEdit(this, this._cardEdit)
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._cardEdit = new CardEditComponent(this._event, this, this._parent);
      this.setEditEventHandler();
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  clear() {
    this._element = null;
    this._event = null;
    this._cardEdit = null;
  }
}
