import React, { Component } from 'react';
import ReactDOM             from 'react-dom';
import TestUtils            from 'react-addons-test-utils';

import FlipMove             from '../src/FlipMove';


describe('FlipMove', () => {
  let consoleStub, finishAllStub;

  before(     () => {
    consoleStub   = sinon.stub(console, 'error');
    finishAllStub = sinon.stub();
  });
  afterEach(  () => consoleStub.reset() );
  after(      () => consoleStub.restore() );

  // To test this, here is our setup:
  // We're making a simple list of news articles, with the ability to
  // change them from sorting ascending vs. descending.
  // Doing so will cause the items to be re-rendered in a different
  // order, and we want the transition to be animated.
  const articles = [
    { id: 'a', name: 'The Dawn of Time', timestamp: 123456 },
    { id: 'b', name: 'A While Back', timestamp: 333333 },
    { id: 'c', name: 'This Just Happened', timestamp: 654321 }
  ];

  // We need a list item, the thing we'll be moving about.
  const ListItem = class ListItem extends Component {
    render() {
      return <li id={this.props.id}>{this.props.name}</li>;
    }
  };
  // We need our list parent, which contains our FlipMove as well as
  // all the list items.
  const ListParent = class ListParent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        duration: 500,
        staggerDelayBy: 0,
        staggerDurationBy: 0,
        disableAnimations: false,
        articles
      };
      this.count = 0;
    }

    onFinishHandler(){
      this.count++;
    }
    onStartHandler(){
      this.count--;
    }
    renderArticles() {
      return this.state.articles.map( article => (
        <ListItem key={article.id} id={article.id} name={article.name} />
      ));
    }

    render() {
      return (
        <ul>
          <FlipMove
            duration={this.state.duration}
            staggerDelayBy={this.state.staggerDelayBy}
            staggerDurationBy={this.state.staggerDurationBy}
            disableAnimations={this.state.disableAnimations}
            onStart={::this.onStartHandler}
            onFinish={::this.onFinishHandler}
            onFinishAll={finishAllStub}
          >
            { this.renderArticles() }
          </FlipMove>
        </ul>
      );
    }
  };

  let renderedComponent;

  before( () => {
    renderedComponent = ReactDOM.render(
      <ListParent />,
      document.getElementsByTagName('body')[0]
    );
  });

  it('renders the children components', () => {
    const outputComponents = TestUtils.scryRenderedComponentsWithType(
      renderedComponent, ListItem
    );

    const outputTags = TestUtils.scryRenderedDOMComponentsWithTag(
      renderedComponent, 'li'
    );

    expect(outputComponents).to.have.length.of(3);
    expect(outputTags).to.have.length.of(3);

    // Check that they're rendered in order
    expect(outputComponents[0].props.id).to.equal('a');
    expect(outputComponents[1].props.id).to.equal('b');
    expect(outputComponents[2].props.id).to.equal('c');
  });

  describe('updating state', () => {
    let originalPositions;

    before( () => {
      const outputTags = TestUtils.scryRenderedDOMComponentsWithTag(
        renderedComponent, 'li'
      );

      originalPositions = {
        a: outputTags[0].getBoundingClientRect(),
        b: outputTags[1].getBoundingClientRect(),
        c: outputTags[2].getBoundingClientRect(),
      };

      renderedComponent.setState({ articles: articles.reverse() });

    });

    it('has rearranged the components and DOM nodes', () => {
      const outputComponents = TestUtils.scryRenderedComponentsWithType(
        renderedComponent, ListItem
      );
      const outputTags = TestUtils.scryRenderedDOMComponentsWithTag(
        renderedComponent, 'li'
      );

      expect(outputComponents[0].props.id).to.equal('c');
      expect(outputComponents[1].props.id).to.equal('b');
      expect(outputComponents[2].props.id).to.equal('a');

      expect(outputTags[0].id).to.equal('c');
      expect(outputTags[1].id).to.equal('b');
      expect(outputTags[2].id).to.equal('a');
    });

    it('has not actually moved the elements on-screen', () => {
      // The animation has not started yet.
      // While the DOM nodes might have changed places, their on-screen
      // positions should be consistent with where they started.
      const newPositions = getTagPositions(renderedComponent)

      // Even though, in terms of the DOM, tag C is at the top,
      // its bounding box should still be the lowest
      expect(newPositions).to.deep.equal(originalPositions)
    });

    it('has stacked them all on top of each other after 250ms', (done) => {
      // We know the total duration of the animation is 500ms.
      // Three items are being re-arranged; top and bottom changing places.
      // Therefore, if we wait 250ms, all 3 items should be stacked.
      setTimeout(() => {
        const newPositions = getTagPositions(renderedComponent)

        // B should not move at all
        expect(newPositions.b).to.deep.equal(originalPositions.b);

        // In an ideal world, these three elements would be near-identical
        // in their placement.
        // This works very well on localhost, but travis doesn't run so quick.
        // I'm just going to assume that as long as it's somewhere between
        // initial and final, things are good.
        expect(newPositions.a.top).to.be.greaterThan(originalPositions.a.top);
        expect(newPositions.c.top).to.be.lessThan(originalPositions.c.top);

        done();
      }, 250)
    });

    it('has finished the animation after another 500ms', (done) => {
      // Waiting 500ms, for a total of 750ms. Giving a buffer because
      // Travis is slowwww
      setTimeout(() => {
        const newPositions = getTagPositions(renderedComponent)

        // B should still be in the same place.
        expect(newPositions.b).to.deep.equal(originalPositions.b);

        // A and C should have swapped places.
        expect(newPositions.a).to.deep.equal(originalPositions.c);
        expect(newPositions.c).to.deep.equal(originalPositions.a);

        done();
      }, 500)
    });
  });

  describe('callbacks', () => {
    before(() => {
      finishAllStub.reset();
      renderedComponent.setState({
        articles: articles.reverse()
      });
    });

    it('should fire the onStart handler immediately', () => {
      expect(renderedComponent.count).to.equal(-2);
    });

    it('should fire onFinish after the animation', done => {
      setTimeout(() => {
        expect(renderedComponent.count).to.equal(0);
        done();
      }, 750)
    });

    it('should have fired the onFinishAll stub only once', () => {
      expect(finishAllStub).to.have.been.calledOnce;
      finishAllStub.reset();
    })
  });

  describe('duration propType', () => {
    let originalPositions;

    before( () => {
      const outputTags = TestUtils.scryRenderedDOMComponentsWithTag(
        renderedComponent, 'li'
      );

      originalPositions = {
        a: outputTags[0].getBoundingClientRect(),
        b: outputTags[1].getBoundingClientRect(),
        c: outputTags[2].getBoundingClientRect(),
      };
    });

    it('applies a string that can be converted to an int', () => {
      renderedComponent.setState({ duration: '10' });
      expect(consoleStub).to.not.have.been.called;
    });

    it('applies a bogus string', () => {
      renderedComponent.setState({ duration: 'hi' });
      expect(consoleStub).to.have.been.calledOnce;
    });

    it('applies an array prop and throws', () => {
      renderedComponent.setState({ duration: [10] });
      expect(consoleStub).to.have.been.calledOnce;
    });
  });

  describe('disabling animation', () => {
    let originalPositions;

    before( () => {
      const outputTags = TestUtils.scryRenderedDOMComponentsWithTag(
        renderedComponent, 'li'
      );

      originalPositions = {
        a: outputTags[0].getBoundingClientRect(),
        b: outputTags[1].getBoundingClientRect(),
        c: outputTags[2].getBoundingClientRect(),
      };

      renderedComponent.setState({ disableAnimations: true }, () => {
        renderedComponent.setState({ articles: articles.reverse() });
      });
    });

    after(() => {
      renderedComponent.setState({ disableAnimations: false });
    });

    it('should transition immediately', () => {
      const newPositions = getTagPositions(renderedComponent)

      expect(newPositions.a).to.deep.equal(originalPositions.c);
      expect(newPositions.b).to.deep.equal(originalPositions.b);
      expect(newPositions.c).to.deep.equal(originalPositions.a);
    });

  });
});

function getTagPositions(renderedComponent) {
  const outputTags = TestUtils.scryRenderedDOMComponentsWithTag(
    renderedComponent, 'li'
  );
  const [ tagC, tagB, tagA ] = outputTags;
  return {
    a: tagA.getBoundingClientRect(),
    b: tagB.getBoundingClientRect(),
    c: tagC.getBoundingClientRect()
  }
}
