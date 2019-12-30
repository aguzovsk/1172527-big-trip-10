import {capitalize} from '../util.js';

const filterTypes = [`everything`, `future`, `past`];

const createFilterMarkup = (type) =>
  `<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" checked>
    <label class="trip-filters__filter-label" for="filter-${type}">${capitalize(type)}</label>
  </div>`;

const showFilters = (types) => types.map(createFilterMarkup).join(`\n`);

export const createFiltersTemplate = () => {
  return (
    `<form class="trip-filters" action="#" method="get">
      
      ${showFilters(filterTypes)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};
