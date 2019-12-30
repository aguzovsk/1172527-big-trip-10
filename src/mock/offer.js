import {getShuffled} from '../util.js';

const offerList = [
  {
    name: `luggage`,
    description: `Add luggage`,
    price: 10
  },
  {
    name: `comfort`,
    description: `Switch to comfort class`,
    price: 150
  },
  {
    name: `meal`,
    description: `Add meal`,
    price: 2
  },
  {
    name: `seats`,
    description: `Choose seats`,
    price: 9
  }
];

export const generateOfferList = () =>
  getShuffled(offerList).slice(0, 3);
