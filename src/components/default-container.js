export default class DefaultContainer {
  constructor(htmlElement) {
    if (!(htmlElement instanceof HTMLElement)) {
      throw new Error(`Default container should be initialized with existing HTMLELement.`);
    }

    this._element = htmlElement;
  }

  getElement() {
    return this._element;
  }
}
