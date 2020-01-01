const createImageMarkup =
  ({image, description}) =>
    `<img class="event__photo" src="${image}" alt="${description}"></img>`;

const showImages =
  (images) => images.map(createImageMarkup).join(`\n`);

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

const createEventDetails = ({offers, destination}) => {
  const {description, pictures} = destination;
  return `<section class="event__details">
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
          ${showImages(pictures)}
        </div>
      </div>
    </section>
  </section>`;
};

export {createEventDetails};
