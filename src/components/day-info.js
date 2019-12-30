export const createDayInfo = (counter, dayOfYear) => {
  return (
    `<div class="day__info">
      <span class="day__counter">${counter}</span>
      <time class="day__date" datetime="${dayOfYear}">${dayOfYear}</time>
    </div>`
  );
};
