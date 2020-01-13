import {createElement} from '../utils/render.js';

export default class NoCardsComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return (
      `<p class="trip-events__msg">
        Click New Event to create your first point
      </p>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
