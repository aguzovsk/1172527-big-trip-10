import TripEventsController from './controllers/page-body/trip-events-controller';
import StatisticsComponent from './components/page-body/statistics-component';
import DefaultContainer from './components/default-container-component';
import TripMainController from './controllers/page-header/trip-main-controller';
import PointsModel from './models/points-model';
import API from './api';
import {URL, AUTHORIZATION} from './const';
import {render, RenderPosition} from './utils/render';

const api = new API(URL, AUTHORIZATION);
const downloadPoints = api.getPoints()
  .then((points) => {
    const pointsModel = new PointsModel(api);
    pointsModel.setPoints(points);
    return pointsModel;
  });

const downloadOffers = api.getOffers();
const downloadDestinations = api.getDestinations();

Promise.all([downloadPoints, downloadOffers, downloadDestinations])
  .then((values) => {
    const pointsModel = values[0];

    const tripEventsDependencies = {
      pointsModel,
      offers: values[1],
      destinations: values[2]
    };

    const bodyElement = document.querySelector(`main .page-body__container`);
    const bodyComponent = new DefaultContainer(bodyElement);
    const tripEventsController = new TripEventsController(bodyComponent, tripEventsDependencies);
    const statisticsComponent = new StatisticsComponent(pointsModel);

    const tripHeaderDependencies = {
      tripEvents: tripEventsController,
      statistics: statisticsComponent,
      pointsModel
    };

    const headerElement = document.querySelector(`header .page-header__container`);
    const tripMainController = new TripMainController(new DefaultContainer(headerElement), tripHeaderDependencies);

    tripMainController.render();
    tripEventsController.render();
    render(bodyComponent, statisticsComponent, RenderPosition.BEFOREEND);
    statisticsComponent.hide();
  });
