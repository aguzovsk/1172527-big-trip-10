import {offerTypes} from '../const.js';

export const getShuffled = (input) => {
  const items = input.slice();
  for (let i = items.length - 1; i > 0; --i) {
    let j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

export const getTypeText = (type) => {
  const activityTypes = offerTypes.find((obj) => obj.name === `Activity`).types;
  const isActivity = activityTypes.indexOf(type) !== -1;
  const capitalized = capitalize(type);
  if (!isActivity) {
    return `${capitalized} to`;
  } else {
    return `${capitalized} at`;
  }
};

export const getRandomIntInRange =
  (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const capitalize =
  (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const formatDecimal = (dec) => dec < 10 ? `0${dec}` : `${dec}`;

export const getEventTotalPrice = (event) =>
  event.offers.reduce((acc, {price}) => acc + price, 0) + event.basePrice;

export const addToArrayAtIndex = (array, index, item) => {
  const first = array.slice(0, index);
  const second = array.slice(index + 1);
  return [].concat(first, item, second);
};

export const removeFromArrayAtIndex = (array, index) => {
  const first = array.slice(0, index);
  const second = array.slice(index + 1);
  return [].concat(first, second);
};

export const removeFromArray = (array, element) => {
  const index = array.findIndex((elem) => elem === element);

  if (index === -1) {
    throw new Error(`Can't find element in array`);
  }

  return removeFromArrayAtIndex(array, index);
};

export const unshiftArray = (array, element) => {
  return [].concat(element, array);
};

export const replaceElementInArray = (array, oldElement, newElement) => {
  if (typeof oldElement.id !== typeof newElement.id) {
    throw new Error(`Either old element or new element has undefined id field, while other has defined`);
  }

  let index = -1;

  if (typeof oldElement === `undefined`) {
    index = array.findIndex((elem) => elem === oldElement);
    if (index === -1) {
      throw new Error(`Can't find element in array`);
    }
  } else {
    index = array.findIndex((elem) => elem.id === oldElement.id);
    if (index === -1) {
      throw new Error(`Can't find element in array with such id ${oldElement.id}`);
    }
  }

  const first = array.slice(0, index);
  const second = array.slice(index + 1);

  return [].concat(first, newElement, second);
};
