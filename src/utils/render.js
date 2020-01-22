export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

export const render = (containerComponent, element, place) => {
  const container = containerComponent instanceof Element ?
    containerComponent : containerComponent.getElement();
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
  }
};

export const empty = (containerNode) => {
  while (containerNode.firstChild) {
    containerNode.removeChild(containerNode.firstChild);
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const replaceOldToNew = (oldComponent, newComponent) => {
  const oldElement = oldComponent.getElement();
  const newElement = newComponent.getElement();
  const parentElement = oldElement.parentElement;

  const isValid = Boolean(oldElement && newElement && parentElement);
  if (isValid) {
    parentElement.replaceChild(newElement, oldElement);
  }
};
