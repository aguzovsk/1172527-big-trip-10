import {capitalize} from '../util.js';
import {createElement} from '../util.js';

const filterTypes = [`everything`, `future`, `past`];

const createFilterMarkup = (type, isActive) => {
  const checked = isActive ? ` checked` : ``;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${checked}>
      <label class="trip-filters__filter-label" for="filter-${type}">${capitalize(type)}</label>
    </div>`
  );
};

const showFilters = (types) =>
  types.map((type, it) => createFilterMarkup(type, it === 0)).join(`\n`);

const createFiltersTemplate = () => {
  return (
    `<form class="trip-filters" action="#" method="get">
      
      ${showFilters(filterTypes)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FiltersComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFiltersTemplate();
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
