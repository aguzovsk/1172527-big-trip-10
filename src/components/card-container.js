import CardComponent from "./card.js";
import {render, RenderPosition} from '../utils/render.js';
import AbstractComponentWithInit from "./abstract-component-with-init.js";

export default class CardListComponent extends AbstractComponentWithInit {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return (
      `<ul class="trip-events__list">
      </ul>`
    );
  }

  replaceCardToEdit(task, edit) {
    this._element.replaceChild(edit.getElement(), task.getElement());
  }

  replaceEditToCard(edit, task) {
    this._element.replaceChild(task.getElement(), edit.getElement());
  }

  _init() {
    const cards = this._events.map((event) => new CardComponent(event, this));
    cards.forEach((card) =>
      render(this._element, card.getElement(), RenderPosition.BEFOREEND)
    );
  }
}
