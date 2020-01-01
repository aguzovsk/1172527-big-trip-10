import {createCardTemplate} from "./card";

export const createCardContainer = (eventList) => {
  const cardList = eventList.sort((a, b) => a.dateFrom - b.dateFrom)
  .map(createCardTemplate).join(`\n`);

  return (
    `<ul class="trip-events__list">
      ${cardList}
    </ul>`
  );
};
