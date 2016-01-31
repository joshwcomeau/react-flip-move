import chai, { expect }     from 'chai';
import sinon                from 'sinon';
import sinonChai            from 'sinon-chai';

import React, { Component } from 'react';
import ReactDOM             from 'react-dom';
import TestUtils            from 'react-addons-test-utils';

import FlipMove             from '../src/FlipMove';

var jsdom = require('jsdom');

chai.use(sinonChai);

const shallowDOM = TestUtils.createRenderer();


describe('FlipMove', () => {
  describe('propTypes', () => {
    let consoleStub;

    before(     () => consoleStub = sinon.stub(console, 'error') );
    afterEach(  () => consoleStub.reset() );
    after(      () => consoleStub.restore() );

    it('warns & throws when children are not provided', () => {
      // It warns because of the propType failure.
      // It throws because it can't map over children that don't exist.
      expect(shallowDOM.render.bind(null, <FlipMove />)).to.throw();
      expect(consoleStub).to.have.been.calledOnce;
    });
  });

  describe('functionality', () => {
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
        return <li className={this.props.id}>{this.props.name}</li>;
      }
    };
    // We need our list parent, which contains our FlipMove as well as
    // all the list items.
    const ListParent = class ListParent extends Component {
      constructor(props) {
        super(props);
        this.state = { articles };
      }

      renderArticles() {
        return this.state.articles.map( article => (
          <ListItem key={article.id} id={article.id} name={article.name} />
        ));
      }

      render() {
        return (
          <ul>
            <FlipMove>
              { this.renderArticles() }
            </FlipMove>
          </ul>
        );
      }
    };

    let renderedComponent;

    before( () => {
      renderedComponent = TestUtils.renderIntoDocument(<ListParent />);
    });

    it('renders the children components', () => {
      let outputComponents = TestUtils.scryRenderedComponentsWithType(
        renderedComponent, ListItem
      );

      let outputTags = TestUtils.scryRenderedDOMComponentsWithTag(
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
      before( () => {
        renderedComponent.setState({ articles: articles.reverse() });
      });

      it('has rearranged the DOM nodes', () => {
        let outputComponents = TestUtils.scryRenderedComponentsWithType(
          renderedComponent, ListItem
        );
        expect(outputComponents[0].props.id).to.equal('c');
        expect(outputComponents[1].props.id).to.equal('b');
        expect(outputComponents[2].props.id).to.equal('a');
      });
    });

    // TODO: Test the actual animation, handling params, callback...
    // This is unfortunately impossible in jsdom because FlipMove uses
    // the bounding box to determine whether animation is necessary or not.
    // jsdom cannot calculate bounding boxes, and so no animation is ever
    // triggered.
    // PhantomJS is probably the best tool for the job.
  });
});
