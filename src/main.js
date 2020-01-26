import MenuComponent from './components/menu.js';
import RouteComponent from './components/route.js';
import {generateEventList} from './mock/event-details.js';
import {render, RenderPosition} from './utils/render.js';
import {menuNames} from './const.js';
import TripController from './controllers/trip.js';
import PointsModel from './models/points.js';
import FiltersController from './controllers/filters.js';

const events = generateEventList();
events.sort((a, b) => a.dateFrom - b.dateFrom);

const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const tripInfo = document.querySelector(`.trip-main__trip-info`);
if (events.length) {
  render(tripInfo, new RouteComponent(events).getElement(), RenderPosition.AFTERBEGIN);
}

const tripControls = document.querySelector(`.trip-main__trip-controls`);
render(tripControls.children[0], new MenuComponent(menuNames).getElement(), RenderPosition.AFTEREND);
const filtersController = new FiltersController(tripControls, pointsModel);
filtersController.render();

const tripController = new TripController(document.querySelector(`.trip-events`), pointsModel);
tripController.render();

const tripEvents = document.querySelector(`.trip-events`);

const totalSum = tripInfo.querySelector(`.trip-info__cost-value`);
const eventPrices = Array.from(tripEvents.querySelectorAll(`.event__price-value`));
const sum = eventPrices.reduce((acc, {innerText}) => acc + parseInt(innerText, 10), 0);
totalSum.innerText = sum;
