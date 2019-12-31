import {createFiltersTemplate} from './components/filters.js';
import {createMenuTemplate} from './components/menu.js';
import {createNewEventTemplate} from './components/new-event.js';
import {createRouteTemplate} from './components/route.js';
import {createSortedTemplate} from './components/sort.js';
import {createDaysContainer} from './components/days-container.js';
import {cities} from './const.js';
import {generateEventList, generateEventData} from './mock/event-details.js';
import {createEventDetails} from './components/new-event-details.js';

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripInfo = document.querySelector(`.trip-main__trip-info`);
render(tripInfo, createRouteTemplate(), `beforebegin`);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
render(tripControls.children[0], createMenuTemplate(), `afterend`);
render(tripControls, createFiltersTemplate());

const tripEvents = document.querySelector(`.trip-events`);
render(tripEvents, createSortedTemplate());
render(tripEvents, createNewEventTemplate());
render(tripEvents, createDaysContainer(generateEventList()));

const totalSum = tripInfo.querySelector(`.trip-info__cost-value`);
const eventPrices = Array.from(tripEvents.querySelectorAll(`.event__price-value`));
const sum = eventPrices.reduce((acc, {innerText}) => acc + parseInt(innerText), 0);
totalSum.innerText = sum;

const newEvent = tripEvents.querySelector(`.event--edit`);
const destinationInput = newEvent.querySelector(`#event-destination-1`);
destinationInput.addEventListener(`input`, (evt) => {
  if (cities.has(evt.target.value)) {
    const event = generateEventData(evt.target.value)
    render(newEvent, createEventDetails(event));
  } else {
    if (newEvent.children.length > 1) {
      newEvent.removeChild(newEvent.lastElementChild);
    }
  }
});

const eventItemList = newEvent.querySelectorAll(`.event__type-item`);
const eventIcon = newEvent.querySelector(`.event__type-icon`);
eventItemList.forEach((item) => item.addEventListener(`click`, function(evt) {
  const type = this.querySelector(`input`).value;
  eventIcon.src=`img/icons/${type}.png`;
}));
