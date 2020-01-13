import AbstractComponent from './abstract-component.js';

export default class DaysContainer extends AbstractComponent {
  getTemplate() {
    return (
      `<ul class="trip-days">
      </ul>`
    );
  }
}
