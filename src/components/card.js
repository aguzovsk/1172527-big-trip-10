import {getTime, convertDateToDatetime, getDateDiff} from '../date-utils.js';
import {offerTypes} from '../const.js';
import {capitalize} from '../util.js';

const getTypeText = (type, place) => {
  const activityTypes = offerTypes.find((obj) => obj.name === `Activity`).types;
  const isActivity = activityTypes.indexOf(type) !== -1;
  if (!isActivity) {
    return `${capitalize(type)} to ${place}`;
  } else {
    switch (type) {
      case `check-in`: return `Check in hotel`;
      case `sightseeing`: return `Sightseeing at ${place}`;
      default: return capitalize(type);
    }
  }
};

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

export const createCardTemplate = (event) => {
  const {type, basePrice, dateFrom, dateTo, offers, city} = event;
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
        <h3 class="event__title">${getTypeText(type, city)}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${start}">${getTime(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${end}">${getTime(dateTo)}</time>
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
