import FiltersComponent from "../components/filters";
import {filterNames} from "../const";
import {render, RenderPosition} from "../utils/render";


export default class FiltersController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._filterComponent = new FiltersComponent(filterNames);
    this._filterComponent.setEventHandler(pointsModel.onFilterTypeChange);
    // this._filterComponent.setEventHandlers()
  }

  render() {
    const container = this._container;
    render(container, this._filterComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _filterChangeHandler(filterName) {
    this._pointsModel.setFilterType(filterName);
  }
}
