export function getContainerBox(renderedComponent) {
  const container = renderedComponent.find('ul').getDOMNode();
  return container.getBoundingClientRect();
}

export function getTagPositions(renderedComponent) {
  // returns { a: ClientRect, b: ClientRect, c: ClientRect }
  return ['a', 'b', 'c'].reduce((acc, key) => ({
    ...acc,
    [key]: renderedComponent.find(`li#${key}`).getDOMNode().getBoundingClientRect(),
  }), {});
}
