import Offer from './offer-model';
import {offerTypes} from '../const';

export default class Point {
  constructor(data) {
    if (data) {
      this.id = data[`id`];
      this.basePrice = data[`base_price`];
      this.dateFrom = new Date(data[`date_from`]);
      this.dateTo = new Date(data[`date_to`]);
      this.type = data[`type`];
      this.offers = Offer.parseOffers(data[`offers`]);
      this.isFavorite = data[`is_favorite`];
      this.destination = data[`destination`];
    } else {
      this.id = Number.NaN;
      this.basePrice = 0;
      this.dateFrom = new Date();
      this.dateTo = new Date();
      this.type = offerTypes.values().next().value[0];
      this.offers = [];
      this.isFavorite = false;
      this.destination = {};
    }
  }

  toRaw() {
    return {
      'id': this.id,
      'destination': this.destination,
      'base_price': this.basePrice,
      'date_from': this.dateFrom.toISOString(),
      'date_to': this.dateTo.toISOString(),
      'type': this.type,
      'offers': Offer.arrayToRaw(this.offers),
      'is_favorite': this.isFavorite
    };
  }

  clone(options) {
    const newPoint = new Point(this.toRaw());
    for (const option in options) {
      if (newPoint[option]) {
        newPoint[option] = options[option];
      }
    }

    return newPoint;
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRaw());
  }
}
