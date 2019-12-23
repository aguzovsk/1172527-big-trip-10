import {createCardContainer} from './components/card-container.js';
import {createCardTemplate} from './components/card.js';
import {createFiltersTemplate} from './components/filters.js';
import {createMenuTemplate} from './components/menu.js';
import {createNewEventTemplate} from './components/new-event.js';
import {createRouteTemplate} from './components/route.js';
import {createSortedTemplate} from './components/sort.js';

const CARD_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);

render(tripInfo, createRouteTemplate(), `beforebegin`);
render(tripControls.children[0], createMenuTemplate(), `afterend`);
render(tripControls, createFiltersTemplate());

const tripEvents = document.querySelector(`.trip-events`);

render(tripEvents, createSortedTemplate());
render(tripEvents, createCardContainer());


const events = tripEvents.querySelector(`.trip-events__list`);
render(events, createNewEventTemplate());

new Array(CARD_COUNT)
  .fill(``)
  .forEach(
      () => render(events, createCardTemplate())
  );
