import {getRandomIntInRange, getShuffled} from '../util.js';
import {citiesList} from '../const.js';

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const sentences = text.split(`. `).map((txt) => txt + (txt.endsWith(`.`) ? ` ` : `. `));

const generateDestinationName = () => {
  const idx = getRandomIntInRange(0, citiesList.length);
  return citiesList[idx];
};

const generateDestinationDescription = () => {
  const length = getRandomIntInRange(1, 4);
  const description = getShuffled(sentences).slice(0, length + 1).join(``);
  return description;
};

const generateImages = () => {
  const number = getRandomIntInRange(3, 8);
  return new Array(number).fill(``).map(
      () => `http://picsum.photos/300/150?r=${Math.random()}`
  );
};

const generateImageDescription = () => {
  const index = getRandomIntInRange(0, sentences.length);
  return sentences[index];
};

const generatePicturesWithDescription = () => {
  const images = generateImages();
  const pictures = images.map((image) => (
    {
      image,
      description: generateImageDescription()
    })
  );

  return pictures;
};

const generateDestination = (givenName) => {
  const name = givenName || generateDestinationName();
  return {
    name,
    description: generateDestinationDescription(),
    pictures: generatePicturesWithDescription()
  };
};

export {generateDestination};
