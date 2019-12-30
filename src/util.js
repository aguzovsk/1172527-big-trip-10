export const getShuffled = (arr) => {
  const array = arr.slice();
  for (let i = array.length - 1; i > 0; --i) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getRandomIntInRange =
  (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const capitalize =
  (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const formatDecimal = (dec) => dec < 10 ? `0${dec}` : `${dec}`;
