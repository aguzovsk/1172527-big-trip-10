import MenuComponent from './components/menu.js';
import RouteComponent from './components/route.js';
import {generateEventList} from './mock/event-details.js';
import {render, RenderPosition} from './utils/render.js';
import {menuNames, MenuItem} from './const.js';
import TripController from './controllers/trip.js';
import PointsModel from './models/points.js';
import FiltersController from './controllers/filters.js';
import StatisticsComponent from './components/statistics.js';

const events = generateEventList();
events.sort((a, b) => a.dateFrom - b.dateFrom);

const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const tripInfo = document.querySelector(`.trip-main__trip-info`);
if (events.length) {
  render(tripInfo, new RouteComponent(events).getElement(), RenderPosition.AFTERBEGIN);
}

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const menuComponent = new MenuComponent(menuNames);
render(tripControls.children[0], menuComponent.getElement(), RenderPosition.AFTEREND);
const filtersController = new FiltersController(tripControls, pointsModel);
filtersController.render();

const tripEvents = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEvents, pointsModel);
tripController.render();

const bodyContainer = document.querySelector(`main .page-body__container`);
const statisticsComponent = new StatisticsComponent(pointsModel);
render(bodyContainer, statisticsComponent.getElement(), RenderPosition.BEFOREEND);
statisticsComponent.hide();
menuComponent.setOnChange((menuName) => {
  if (menuName === MenuItem.TABLE) {
    // tripController.show();
    tripEvents.classList.remove(`visually-hidden`);
    statisticsComponent.hide();
  } else if (menuName === MenuItem.STATS) {
    // tripController.hide();
    tripEvents.classList.add(`visually-hidden`);
    statisticsComponent.show();
  } else {
    throw new Error(`Undefined menu type ${menuName}`);
  }
});


const totalSum = tripInfo.querySelector(`.trip-info__cost-value`);
const eventPrices = tripEvents.querySelectorAll(`.event__price-value`);
const sum = Array.prototype.reduce.call(eventPrices, (acc, {innerText}) => acc + parseInt(innerText, 10), 0);
totalSum.innerText = sum;
