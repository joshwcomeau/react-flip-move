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
    let TestObjectComponent;
    let TestClassComponent;

    before( () => {
      // We need a couple components to move about.
      // Let's test both the original reateClass way,
      // as well as the newer ES6 class way.
      // (Sadly, stateless functional components won't work D:)
      TestObjectComponent = React.createClass({
        render() {
          return <li>{this.props.itemNum}</li>;
        }
      });

      TestClassComponent = class testComponent extends Component {
        render() {
          return <li>{this.props.itemNum}</li>;
        }
      };
    });

    it('renders the children components', () => {
      // Quick test to ensure that FlipMove doesn't impede the rendering
      // of whatever children get passed in.
      let children = _.times(3, n => <TestObjectComponent key={n} itemNum={n} />)
      let renderedComponent = TestUtils.renderIntoDocument(
        <FlipMove>
          {children}
        </FlipMove>
      );
    });
  });
});
