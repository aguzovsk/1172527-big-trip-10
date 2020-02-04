import {createElement} from '../utils/render';

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._element = null;
    this._isVisible = true;
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
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

  show() {
    this._isVisible = true;
    if (!this._element) {
      return;
    }
    const element = this._element;
    element.classList.remove(`visually-hidden`);
  }

  hide() {
    this._isVisible = false;
    if (!this._element) {
      return;
    }
    const element = this._element;
    element.classList.add(`visually-hidden`);
  }
}
