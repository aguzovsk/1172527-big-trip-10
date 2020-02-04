import AbstractComponent from "./abstract-component";

export default class LoadingComponent extends AbstractComponent {
  getTemplate() {
    return `<p class="trip-events__msg">Loading...</p>`;
  }
}
