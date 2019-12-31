import {getShuffled, getRandomIntInRange} from '../util.js';

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

export const generateOfferList = () => {
  const max = getRandomIntInRange(0, 4);
  return getShuffled(offerList).slice(0, max);
};
