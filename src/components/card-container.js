import CardComponent from "./card.js";
import {createElement, render, RenderPosition} from '../util.js';

export default class CardListComponent {
  constructor(list) {
    this._element = null;
    this._cardList = list.map((event) => new CardComponent(event, this));
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
    this._cardList.forEach((card) =>
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
    this._cardList = null;
  }
}
