import FiltersComponent from "../../components/page-header/filters-component";
import {filterNames} from "../../const";
import {render, RenderPosition} from "../../utils/render";

export default class FiltersController {
  constructor(container, {pointsModel}) {
    this._container = container;

    this._filterComponent = new FiltersComponent(filterNames);
    this._filterComponent.setOnChangeEventHandler(pointsModel.onFilterTypeChange);
  }

  render() {
    const container = this._container;
    render(container, this._filterComponent.getElement(), RenderPosition.BEFOREEND);
  }
}
