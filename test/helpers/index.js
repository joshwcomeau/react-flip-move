import TestUtils from 'react-addons-test-utils';

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
  const [tagC, tagB, tagA] = outputTags;
  return {
    a: tagA.getBoundingClientRect(),
    b: tagB.getBoundingClientRect(),
    c: tagC.getBoundingClientRect(),
  };
}
