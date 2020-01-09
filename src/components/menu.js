import {createElement} from '../util.js';

const createMenuButtonMarkup = (name, isActive, reference = `#`) => {
  const activeClass = isActive ? ` trip-tabs__btn--active` : ``;
  return (
    `<a class="trip-tabs__btn ${activeClass}" href="${reference}">${name}</a>`
  );
};

const showTabs = (names) =>
  names.map(
    (name, idx) => createMenuButtonMarkup(name, idx === 0)
  ).join(`\n`);

const createMenuTemplate = (names) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${showTabs(names)}
    </nav>`
  );
};

export default class MenuComponent {
  constructor(names) {
    this._names = names;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._names);
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

  clear() {
    this._names = null;
    this._element = null;
  }
}
