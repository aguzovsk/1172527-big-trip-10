import {createDayInfo} from './day-info.js';
import {createCardContainer} from './card-container.js';

export const createDayMarkup = (dayInfo, events) => {
  const {counter, dayOfYear} = dayInfo;
  return (
    `<li class="trip-days__item  day">
      ${createDayInfo(counter, dayOfYear)}
      ${createCardContainer(events)}
    </li>`
  );
};
