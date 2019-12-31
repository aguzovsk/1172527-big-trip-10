import {getYearMonthDay} from '../date-utils.js';
import {createDayMarkup} from './day.js';

export const createDaysContainer = (eventList) => {
  const map = new Map();
  eventList.forEach((event) => {
    const date = getYearMonthDay(event.dateFrom);
    let array = map.get(date);
    if (!array) {
      array = [];
      map.set(date, array);
    }
    array.push(event);
  });

  const sortedArray = Array.from(map).sort((a, b) => a[0] > b[0] ? 1 : -1);
  let counter = 1;

  return (
    `<ul class="trip-days">
      ${sortedArray.map((keyValue) =>
      createDayMarkup(counter++, keyValue[0], keyValue[1]))
          .join(`\n`)
    }
    </ul>`
  );
};
