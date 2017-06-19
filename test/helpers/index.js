import TestUtils from 'react-dom/test-utils';

export function getContainerBox(renderedComponent) {
  const container = TestUtils.findRenderedDOMComponentWithTag(
    renderedComponent, 'ul'
  );
  return container.getBoundingClientRect();
}

export function getTagPositions(renderedComponent) {
  const outputTags = TestUtils.scryRenderedDOMComponentsWithTag(
    renderedComponent, 'li'
  );

  // returns { a: ClientRect, b: ClientRect, c: ClientRect }
  return ['a', 'b', 'c'].reduce((acc, key) => ({
    ...acc,
    [key]: outputTags.find(el => el.id === key).getBoundingClientRect(),
  }), {});
}
