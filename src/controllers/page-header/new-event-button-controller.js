import DefaultContainer from '../../components/default-container-component';
import {render, RenderPosition} from "../../utils/render";

export default class NewEventButtonController {
  constructor(container, tripEvents) {
    this._container = container;

    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);

    this._button = new DefaultContainer(
      `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
    );

    tripEvents.setNewEventButtonController(this);
  }

  render() {
    render(this._container, this._button, RenderPosition.BEFOREEND);
  }

  enable() {
    const button = this._button.getElement();
    button.disabled = false;
  }

  disable() {
    const button = this._button.getElement();
    button.disabled = true;
  }

  isDisabled() {
    const button = this._button.getElement();
    return button.disabled;
  }

  setOnClickHandler(handler) {
    const button = this._button.getElement();
    button.addEventListener(`click`, () => handler());
  }
}
