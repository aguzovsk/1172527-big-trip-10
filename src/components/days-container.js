import {isSameDay} from '../date-utils.js';
import {createDayMarkup} from './day.js';

export const createDaysContainer = (eventList, noDays) => {
  if (!eventList.length) {
    return ``;
  }

  const array = [[eventList[0]]];
  for (let i = 1; i < eventList.length; ++i) {
    const event = eventList[i];
    const prevArr = array[array.length - 1];
    const prevEvent = prevArr[prevArr.length - 1];
    if (noDays || isSameDay(event.dateFrom, prevEvent.dateFrom)) {
      prevArr.push(event);
    } else {
      array.push([event]);
    }
  }

  return (
    `<ul class="trip-days">
      ${
    array.map((eventArray, idx) =>
      createDayMarkup(eventArray, !noDays ? idx + 1 : undefined)
    ).join(`\n`)
    }
    </ul>`
  );
};
