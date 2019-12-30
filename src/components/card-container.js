import {createCardTemplate} from "./card";

export const createCardContainer = (eventList) => {
  const cardList = eventList.map(
      (card) => createCardTemplate(card)
  ).join(`\n`);

  return (
    `<ul class="trip-events__list">
      ${cardList}
    </ul>`
  );
};
