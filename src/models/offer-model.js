import {getInstanceShallowCopy} from "../utils/common";

export default class Offer {
  constructor(data) {
    this.name = data.title
      .replace(/[^a-zA-Z ]/g, ``)
      .trim().toLowerCase()
      .replace(/ /g, `_`);
    this.description = data.title;
    this.price = data.price;
    this.checked = true;
  }

  toRaw() {
    if (!this.checked) {
      throw new Error(`Can't serialize unchecked offer`);
    }

    return {
      'title': this.description,
      'price': this.price
    };
  }

  check() {
    this.checked = true;
    return this;
  }

  uncheck() {
    this.checked = false;
    return this;
  }

  toggle() {
    this.checked = !this.checked;
    return this;
  }

  clone() {
    return getInstanceShallowCopy(this);
  }

  static arrayToRaw(data) {
    return data.map((datum) => datum.toRaw());
  }

  static areEqual(offer1, offer2) {
    return offer1.description === offer2.description;
  }

  static parseOffer(data) {
    return new Offer(data);
  }

  static parseOffers(data) {
    return data.map(Offer.parseOffer);
  }

  static clone(offer) {
    return offer.clone();
  }
}
