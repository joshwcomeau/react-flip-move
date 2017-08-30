/* global chai, expect, sinon */
/* eslint-env mocha */
/* eslint-disable react/prop-types, react/no-multi-comp, no-unused-expressions */
import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

import { getContainerBox, getTagPositions } from './helpers';
import FlipMove from '../src/FlipMove';
import {
  defaultPreset,
  disablePreset,
  appearPresets,
} from '../src/enter-leave-presets';

chai.use(chaiEnzyme());

describe('FlipMove', () => {
  let finishAllStub;

  before(() => {
    sinon.stub(window, 'requestAnimationFrame', cb => setTimeout(cb, 0));
    finishAllStub = sinon.stub();
  });
  afterEach(() => {
    finishAllStub.reset();
  });
  after(() => {
    window.requestAnimationFrame.restore();
  });

  // To test this, here is our setup:
  // We're making a simple list of news articles, with the ability to
  // change them from sorting ascending vs. descending.
  // Doing so will cause the items to be re-rendered in a different
  // order, and we want the transition to be animated.
  const articles = [
    { id: 'a', name: 'The Dawn of Time', timestamp: 123456 },
    { id: 'b', name: 'A While Back', timestamp: 333333 },
    { id: 'c', name: 'This Just Happened', timestamp: 654321 },
  ];

  // We need a list item, the thing we'll be moving about.
  // eslint-disable-next-line react/prefer-stateless-function
  const ListItem = class ListItem extends Component {
    render() {
      return <li id={this.props.id}>{this.props.name}</li>;
    }
  };
  // We need our list parent, which contains our FlipMove as well as
  // all the list items.
  const ListParent = class ListParent extends Component {
    static defaultProps = {
      duration: 500,
      staggerDelayBy: 0,
      staggerDurationBy: 0,
      disableAllAnimations: false,
      maintainContainerHeight: false,
      articles,
    };

    constructor(props) {
      super(props);
      this.count = 0;

      this.onStartHandler = this.onStartHandler.bind(this);
      this.onFinishHandler = this.onFinishHandler.bind(this);
    }

    onFinishHandler() {
      this.count += 1;
    }
    onStartHandler() {
      this.count -= 1;
    }
    renderArticles() {
      return this.props.articles.map(article => (
        <ListItem
          key={article ? article.id : null}
          id={article ? article.id : null}
          name={article ? article.name : null}
        />
      ));
    }

    render() {
      return (
        <ul>
          <FlipMove
            duration={this.props.duration}
            staggerDelayBy={this.props.staggerDelayBy}
            staggerDurationBy={this.props.staggerDurationBy}
            disableAllAnimations={this.props.disableAllAnimations}
            maintainContainerHeight={this.props.maintainContainerHeight}
            onStart={this.onStartHandler}
            onFinish={this.onFinishHandler}
            onFinishAll={finishAllStub}
          >
            { this.renderArticles() }
          </FlipMove>
        </ul>
      );
    }
  };

  let attachedWrapper;
  const container = document.createElement('div');
  document.body.appendChild(container);
  function mountAttached(props) {
    attachedWrapper = mount(
      <ListParent {...props} />,
      { attachTo: container }
    );
  }

  afterEach(() => {
    if (attachedWrapper) {
      attachedWrapper.detach();
      attachedWrapper = null;
    }
  });

  it('renders the children components', () => {
    const wrapper = mount(<ListParent />);
    expect(wrapper).to.have.exactly(3).descendants(ListItem);
    expect(wrapper).to.have.exactly(3).descendants('li');

    const outputComponents = wrapper.find(ListItem);

    // Check that they're rendered in order
    expect(outputComponents.at(0)).to.have.id('a');
    expect(outputComponents.at(1)).to.have.id('b');
    expect(outputComponents.at(2)).to.have.id('c');
  });

  describe('updating state', () => {
    let originalPositions;

    beforeEach(() => {
      mountAttached();
      originalPositions = getTagPositions(attachedWrapper);

      attachedWrapper.setProps({ articles: articles.reverse() });
    });

    it('rearranges the components and DOM nodes', () => {
      const outputComponents = attachedWrapper.find(ListItem);
      const outputTags = attachedWrapper.find('li');

      expect(outputComponents.at(0)).to.have.id('c');
      expect(outputComponents.at(1)).to.have.id('b');
      expect(outputComponents.at(2)).to.have.id('a');

      expect(outputTags.at(0)).to.have.id('c');
      expect(outputTags.at(1)).to.have.id('b');
      expect(outputTags.at(2)).to.have.id('a');
    });

    it('doesn\'t actually move the elements on-screen synchronously', () => {
      // The animation has not started yet.
      // While the DOM nodes might have changed places, their on-screen
      // positions should be consistent with where they started.
      const newPositions = getTagPositions(attachedWrapper);

      // Even though, in terms of the DOM, tag C is at the top,
      // its bounding box should still be the lowest
      expect(newPositions).to.deep.equal(originalPositions);
    });

    it('stacks all the elements on top of each other after 250ms', (done) => {
      // We know the total duration of the animation is 500ms.
      // Three items are being re-arranged; top and bottom changing places.
      // Therefore, if we wait 250ms, all 3 items should be stacked.
      setTimeout(() => {
        const newPositions = getTagPositions(attachedWrapper);
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
      }, 250);
    });

    it('finishes the animation after 750ms', (done) => {
      // Waiting 750ms. Giving a buffer because
      // Travis is slowwww
      setTimeout(() => {
        const newPositions = getTagPositions(attachedWrapper);

        // B should still be in the same place.
        expect(newPositions.b).to.deep.equal(originalPositions.b);

        // A and C should have swapped places.
        expect(newPositions.a).to.deep.equal(originalPositions.c);
        expect(newPositions.c).to.deep.equal(originalPositions.a);

        done();
      }, 750);
    });
  });

  describe('callbacks', () => {
    beforeEach(() => {
      mountAttached();
      attachedWrapper.setProps({
        articles: [...articles].reverse(),
      });
    });

    it('should fire the onStart handler immediately', () => {
      expect(attachedWrapper.instance().count).to.equal(-2);
    });

    it('should fire onFinish after the animation', (done) => {
      setTimeout(() => {
        expect(attachedWrapper.instance().count).to.equal(0);
        done();
      }, 750);
    });

    it('should fire the onFinishAll stub only once', (done) => {
      setTimeout(() => {
        expect(finishAllStub).to.have.been.calledOnce;
        done();
      }, 750);
    });
  });

  describe('prop runtime checking and conversion', () => {
    let errorStub;
    let warnStub;
    let env;
    const SFC = () => null;

    before(() => {
      errorStub = sinon.stub(console, 'error');
      warnStub = sinon.stub(console, 'warn');
      env = process.env;
    });
    afterEach(() => {
      errorStub.reset();
      warnStub.reset();
      process.env = env;
    });
    after(() => {
      errorStub.restore();
      warnStub.restore();
    });

    it('doesn\'t run checks in production environment', () => {
      process.env = { NODE_ENV: 'production' };

      shallow(<FlipMove><SFC key="hi" /></FlipMove>);
      shallow(<FlipMove>hi</FlipMove>);
      shallow(<FlipMove disableAnimations />);
      shallow(<FlipMove duration="hi" />);
      shallow(<FlipMove appearAnimation="unknown" />);

      expect(errorStub).to.not.have.been.called;
      expect(warnStub).to.not.have.been.called;
    });

    describe('timing props', () => {
      it('applies a bogus string', () => {
        shallow(<FlipMove duration="hi" />);
        expect(errorStub).to.have.been.calledWith(`
>> Error, via react-flip-move <<

The prop you provided for 'duration' is invalid. It needs to be a positive integer, or a string that can be resolved to a number. The value you provided is 'hi'.

As a result,  the default value for this parameter will be used, which is '350'.
`);
      });

      it('applies an array prop and throws', () => {
        shallow(<FlipMove duration={['hi']} />);
        expect(errorStub).to.have.been.calledWith(`
>> Error, via react-flip-move <<

The prop you provided for 'duration' is invalid. It needs to be a positive integer, or a string that can be resolved to a number. The value you provided is 'hi'.

As a result,  the default value for this parameter will be used, which is '350'.
`);
      });

      it('applies a string that can be converted to an int', () => {
        shallow(<FlipMove duration="10" />);
        expect(errorStub).to.not.have.been.called;
      });
    });

    describe('unsupported children', () => {
      it('doesn\'t warn about SFC without key', () => {
        shallow(<FlipMove><SFC /></FlipMove>);
        expect(warnStub).to.not.have.been.called;
      });

      it('warns once about SFC with key', () => {
        shallow(
          <FlipMove>
            <SFC key="foo" />
            <SFC key="bar" />
          </FlipMove>
        );
        expect(warnStub).to.have.been.calledOnce;
        expect(warnStub).to.have.been.calledWith(`
>> Error, via react-flip-move <<

You provided a stateless functional component as a child to <FlipMove>. Unfortunately, SFCs aren't supported, because Flip Move needs access to the backing instances via refs, and SFCs don't have a public instance that holds that info.

Please wrap your components in a native element (eg. <div>), or a non-functional component.
`);
      });

      it('warns once about plain text children', () => {
        shallow(
          <FlipMove>
            hi
            <div key="foo" />
            hi
          </FlipMove>
        );
        expect(warnStub).to.have.been.calledOnce;
        expect(warnStub).to.have.been.calledWith(`
>> Error, via react-flip-move <<

You provided a plain text node as a child to <FlipMove>. Flip Move needs containers with unique keys to move children around.

Please wrap your text in a native element (eg. <span>), or a component.
`);
      });

      it('doesn\'t warn when key is present', () => {
        shallow(<FlipMove><div key="hi" /></FlipMove>);
        expect(warnStub).to.not.have.been.called;
      });
    });

    describe('falsy children', () => {
      beforeEach(() => {
        mountAttached();
        attachedWrapper.setProps({ articles: [null, ...articles.slice(1)] });
      });

      it('adds a falsy child to the articles', () => {
        expect(errorStub).to.not.have.been.called;
      });

      it('transitions without issue', (done) => {
        setTimeout(() => {
          expect(errorStub).to.not.have.been.called;
          done();
        }, 750);
      });
    });

    it('warns once about deprecated disableAnimations prop', () => {
      shallow(<FlipMove disableAnimations />);
      const wrapper = shallow(<FlipMove disableAnimations />);
      expect(warnStub).to.have.been.calledOnce;
      expect(warnStub).to.have.been.calledWith(`
>> Warning, via react-flip-move <<

The 'disableAnimations' prop you provided is deprecated. Please switch to use 'disableAllAnimations'.

This will become a silent error in future versions of react-flip-move.
`);
      expect(wrapper).to.have.prop('disableAllAnimations', true);
    });

    describe('animation props', () => {
      it('accepts animation object', () => {
        const wrapper = shallow(
          <FlipMove
            appearAnimation={{
              from: { opacity: '0' },
              to: { opacity: '0.5' },
            }}
          />
        );
        expect(errorStub).to.not.have.been.called;
        expect(wrapper.prop('appearAnimation')).to.deep.equal({
          from: { opacity: '0' },
          to: { opacity: '0.5' },
        });
      });

      it('uses default preset when value is `true`', () => {
        const wrapper = shallow(<FlipMove appearAnimation />);
        expect(errorStub).to.not.have.been.called;
        expect(wrapper.prop('appearAnimation')).to.deep.equal(appearPresets[defaultPreset]);
      });

      it('uses empty preset when value is `false`', () => {
        const wrapper = shallow(<FlipMove appearAnimation={false} />);
        expect(errorStub).to.not.have.been.called;
        expect(wrapper.prop('appearAnimation')).to.deep.equal(appearPresets[disablePreset]);
      });

      it('finds a preset by name', () => {
        const wrapper = shallow(<FlipMove appearAnimation="fade" />);
        expect(errorStub).to.not.have.been.called;
        expect(wrapper.prop('appearAnimation')).to.deep.equal(appearPresets.fade);
      });

      it('throws on an unknown preset', () => {
        const wrapper = shallow(<FlipMove appearAnimation="unknown" />);
        expect(errorStub).to.have.been.calledWith(`
>> Error, via react-flip-move <<

The enter/leave preset you provided is invalid. We don't currently have a 'unknown preset.'

Acceptable values are elevator, fade, accordionVertical, accordionHorizontal, none. The default value of 'elevator' will be used.
`);
        expect(wrapper.prop('appearAnimation')).to.deep.equal(appearPresets[defaultPreset]);
      });
    });
  });

  describe('disabling animation', () => {
    let originalPositions;

    beforeEach(() => {
      mountAttached({ disableAllAnimations: true });

      originalPositions = getTagPositions(attachedWrapper);

      attachedWrapper.setProps({ articles: [...articles].reverse() });
    });

    it('should transition immediately', () => {
      const newPositions = getTagPositions(attachedWrapper);

      expect(newPositions.a).to.deep.equal(originalPositions.c);
      expect(newPositions.b).to.deep.equal(originalPositions.b);
      expect(newPositions.c).to.deep.equal(originalPositions.a);
    });
  });

  describe('container height', () => {
    let containerBox = null;

    beforeEach(() => {
      mountAttached({ maintainContainerHeight: true });
      containerBox = getContainerBox(attachedWrapper);

      attachedWrapper.setProps({ articles: articles.slice(-1) });
    });

    it('should be maintained', () => {
      expect(containerBox.height).to.equal(getContainerBox(attachedWrapper).height);
    });
  });
});
