const nameList = [`Table`, `Stats`];

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

export const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${showTabs(nameList)}
    </nav>`
  );
};
