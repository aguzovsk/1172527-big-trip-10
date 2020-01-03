import {createCardTemplate} from "./card.js";

export const createCardContainer = (eventList) => {
  const cardList = eventList
  .map(createCardTemplate).join(`\n`);

  return (
    `<ul class="trip-events__list">
      ${cardList}
    </ul>`
  );
};
