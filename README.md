React Flip Move
=========

[![build status](https://travis-ci.org/joshwcomeau/react-flip-move.svg?branch=master)](https://travis-ci.org/joshwcomeau/react-flip-move)
[![npm version](https://img.shields.io/npm/v/react-flip-move.svg)](https://www.npmjs.com/package/react-flip-move)
[![npm monthly downloads](https://img.shields.io/npm/dm/react-flip-move.svg)](https://www.npmjs.com/package/react-flip-move)



This module was built to tackle the common but arduous problem of animating a list of items when the list's order changes.

DOM nodes can't actually reorder themselves; brand new nodes are created instead. Because of this, simple CSS transitions don't work.

Flip Move uses the [_FLIP technique_](https://aerotwist.com/blog/flip-your-animations/#the-general-approach) to work out what such a transition would look like, and fakes it using 60+ FPS hardware-accelerated CSS transforms.

[![demo](https://s3.amazonaws.com/githubdocs/fm-main-demo.gif)](http://joshwcomeau.github.io/react-flip-move/examples/#/shuffle)



## Demos

  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/shuffle" target="_blank">__List/Grid Shuffle__</a>
  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/square" target="_blank">__Fuscia Square__</a>
  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/scrabble" target="_blank">__Scrabble__</a>
  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/laboratory" target="_blank">__Laboratory__</a>



## Version 2.0

This release's big feature is **Enter/Leave Animations**. It's been requested a ton, and I'm happy with how it's come out.

For more information on its implementation, see the documentation below.

#### Breaking Changes

* Items entering or leaving will now have an animation applied to them (the default is a preset called `elevator`, a combination of fading and scaling). If you want to retain the original behaviour, set `enterAnimation` and `leaveAnimation` to `false`, in the <FlipMove> props.

* Renamed `disableAnimations` to `disableAllAnimations`, since there are now multiple animation types and this boolean disables them all.



## Installation

```
npm i -S react-flip-move
```

UMD builds are also available, in `/dist`.



## Features

Flip Move was inspired by Ryan Florence's awesome <a href="https://github.com/ryanflorence/react-magic-move" target="_blank">_Magic Move_</a>, and offers:

  * Full compatibility with React 0.13, 0.14, and 15-rc2. Will be maintained.

  * Exclusive use of hardware-accelerated CSS properties (`transform: translate`) instead of positioning properties (`top`, `left`). <a href="https://aerotwist.com/blog/pixels-are-expensive/" target="_blank">_Read why this matters_</a>.

  * Full support for enter/exit animations, including some spiffy presets, that all leverage hardware-accelerated CSS properties.

  * Ability to 'humanize' transitions by staggering the delay and/or duration of subsequent elements.

  * Ability to provide `onStart` / `onFinish` callbacks.

  * Implementation based on the [_FLIP technique_](https://medium.com/developers-writing/animating-the-unanimatable-1346a5aab3cd), a beautiful-in-its-simplicity method of tackling this problem. UMD build, when minified and gzipped, is only 4kb! ⚡



## Quickstart

The implementation couldn't be simpler. Just wrap the items you'd like to move in a `FlipMove`, with any [custom options](https://github.com/joshwcomeau/react-flip-move#options):

```js
import FlipMove from 'react-flip-move';

class TopArticles extends Component {
  renderTopArticles() {
    return this.props.articles.map( article => <Article {...article} key={article.id} /> );
  }

  render() {
    return (
      <div className="top-articles">
        <FlipMove easing="cubic-bezier(0, 0.7, 0.8, 0.1)">
          { this.renderTopArticles() }
        </FlipMove>
      </div>
    );
  }
}
```



## Compatibility

|           | Chrome | Firefox | Safari |   IE  | Edge | iOS Safari/Chrome | Android Chrome |
|-----------|:------:|:-------:|:------:|:-----:|:----:|:-----------------:|:--------------:|
| Supported |  ✔ 10+ |   ✔ 4+  | ✔ 6.1+ | ✔ 10+ |   ✔  |       ✔ 6.1+      |        ✔       |



## How It Works

Curious how this works, under the hood? [__Read the Medium post__](https://medium.com/@joshuawcomeau/animating-the-unanimatable-1346a5aab3cd).



## Enter/Leave Animations

v2.0 introduces Enter/Leave animations. For convenience, several presets are provided:


#### Elevator (default)

![Elevator](https://s3.amazonaws.com/githubdocs/fm-elevator.gif)

```js
<FlipMove enterAnimation="elevator" leaveAnimation="elevator" />
```

#### Fade

![Fade](https://s3.amazonaws.com/githubdocs/fm-fade.gif)

```js
<FlipMove enterAnimation="fade" leaveAnimation="fade" />
```

#### Accordion (Vertical)

![Accordion (Vertical)](https://s3.amazonaws.com/githubdocs/fm-accordian-vertical.gif)

```js
<FlipMove enterAnimation="accordionVertical" leaveAnimation="accordionVertical" />
```

#### Accordion (Horizontal)

![Accordion (Horizontal)](https://s3.amazonaws.com/githubdocs/fm-accordian-horizontal.gif)

```js
<FlipMove enterAnimation="accordionHorizontal" leaveAnimation="accordionHorizontal" />
```

#### Custom

You can supply your own CSS-based transitions to customize the behaviour. Both `enterAnimation` and `leaveAnimation` take an object with `from` and `to` properties. You can then provide any valid CSS properties to this object, although for performance reasons it is recommended that you stick to `transform` and `opacity`.

![Custom](https://s3.amazonaws.com/githubdocs/fm-custom-rotate-x.gif)

```js
<FlipMove
  staggerDelayBy={50}
  enterAnimation={{
    from: {
      transform: 'rotateX(135deg)'
    },
    to: {
      transform: ''
    }
  }}
  leaveAnimation={{
    from: {
      transform: ''
    },
    to: {
      transform: 'rotateX(-120deg)',
      opacity: 0.6
    }
  }}
/>
```


## Options

<table>
  <tr>
    <th valign="bottom">Option</th>
    <th valign="bottom">Accepted<br>Type(s)</th>
    <th valign="bottom">Default</th>
    <th valign="bottom">Details</th>
  </tr>
  <tr>
    <td valign="top"><code>children</code></td>
    <td valign="top">
      <code>Array</code>
      <code>Object</code>
    </td>
    <td valign="top"></td>
    <td valign="top">
      The children passed to FlipMove are the component(s) or DOM element(s) that will be moved about. Accepts either a single child (as long as it has a unique <code>key</code> property) or an array of children.
    </td>
  </tr>
  <tr>
    <td valign="top"><code>duration</code></td>
    <td valign="top">
      <code>Integer</code>
      <code>String</code>
    </td>
    <td valign="top">350</td>
    <td valign="top">The length, in milliseconds, that the transition ought to take.</td>
  </tr>
  <tr>
    <td valign="top"><code>easing</code></td>
    <td valign="top"><code>String</code></td>
    <td valign="top">"ease-in-out"</td>
    <td valign="top">Any valid CSS3 timing function (eg. "linear", "ease-in", "cubic-bezier(1, 0, 0, 1)").</td>
  </tr>
  <tr>
    <td valign="top"><code>delay</code></td>
    <td valign="top">
      <code>Integer</code>
      <code>String</code>
    </td>
    <td valign="top">0</td>
    <td valign="top">The length, in milliseconds, to wait before the animation begins.</td>
  </tr>
  <tr>
    <td valign="top"><code>staggerDurationBy</code></td>
    <td valign="top">
      <code>Integer</code>
      <code>String</code>
    </td>
    <td valign="top">0</td>
    <td valign="top">
      The length, in milliseconds, to be added to the duration of each subsequent element.
      <br><br>
      For example, if you are animating 4 elements with a <code>duration</code> of 200 and a <code>staggerDurationBy</code> of 20:
      <br>
      <ul>
        <li>The first element will take 200ms to transition.</li>
        <li>The second element will take 220ms to transition.</li>
        <li>The third element will take 240ms to transition.</li>
        <li>The fourth element will take 260ms to transition.</li>
      </ul>

      This effect is great for "humanizing" transitions and making them feel less robotic.
    </td>
  </tr>
  <tr>
    <td valign="top"><code>staggerDelayBy</code></td>
    <td valign="top">
      <code>Integer</code>
      <code>String</code>
    </td>
    <td valign="top">0</td>
    <td valign="top">
      The length, in milliseconds, to be added to the delay of each subsequent element.
      <br><br>
      For example, if you are animating 4 elements with a <code>delay</code> of 0 and a <code>staggerDelayBy</code> of 20:
      <br>
      <ul>
        <li>The first element will start transitioning immediately.</li>
        <li>The second element will start transitioning after 20ms.</li>
        <li>The third element will start transitioning after 40ms.</li>
        <li>The fourth element will start transitioning after 60ms.</li>
      </ul>

      Similarly to <code>staggerDurationBy</code>, This effect is great for "humanizing" transitions and making them feel less robotic.
      <br><br>
      <strong>Protip:</strong> You can make elements animate one at a time by using an identical <code>duration</code> and <code>staggerDelayBy</code>.
    </td>
  </tr>
  <tr>
    <td valign="top"><code>enterAnimation</code></td>
    <td valign="top">
      <code>String</code>
      <code>Boolean</code>
      <code>Object</code>
    </td>
    <td valign="top">'elevator'</td>
    <td valign="top">
      Control the onEnter animation that runs when new items are added to the DOM.
      <br><br>
      For examples of this property, see the <strong><a href="https://github.com/joshwcomeau/react-flip-move#enterleave-animations">feature description above</a></strong>

      <br><br>
      Accepts several types:
      <br><br>

      <ul>
        <li>
          <strong>String: </strong> You can enter one of the following presets to select that as your enter animation:
          <ul>
            <li><code>elevator</code> (default)</li>
            <li><code>fade</code></li>
            <li><code>accordionVertical</code></li>
            <li><code>accordionHorizontal</code></li>
            <li><code>none</code></li>
          </ul>

          <br><a href="https://github.com/joshwcomeau/react-flip-move/blob/master/src/enter-leave-presets.js">View the CSS implementation of these presets.</a>
          <br><br>
        </li>
        <li>
          <strong>Boolean: </strong> You can enter <code>false</code> to disable the enter animation, or <code>true</code> to select the default enter animation (<code>elevator</code>).
          <br><br>
        </li>
        <li>
          <strong>Object: </strong> For fully granular control, you can pass in an object that contains the styles you'd like to animate.
          <br><br>
          It requires two keys: <code>from</code> and <code>to</code>. Each key holds an object of CSS properties. You can supply any valid camelCase CSS properties, and flip-move will transition between the two, over the course of the specified <code>duration</code>.
          <br><br>
          It is recommended that you stick to hardware-accelerated CSS properties for optimal performance: <code>transform</code> and <code>opacity</code>.
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td valign="top"><code>leaveAnimation</code></td>
    <td valign="top">
      <code>String</code>
      <code>Boolean</code>
      <code>Object</code>
    </td>
    <td valign="top">'elevator'</td>
    <td valign="top">
      Control the onLeave animation that runs when items are removed from the DOM.
      <br><br>
      For examples of this property, see the <strong><a href="https://github.com/joshwcomeau/react-flip-move#enterleave-animations">feature description above</a></strong>
      <br><br>
      Accepts several types:
      <br><br>
      <ul>
        <li>
          <strong>String: </strong> You can enter one of the following presets to select that as your leave animation:
          <ul>
            <li><code>elevator</code> (default)</li>
            <li><code>fade</code></li>
            <li><code>accordionVertical</code></li>
            <li><code>accordionHorizontal</code></li>
            <li><code>none</code></li>
          </ul>

          <br><a href="https://github.com/joshwcomeau/react-flip-move/blob/master/src/enter-leave-presets.js">View the CSS implementation of these presets.</a>
          <br><br>
        </li>
        <li>
          <strong>Boolean: </strong> You can enter <code>false</code> to disable the leave animation, or <code>true</code> to select the default leave animation (<code>elevator</code>).
          <br>
        </li>
        <li>
          <strong>Object: </strong> For fully granular control, you can pass in an object that contains the styles you'd like to animate.
          <br><br>
          It requires two keys: <code>from</code> and <code>to</code>. Each key holds an object of CSS properties. You can supply any valid camelCase CSS properties, and flip-move will transition between the two, over the course of the specified <code>duration</code>.
          <br><br>
          It is recommended that you stick to hardware-accelerated CSS properties for optimal performance: <code>transform</code> and <code>opacity</code>.
        </li>
      </ul>
    </td>
  </tr>  
  <tr>
    <td valign="top"><code>onStart</code></td>
    <td valign="top"><code>Function</code></td>
    <td valign="top"></td>
    <td valign="top">
      A callback to be invoked <strong>once per child element</strong> at the start of the animation.
      <br><br>
      The callback is invoked with two arguments:

      <ul>
        <li><code>childElement</code>: A reference to the React Element being animated.</li>
        <li><code>domNode</code>: A reference to the unadulterated DOM node being animated.</li>
      </ul>

      In general, it is advisable to ignore the <code>domNode</code> argument and work with the <code>childElement</code>.
      The <code>domNode</code> is just an escape hatch for doing complex things not otherwise possible.
    </td>
  </tr>
  <tr>
    <td valign="top"><code>onFinish</code></td>
    <td valign="top"><code>Function</code></td>
    <td valign="top"></td>
    <td valign="top">
      A callback to be invoked <strong>once per child element</strong> at the end of the animation.
      <br><br>
      The callback is invoked with two arguments:

      <ul>
      <li><code>childElement</code>: A reference to the React Element being animated.</li>
      <li><code>domNode</code>: A reference to the unadulterated DOM node being animated.</li>
      </ul>

      In general, it is advisable to ignore the <code>domNode</code> argument and work with the <code>childElement</code>.
      The <code>domNode</code> is just an escape hatch for doing complex things not otherwise possible.

    </td>
  </tr>
  <tr>
    <td valign="top"><code>onFinishAll</code></td>
    <td valign="top"><code>Function</code></td>
    <td valign="top"></td>
    <td valign="top">
      A callback to be invoked <strong>once per group</strong> at the end of the animation.
      <br><br>
      The callback is invoked with two arguments:

      <ul>
      <li><code>childElements</code>: An array of the references to the React Element(s) being animated.</li>
      <li><code>domNodes</code>: An array of the references to the unadulterated DOM node(s) being animated.</li>
      </ul>

      These arguments are similar to the ones provided for <code>onFinish</code>, except we provide an <i>array</i> of the elements and nodes. The order of both arguments is guaranteed; this means you can use a zipping function like <a href="https://lodash.com/docs#zip">lodash's .zip</a> to get pairs of element/node, if needed.

      In general, it is advisable to ignore the <code>domNodes</code> argument and work with the <code>childElements</code>.
      The <code>domNodes</code> are just an escape hatch for doing complex things not otherwise possible.

    </td>
  </tr>
  <tr>
    <td valign="top"><code>disableAnimations</code></td>
    <td valign="top"><code>Boolean</code></td>
    <td valign="top">false</td>
    <td valign="top">
      Sometimes, you may wish to temporarily disable the animations and have the normal behaviour resumed. Setting this flag to <code>true</code> skips all animations.
    </td>
  </tr>

</table>



## Gotchas

  * Does not work with stateless functional component children. This is because Flip Move uses refs to identify and apply styles to children, and stateless functional components cannot be given refs.

  * All children **need a unique `key` property**. Even if Flip Move is only given a single child, it needs to have a unique `key` prop for Flip Move to track it.

  * **Existing transition/transform properties will be overridden.** I am hoping to change this in a future version, but at present, Flip Move does not take into account existing `transition` or `transform` CSS properties on its direct children.

  * Elements whose positions have not changed between states will not be animated. This means that no `onStart` or `onFinish` callbacks will be executed for those elements.


## Changelog

See the [GitHub releases](https://github.com/joshwcomeau/react-flip-move/releases) for version changes.



## Note on 3D transforms and `will-change`

Many articles I've seen claim that in order to force browsers to use hardware acceleration, you need to resort to hacky fixes like `transformZ(0)` or use the new `will-change` property.

In my personal experimentations on modern versions of Chrome, Safari, Firefox and IE, these properties offer little to no gain (in Chrome's timeline I saw a savings of ~0.5ms on a 24-item shuffle).

Applying `will-change` too willy-nilly can have an adverse effect on mobile browsers, so I have opted to not use it at all.

YMMV: Feel free to experiment with the property in your CSS. Flip Move will respect the wishes of your stylesheet :)

Further reading: [CSS will-change Property](https://dev.opera.com/articles/css-will-change-property/)



## Contributions

Contributors welcome! Please discuss new features with me ahead of time, and submit PRs for bug fixes with tests (Testing stack is Mocha/Chai/Sinon, tested in-browser by Karma).


## Development

This project uses [React Storybook](https://github.com/kadirahq/react-storybook) in development. The developer experience is absolutely lovely, and it makes testing new features like enter/leave presets super straightforward.

After installing dependencies, launch the Storybook dev server with `npm run storybook`.



## License

[MIT](https://github.com/joshwcomeau/flip-move/blob/master/LICENSE.md)
