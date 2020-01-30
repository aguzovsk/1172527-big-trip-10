import moment from 'moment';
import {getRandomIntInRange} from '../utils/common.js';
import {offerTypes} from '../const.js';
import {generateDestination} from './destination.js';
import {generateOfferList} from './offer.js';

const LENGTH = 10;
let seq = 0;
const dateStartOffset = -6;
const dateEndOffset = 6;

const getRandomMoment = (firstMoment) => {
  const isSecond = !!firstMoment;
  const targetMoment = isSecond ? firstMoment.clone() : moment();
  const randomDayStartOffset = isSecond ? 0 : dateStartOffset;
  const randomHourStartOffset = isSecond ? 0 : -24;
  const randomMinuteStartOffset = isSecond ? 0 : -60;
  const days = getRandomIntInRange(randomDayStartOffset, dateEndOffset);
  const hours = getRandomIntInRange(randomHourStartOffset, 24);
  const minutes = getRandomIntInRange(randomMinuteStartOffset, 60);

  targetMoment.add({days, hours, minutes});

  return targetMoment;
};

const generatePairDates = () => {
  const first = getRandomMoment();
  const second = getRandomMoment(first);

  return {first: first.toDate(), second: second.toDate()};
};

const generateType = () => {
  let allTypes = [];
  for (const value of offerTypes.values()) {
    allTypes = allTypes.concat(value);
  }
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
    isFavorite: Math.random() > 0.6,
    destination: generateDestination(destinationName)
  };
};

const generateEventList = () => {
  return new Array(LENGTH).fill(``).map(generateEventData);
};

export {generateEventList};
