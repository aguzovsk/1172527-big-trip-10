import {createDayInfo} from './day-info.js';
import {createCardContainer} from './card-container.js';

export const createDayMarkup = (events, counter) => {
  return (
    `<li class="trip-days__item  day">
      ${createDayInfo(counter, events[0].dateFrom)}
      
      ${createCardContainer(events)}
    </li>`
  );
};
