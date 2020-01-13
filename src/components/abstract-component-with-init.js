import AbstractComponent from './abstract-component.js';
import {createElement} from '../utils/render.js';

export default class AbstractComponentWithInit extends AbstractComponent {
  constructor() {
    super();
    if (new.target === AbstractComponentWithInit) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
  }

  _init() {
    throw new Error(`Abstract method not implemented: _init()`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._init();
    }

    return this._element;
  }
}
