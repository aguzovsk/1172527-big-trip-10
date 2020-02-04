import DayComponent from '../components/day-component';
import {render, RenderPosition} from '../utils/render';
import DefaultContainer from '../components/default-container-component';
import PointController from "./point-controller";

export default class DayController {
  constructor(container, date, index) {
    this._container = container;
    this._dayComponent = new DayComponent(date, index);
    this._pointListComponent = new DefaultContainer(`ul`, `trip-events__list`);
  }

  render(events, dependencies) {
    const pointControllers = events.map((event) =>{
      const controller = new PointController(this._pointListComponent, dependencies);
      controller.render(event);
      return controller;
    });

    render(this._dayComponent, this._pointListComponent, RenderPosition.BEFOREEND);
    render(this._container, this._dayComponent, RenderPosition.BEFOREEND);

    return pointControllers;
  }
}
