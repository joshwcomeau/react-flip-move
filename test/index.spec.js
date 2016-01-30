import _                    from 'lodash';
import chai, { expect }     from 'chai';
import sinon                from 'sinon';
import sinonChai            from 'sinon-chai';
import equalJSX             from 'chai-equal-jsx';

import React, { Component } from 'react';
import TestUtils            from 'react-addons-test-utils';

import FlipMove             from '../src/FlipMove.jsx';

chai.use(sinonChai);
chai.use(equalJSX);

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

  describe('animations', () => {
    let ListItem, ListParent;

    before( () => {
      // To test this, here is our setup:
      // We're making a simple list of news articles, with the ability to
      // change them from sorting ascending vs. descending.
      // Doing so will cause the items to be re-rendered in a different
      // order, and we want the transition to be animated.
      //
      // We need a list item, which just renders its name.
      ListItem = class ListItem extends Component {
        render() {
          return <li>{this.props.name}</li>;
        }
      };
      // We need our list parent, which contains our FlipMove as well as
      // all the list items.
      ListParent = class ListParent extends Component {
        constructor(props) {
          super(props);
          this.state = {
            articles: [
              { name: 'The Dawn of Time', timestamp: 123456 },
              { name: 'A While Back', timestamp: 333333 },
              { name: 'This Just Happened', timestamp: 654321 }
            ]
          }
        }

        renderArticles() {
          return this.state.articles.map( article => (
            <ListItem key={article.timestamp} name={article.name} />
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
    });

    it('renders the children components', () => {
      // Quick test to ensure that FlipMove doesn't impede the rendering
      // of whatever children get passed in.
      let renderedComponent = TestUtils.renderIntoDocument(<ListParent />);

      let outputComponents = TestUtils.scryRenderedComponentsWithType(
        renderedComponent,
        ListItem
      );

      let outputTags = TestUtils.scryRenderedDOMComponentsWithTag(
        renderedComponent,
        'li'
      );

      expect(outputComponents).to.have.length.of(3);
      expect(outputTags).to.have.length.of(3);
    });
  });
});
