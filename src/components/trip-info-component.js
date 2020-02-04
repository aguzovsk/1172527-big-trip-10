import AbstractComponent from './abstract-component';

const createTripInfoTemplate = (totalCost) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
    <!-- Маршрут -->

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>
  </section>`
  );
};

export default class TripInfoComponent extends AbstractComponent {
  constructor(totalCost) {
    super();
    this._totalCost = totalCost;
  }

  getTemplate() {
    return createTripInfoTemplate(this._totalCost);
  }

  updateCost(newTotalCost) {
    if (newTotalCost === this._totalCost) {
      return;
    }

    this._totalCost = newTotalCost;

    const element = this.getElement();
    const costValue = element.querySelector(`.trip-info__cost-value`);
    costValue.innerText = newTotalCost;
  }
}
