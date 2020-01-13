import {getShuffled, getRandomIntInRange} from '../utils/common.js';

const offers = [
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
  return getShuffled(offers).slice(0, max);
};
