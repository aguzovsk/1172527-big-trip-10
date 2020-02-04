import Offer from './offer-model';

const offers = new Map();
const handler = {
  set() {
    throw new Error(`Use parseOffersWithType to parse all the offers.`);
  },

  get(target, name, receiver) {
    const result = Reflect.get(target, name, receiver);
    return (typeof result === `function` ? result.bind(target) : result) || [];
  }
};

const instance = new Proxy(offers, handler);

const parseOfferWithType = (data) => {
  const simpleOffers = Offer.parseOffers(data.offers);

  offers.set(data.type, simpleOffers);
};

export default class OffersWithType {
  constructor() {
    throw new Error(`Can't instantiate OffersWithType`);
  }

  static getInstance() {
    return instance;
  }

  static parseOffersWithType(data) {
    data.forEach(parseOfferWithType);
    return instance;
  }

  static getUncheckedOffers(type, checkedOffers) {
    const typeOffers = instance.get(type);
    const uncheckedOffers = [];

    for (const offer of typeOffers) {
      let isUnchecked = true;
      for (const checkedOffer of checkedOffers) {
        if (Offer.areEqual(offer, checkedOffer)) {
          isUnchecked = false;
          break;
        }
      }

      if (isUnchecked) {
        uncheckedOffers.push(offer);
      }
    }

    return uncheckedOffers.map((offer) => offer.clone().uncheck());
  }

  static copmleteOfferList(type, initialOffers) {
    const complementOffers = OffersWithType
      .getUncheckedOffers(type, initialOffers);
    return [].concat(initialOffers, complementOffers);
  }

  static getAllOffers(type) {
    return instance.get(type).map(Offer.clone);
  }
}
