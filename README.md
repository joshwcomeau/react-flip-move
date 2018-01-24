React Flip Move
=========

[![build status](https://travis-ci.org/joshwcomeau/react-flip-move.svg?branch=master)](https://travis-ci.org/joshwcomeau/react-flip-move)
[![npm version](https://img.shields.io/npm/v/react-flip-move.svg)](https://www.npmjs.com/package/react-flip-move)
[![npm monthly downloads](https://img.shields.io/npm/dm/react-flip-move.svg)](https://www.npmjs.com/package/react-flip-move)



This module was built to tackle the common but arduous problem of animating a list of items when the list's order changes.

CSS transitions only work for CSS properties. If your list is shuffled, the items have rearranged themselves, but without the use of CSS. The DOM nodes don't know that their on-screen location has changed; they've just been removed and inserted elsewhere in the document.

Flip Move uses the [_FLIP technique_](https://aerotwist.com/blog/flip-your-animations/#the-general-approach) to work out what such a transition would look like, and fakes it using 60+ FPS hardware-accelerated CSS transforms.

[**Read more about how it works**](https://medium.com/developers-writing/animating-the-unanimatable-1346a5aab3cd)

[![demo](https://s3.amazonaws.com/githubdocs/fm-main-demo.gif)](http://joshwcomeau.github.io/react-flip-move/examples/#/shuffle)



## Demos

  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/shuffle" target="_blank">__List/Grid Shuffle__</a>
  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/square" target="_blank">__Fuscia Square__</a>
  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/scrabble" target="_blank">__Scrabble__</a>
  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/laboratory" target="_blank">__Laboratory__</a>



## Installation

```bash
yarn add react-flip-move

# Or, if not using yarn:
npm i -S react-flip-move
```

UMD builds are also available via CDN:
* [react-flip-move.js](https://unpkg.com/react-flip-move/dist/react-flip-move.js)
* [react-flip-move.min.js](https://unpkg.com/react-flip-move/dist/react-flip-move.min.js)


## Features

Flip Move was inspired by Ryan Florence's awesome <a href="https://github.com/ryanflorence/react-magic-move" target="_blank">_Magic Move_</a>, and offers:

  * Exclusive use of hardware-accelerated CSS properties (`transform: translate`) instead of positioning properties (`top`, `left`). <a href="https://aerotwist.com/blog/pixels-are-expensive/" target="_blank">_Read why this matters_</a>.

  * Full support for enter/exit animations, including some spiffy presets, that all leverage hardware-accelerated CSS properties.

  * Ability to 'humanize' transitions by staggering the delay and/or duration of subsequent elements.

  * Ability to provide `onStart` / `onFinish` callbacks.

  * Compatible with [Preact](https://preactjs.com/) (should work with other React-like libraries as well).

  * Tiny! Gzipped size is <5kb! ⚡


## Quickstart

The implementation couldn't be simpler. Just wrap the items you'd like to move in a `FlipMove`, with any [custom options](https://github.com/joshwcomeau/react-flip-move/blob/master/documentation/api_reference.md):

```jsx
import FlipMove from 'react-flip-move';

const TopArticles = ({ articles }) => (
  <FlipMove duration={750} easing="ease-out">
    {articles.map(article => (
      <Article key={article.id} {...article} />
    ))}
  </FlipMove>
);
```


## API Reference

View the [full API reference documentation](https://github.com/joshwcomeau/react-flip-move/blob/master/documentation/api_reference.md)


## Enter/Leave Animations

View the [enter/leave docs](https://github.com/joshwcomeau/react-flip-move/blob/master/documentation/enter_leave_animations.md)


## Compatibility

|           | Chrome | Firefox | Safari |   IE  | Edge | iOS Safari/Chrome | Android Chrome |
|-----------|:------:|:-------:|:------:|:-----:|:----:|:-----------------:|:--------------:|
| Supported |  ✔ 10+ |   ✔ 4+  | ✔ 6.1+ | ✔ 10+ |   ✔  |       ✔ 6.1+      |        ✔       |


## How It Works

Curious how this works, under the hood? [__Read the Medium post__](https://medium.com/@joshuawcomeau/animating-the-unanimatable-1346a5aab3cd).


---

### Wrapping Element

By default, FlipMove wraps the children you pass it in a `<div>`:

```jsx
// JSX
<FlipMove>
  <div key="a">Hello</div>
  <div key="b">World</div>
</FlipMove>

// HTML
<div>
  <div>Hello</div>
  <div>World</div>
</div>
```

Any unrecognized props to `<FlipMove>` will be delegated to this wrapper element:

```jsx
// JSX
<FlipMove className="flip-wrapper" style={{ color: 'red' }}>
  <div key="a">Hello</div>
  <div key="b">World</div>
</FlipMove>

// HTML
<div class="flip-wrapper" style="color: red;">
  <div key="a">Hello</div>
  <div key="b">World</div>
</div>
```

You can supply a different element type with the `typeName` prop:

```jsx
// JSX
<FlipMove typeName="ul">
  <li key="a">Hello</li>
  <li key="b">World</li>
</FlipMove>

// HTML
<ul>
  <li key="a">Hello</li>
  <li key="b">World</li>
</ul>
```

Finally, if you're using React 16 or higher, and Flip Move 2.10 or higher, you can use the new "wrapperless" mode. This takes advantage of a React Fiber feature, which allows us to omit this wrapping element:

```jsx
// JSX
<div className="your-own-element">
  <FlipMove typeName={null}>
    <div key="a">Hello</div>
    <div key="b">World</div>
  </FlipMove>
</div>

// HTML
<div class="your-own-element">
  <div key="a">Hello</div>
  <div key="b">World</div>
</div>
```

Wrapperless mode is nice, because it makes FlipMove more "invisible", and makes it easier to integrate with parent-child CSS properties like flexbox. However, there are some things to note:

- This is a new feature in FlipMove, and isn't as battle-tested as the traditional method. Please test thoroughly before using in production, and report any bugs!
- FlipMove does some positioning magic for enter/exit animations - specifically, it temporarily applies `position: absolute` to its children. For this to work correctly, you'll need to make sure that `<FlipMove>` is within a container that has a non-static position (eg. `position: relative`), and no padding:

```jsx
// BAD - this will cause children to jump to a new position before exiting:
<div style={{ padding: 20 }}>
  <FlipMove typeName={null}>
    <div key="a">Hello world</div>
  </FlipMove>
</div>

// GOOD - a non-static position and a tight-fitting wrapper means children will
// stay in place while exiting:
<div style={{ position: 'relative' }}>
  <FlipMove typeName={null}>
    <div key="a">Hello world</div>
  </FlipMove>
</div>
```

---


## Gotchas

  * Does not work with stateless functional component children. This is because Flip Move uses refs to identify and apply styles to children, and stateless functional components cannot be given refs.

  * All children **need a unique `key` property**. Even if Flip Move is only given a single child, it needs to have a unique `key` prop for Flip Move to track it.

  * FlipMove clones the direct children passed to it and overwrites the `ref` prop. As a result, you won't be able to set a `ref` on the top-most elements passed to FlipMove. An easy workaround is just to wrap the elements you pass to FlipMove in a `<div>`.

  * Elements whose positions have not changed between states will not be animated. This means that no `onStart` or `onFinish` callbacks will be executed for those elements.

  * Sometimes you'll want to update or change an item _without_ triggering a Flip Move animation. For example, with optimistic updating, you may render a temporary version before replacing it with the server-validated one. In this case, simply use the same `key` for both versions, and Flip Move will treat them as the same item.


## Known Issues

  * **Interrupted enter/leave animations can be funky**. This has gotten better recently thanks to our great contributors, but extremely fast adding/removing of items can cause weird visual glitches, or cause state to become inconsistent. Experiment with your usecase!

  * **Existing transition/transform properties will be overridden.** I am hoping to change this in a future version, but at present, Flip Move does not take into account existing `transition` or `transform` CSS properties on its direct children.


## Note on `will-change`

To fully benefit from hardware acceleration, each item being translated should have its own compositing layer. This can be accomplished with the [CSS will-change property](https://dev.opera.com/articles/css-will-change-property/).

Applying `will-change` too willy-nilly, though, can have an adverse effect on mobile browsers, so I have opted to not use it at all.

In my personal experimentations on modern versions of Chrome, Safari, Firefox and IE, this property offers little to no gain (in Chrome's timeline I saw a savings of ~0.5ms on a 24-item shuffle).

YMMV: Feel free to experiment with the property in your CSS. Flip Move will respect the wishes of your stylesheet :)

Further reading: [CSS will-change Property](https://dev.opera.com/articles/css-will-change-property/)



## Contributions

Contributors welcome! Please discuss new features with me ahead of time, and submit PRs for bug fixes with tests (Testing stack is Mocha/Chai/Sinon, tested in-browser by Karma).

There is a shared prepush hook which launches eslint, flow checks, and tests. It sets itself up automatically during `npm install`.


## Development

This project uses [React Storybook](https://github.com/kadirahq/react-storybook) in development. The developer experience is absolutely lovely, and it makes testing new features like enter/leave presets super straightforward.

After installing dependencies, launch the Storybook dev server with `npm run storybook`.

This project adheres to the formatting established by [airbnb's style guide](https://github.com/airbnb/javascript/tree/master/react). When contributing, you can make use of the autoformatter [prettier](https://github.com/prettier/prettier) to apply these rules by running the eslint script `npm run lint:fix`. If there are conflicts, the linter triggered by the prepush hook will inform you of those as well. To check your code by hand, run `npm run lint`.

## Flow support

Flip Move's sources are type-checked with [Flow](https://flow.org/). If your project uses it too, you may want to install typings for our public API from [flow-typed](https://github.com/flowtype/flow-typed) repo.

```bash
npm install --global flow-typed # if not already
flow-typed install react-flip-move@<version>
```

If you're getting some flow errors coming from `node_modules/react-flip-move/src` path, you should add this to your `.flowconfig` file:

```
[ignore]
.*/node_modules/react-flip-move/.*
```


## License

[MIT](https://github.com/joshwcomeau/flip-move/blob/master/LICENSE.md)
