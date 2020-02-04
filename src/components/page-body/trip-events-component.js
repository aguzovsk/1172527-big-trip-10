import AbstractComponent from "../abstract-component";

export default class TripEventsComponent extends AbstractComponent {
  getTemplate() {
    return (
      `<section class="trip-events">
        <h2 class="visually-hidden">Trip events</h2>
      </section>`
    );
  }
}
