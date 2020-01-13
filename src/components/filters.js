import {capitalize} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

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

const createFiltersTemplate = (filterNames) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      
      ${showFilters(filterNames)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FiltersComponent extends AbstractComponent {
  constructor(filterNames) {
    super();
    this._filterNames = filterNames;
  }

  getTemplate() {
    return createFiltersTemplate(this._filterNames);
  }
}
