import {offerTypes} from './const.js';

export const getShuffled = (arr) => {
  const array = arr.slice();
  for (let i = array.length - 1; i > 0; --i) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.insertAdjacentElement(RenderPosition.AFTEREND, element);
      break;
  }
};
