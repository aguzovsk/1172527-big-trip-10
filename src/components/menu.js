import AbstractComponent from './abstract-component.js';

const createMenuButtonMarkup = (name, isActive, reference = `#`) => {
  const activeClass = isActive ? ` trip-tabs__btn--active` : ``;
  return (
    `<a class="trip-tabs__btn ${activeClass}" href="${reference}">${name}</a>`
  );
};

const showTabs = (names, currentState) =>
  names.map(
    (name) => createMenuButtonMarkup(name, name === currentState)
  ).join(`\n`);

const createMenuTemplate = (names, currentState) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${showTabs(names, currentState)}
    </nav>`
  );
};

export default class MenuComponent extends AbstractComponent {
  constructor(names) {
    super();
    this._names = names;
    this._state = names[0];
  }

  getTemplate() {
    return createMenuTemplate(this._names, this._state);
  }

  setOnChange(handler) {
    const links = this.getElement().querySelectorAll(`a`);
    links.forEach((link) => link.addEventListener(`click`, (evt) => {
      const target = evt.target;
      const name = target.innerText;

      if (this._state === name) {
        return;
      }

      links.forEach((l) => l.classList.remove(`trip-tabs__btn--active`));
      target.classList.add(`trip-tabs__btn--active`);
      this._state = name;
      handler(name);
    }));
  }
}
