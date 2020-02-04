import MenuComponent from '../../components/page-header/menu-component';
import {menuNames, MenuItem} from "../../const";
import {render, RenderPosition} from "../../utils/render";

export default class MenuController {
  constructor(container, dependencies) {
    this._container = container;

    const {tripEvents, statistics} = dependencies;

    this._menuComponent = new MenuComponent(menuNames);
    this._menuComponent.setOnChangeEventHandler(
      (menuName) => {
        if (menuName === MenuItem.TABLE) {
          tripEvents.show();
          statistics.hide();
        } else if (menuName === MenuItem.STATS) {
          tripEvents.hide();
          statistics.show();
        } else {
          throw new Error(`Undefined menu type ${menuName}`);
        }
      }
    );
  }

  render() {
    render(this._container, this._menuComponent, RenderPosition.AFTERBEGIN);
  }
}
