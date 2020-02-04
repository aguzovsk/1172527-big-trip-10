export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const createEmptyElement = (tagName, classNames) => {
  const newElement = document.createElement(tagName);
  const classes = classNames.split(` `).filter(Boolean);
  for (const className of classes) {
    newElement.classList.add(className);
  }

  return newElement;
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

export const render = (containerComponent, elementComponent, place) => {
  const container = containerComponent instanceof Element ?
    containerComponent : containerComponent.getElement();
  const element = elementComponent instanceof Element ?
    elementComponent : elementComponent.getElement();

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.insertAdjacentElement(RenderPosition.AFTEREND, element);
      break;
    default:
      throw new Error(`Undefined render position ${place}`);
  }
};

export const empty = (containerNode) => {
  while (containerNode.firstChild) {
    containerNode.removeChild(containerNode.firstChild);
  }
};

export const emptyExceptFirstN = (containerElement, n) => {
  while (containerElement.children.length > n) {
    containerElement.removeChild(containerElement.lastElementChild);
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const replaceOldToNew = (oldComponent, newComponent) => {
  const componentsWereCleared = !oldComponent || !newComponent;
  if (componentsWereCleared) {
    return;
  }

  const oldElement = oldComponent.getElement();
  const newElement = newComponent.getElement();
  const parentElement = oldElement.parentElement;

  const isValid = Boolean(oldElement && newElement && parentElement);
  if (isValid) {
    parentElement.replaceChild(newElement, oldElement);
  }
};
