import CardComponent from "./card.js";
import {createElement, render, RenderPosition} from '../utils/render.js';

export default class CardListComponent {
  constructor(events) {
    this._element = null;
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

  _initInternals() {
    const cards = this._events.map((event) => new CardComponent(event, this));
    cards.forEach((card) =>
      render(this._element, card.getElement(), RenderPosition.BEFOREEND)
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._initInternals();
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  clear() {
    this._element = null;
    this._events = null;
  }
}
