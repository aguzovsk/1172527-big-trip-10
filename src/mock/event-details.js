import {getRandomIntInRange} from '../util.js';
import {MINUTE, HOUR, DAY} from '../date-utils.js';
import {offerTypes} from '../const.js';
import {generateDestination} from './destination.js';
import {generateOfferList} from './offer.js';

const LENGTH = 10;
let seq = 0;

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntInRange(0, 200);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generatePairDates = () => {
  const first = getRandomDate();

  const minutes = getRandomIntInRange(0, 60) * MINUTE;
  const hours = getRandomIntInRange(0, 24) * HOUR;
  const days = getRandomIntInRange(0, 3) * DAY;

  const second = new Date(first.getTime() + minutes + hours + days);

  return {first, second};
};

const generateType = () => {
  const allTypes = offerTypes.reduce((acc, {types}) => acc.concat(types), []);
  const idx = getRandomIntInRange(0, allTypes.length);
  return allTypes[idx];
};

const generateEventData = (destinationName) => {
  const {first, second} = generatePairDates();

  return {
    id: seq++,
    basePrice: getRandomIntInRange(10, 70) * 10,
    dateFrom: first,
    dateTo: second,
    type: generateType(),
    offers: generateOfferList(),
    destination: generateDestination(destinationName)
  };
};

const generateEventList = () => {
  return new Array(LENGTH).fill(``).map(() => generateEventData());
};

export {generateEventList, generateEventData};
