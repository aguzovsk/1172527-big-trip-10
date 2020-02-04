import DefaultContainer from "../../components/default-container-component";
import MenuController from "./menu-controller";
import FiltersController from "./filters-controller";
import {render, RenderPosition} from "../../utils/render";

export default class TripControlsController {
  constructor(container, dependencies) {
    this._container = container;
    this._tripControlsComponent = new DefaultContainer(
      `div`, `trip-main__trip-controls  trip-controls`
    );
    this._switchTripViewComponent = new DefaultContainer(
      `<h2 class="visually-hidden">Switch trip view</h2>`
    );
    this._filterEventsComponent = new DefaultContainer(
      `<h2 class="visually-hidden">Filter events</h2>`
    );

    this._menuController = new MenuController(this._tripControlsComponent, dependencies);
    this._filtersController = new FiltersController(this._tripControlsComponent, dependencies);
  }

  render() {
    render(this._tripControlsComponent, this._switchTripViewComponent, RenderPosition.BEFOREEND);
    this._menuController.render();
    render(this._tripControlsComponent, this._switchTripViewComponent, RenderPosition.BEFOREEND);
    this._filtersController.render();

    render(this._container, this._tripControlsComponent, RenderPosition.BEFOREEND);
  }
}
