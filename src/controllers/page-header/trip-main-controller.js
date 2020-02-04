import DefaultContainer from "../../components/default-container-component";
import {render, RenderPosition} from "../../utils/render";
import TripInfoController from "./trip-info-controller";
import TripControlsController from './trip-controls-controller';
import NewEventButtonController from "./new-event-button-controller";

export default class TripMainController {
  constructor(container, dependencies) {
    const {pointsModel, tripEvents} = dependencies;
    this._container = container;

    this._tripMainComponent = new DefaultContainer(`div`, `trip-main`);

    this._tripControlsController = new TripControlsController(this._tripMainComponent, dependencies);
    this._tripInfoController = new TripInfoController(this._tripMainComponent, pointsModel);
    this._newEventButtonController = new NewEventButtonController(this._tripMainComponent, tripEvents);
  }

  render() {
    this._tripInfoController.render();
    this._tripControlsController.render();
    this._newEventButtonController.render();

    render(this._container, this._tripMainComponent, RenderPosition.BEFOREEND);
  }
}
