React Flip Move
=========

[![build status](https://img.shields.io/travis/joshwcomeau/react-flip-move/master.svg?style=flat-square)](https://travis-ci.org/joshwcomeau/react-flip-move)
[![npm version](https://img.shields.io/npm/v/react-flip-move.svg?style=flat-square)](https://www.npmjs.com/package/react-flip-move)

Animations library for React that automagically handles animations when a DOM node gets reordered or moved. Emphasis on smooth, 60+ FPS animations using the FLIP technique.

[![demo](https://s3.amazonaws.com/githubdocs/demo-with-dev-tools.gif)](http://joshwcomeau.github.io/react-flip-move/examples/#/shuffle)



## Demos

  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/shuffle" target="_blank">__List/Grid Shuffle__</a>
  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/square" target="_blank">__Fuscia Square__</a>
  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/scrabble" target="_blank">__Scrabble__</a>
  * __Playground__ (coming soon)



## Installation

```
npm i -S react-flip-move
```

UMD builds are also available, in `/dist`.



## Features

Flip Move was inspired by Ryan Florence's <a href="https://github.com/ryanflorence/react-magic-move" target="_blank">_Magic Move_</a>, and offers:

  * Full compatibility with React 0.14+. Will be maintained.

  * Exclusive use of hardware-accelerated CSS properties (`transform: translate`) instead of positioning properties (`top`, `left`). <a href="https://aerotwist.com/blog/pixels-are-expensive/" target="_blank">_Read why this matters_</a>.

  * Ability to 'humanize' transitions by staggering the delay and/or duration of subsequent elements.

  * Ability to provide `onStart` / `onFinish` callbacks.

  * Implementation based on the [_FLIP technique_](https://github.com/joshwcomeau/react-flip-move/blob/master/docs/how-it-works.md), a beautiful-in-its-simplicity method of tackling this problem.



## Quickstart

The implementation couldn't be simpler. Just wrap the items you'd like to move in a `FlipMove`:

```js
import FlipMove from 'react-flip-move';

class TopArticles extends Component {
  renderTopArticles() {
    return this.props.articles.map( article => <Article {...article} key={article.id} /> );
  }

  render() {
    return (
      <div className="top-articles">
        <FlipMove duration={250} easing="ease-in-out">
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

Curious how this works, under the hood? [__Read the full article__](https://github.com/joshwcomeau/react-flip-move/blob/master/docs/how-it-works.md).



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

      This effect is great for "humanizing" transitions and making them feel less robotic, similar to <code>staggerDurationBy</code>.

      <strong>Protip:</strong> You can make elements animate one at a time by using an identical <code>duration</code> and <code>staggerDelayBy</code>.
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
        <li><code>childElement</code>: A reference to the <a href="https://facebook.github.io/react/blog/2014/10/14/introducing-react-elements.html">React Element</a> being animated.</li>
        <li><code>domNode</code>: A reference to the unadulterated DOM node being animated.</li>
      </ul>

      In general, it is advisable to ignore the <code>domNode</code> argument and work with the <code>childElement</code>. The <code>domNode</code> is just an escape hatch for doing complex things not otherwise possible.
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
      <li><code>childElement</code>: A reference to the <a href="https://facebook.github.io/react/blog/2014/10/14/introducing-react-elements.html">React Element</a> being animated.</li>
      <li><code>domNode</code>: A reference to the unadulterated DOM node being animated.</li>
      </ul>

      In general, it is advisable to ignore the <code>domNode</code> argument and work with the <code>childElement</code>. The <code>domNode</code> is just an escape hatch for doing complex things not otherwise possible.

    </td>
  </tr>
</table>



## Gotchas

  * All children **need a unique `key` property**. Even if FlipMove is only given a single child, it needs to have a unique `key` prop for FlipMove to track it.

  * **Existing transition/transform properties will be overridden.** I am hoping to change this in a future version, but at present, FlipMode does not take into account existing `transition` or `transform` CSS properties on its direct children.

  * Elements whose positions have not changed between states will not be animated. This means that no `onStart` or `onFinish` callbacks will be executed for those elements.



## Contributions

Contributors welcome! Please discuss new features with me ahead of time, and submit PRs for bug fixes with tests.



## License

[MIT](https://github.com/joshwcomeau/flip-move/blob/master/LICENSE.md)
