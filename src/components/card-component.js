import {getHourMinute, convertDateToDatetime, getDateDiff} from '../utils/date-utils';
import {getTypeText, getEventTotalPrice, getFirstThree} from '../utils/common';
import AbstractComponent from './abstract-component';

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

const showOffers = (offers) => {
  return offers.map(createEventOfferMarkup).join(`\n`);
};

const createCardTemplate = (event) => {
  const {type, dateFrom, dateTo, offers, destination} = event;
  const totalPrice = getEventTotalPrice(event);
  const start = convertDateToDatetime(dateFrom);
  const end = convertDateToDatetime(dateTo);
  const duration = getDateDiff(dateFrom, dateTo);
  const name = destination && destination.name || ``;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${getTypeText(type)} ${name}</h3>

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
          ${showOffers(getFirstThree(offers))}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class CardComponent extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createCardTemplate(this._event);
  }

  setEditButtonClickHandler(handler) {
    const button = this.getElement().querySelector(`.event__rollup-btn`);

    button.addEventListener(`click`, handler);
  }
}
