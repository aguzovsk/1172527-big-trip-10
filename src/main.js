import FiltersComponent from './components/filters.js';
import MenuComponent from './components/menu.js';
import RouteComponent from './components/route.js';
import SortComponent from './components/sort.js';
import DaysContainerComponent from './components/days-container.js';
import {generateEventList} from './mock/event-details.js';
import {render, RenderPosition} from './util.js';

const eventList = generateEventList();
eventList.sort((a, b) => a.dateFrom - b.dateFrom);

const tripInfo = document.querySelector(`.trip-main__trip-info`);
render(tripInfo, new RouteComponent(eventList).getElement(), RenderPosition.AFTERBEGIN);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
render(tripControls.children[0], new MenuComponent().getElement(), RenderPosition.AFTEREND);
render(tripControls, new FiltersComponent().getElement(), RenderPosition.BEFOREEND);

const tripEvents = document.querySelector(`.trip-events`);
render(tripEvents, new SortComponent().getElement());
const daysContainerComponent = new DaysContainerComponent(document, eventList, false).getElement();
render(tripEvents, daysContainerComponent, RenderPosition.BEFOREEND);

const totalSum = tripInfo.querySelector(`.trip-info__cost-value`);
const eventPrices = Array.from(tripEvents.querySelectorAll(`.event__price-value`));
const sum = eventPrices.reduce((acc, {innerText}) => acc + parseInt(innerText, 10), 0);
totalSum.innerText = sum;
