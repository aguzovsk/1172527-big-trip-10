import {createEmptyElement, createElement} from '../utils/render';

export default class DefaultContainer {
  constructor(htmlElement, className) {
    let element = null;
    if (typeof htmlElement === `string`) {
      if (className) {
        element = createEmptyElement(htmlElement, className);
      } else {
        element = createElement(htmlElement);
      }
    } else if (htmlElement instanceof HTMLElement) {
      element = htmlElement;
    } else {
      throw new Error(`Default container should be initialized with existing HTMLELement,
      or 2 string args: type of Element and css class`);
    }

    this._element = element;
  }

  getElement() {
    return this._element;
  }
}
