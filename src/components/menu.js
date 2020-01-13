import AbstractComponent from './abstract-component.js';

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

export default class MenuComponent extends AbstractComponent {
  constructor(names) {
    super();
    this._names = names;
  }

  getTemplate() {
    return createMenuTemplate(this._names);
  }
}
