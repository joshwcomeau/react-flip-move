React Flip Move
=========

[![build status](https://travis-ci.org/joshwcomeau/react-flip-move.svg?branch=master)](https://travis-ci.org/joshwcomeau/react-flip-move)
[![npm version](https://img.shields.io/npm/v/react-flip-move.svg)](https://www.npmjs.com/package/react-flip-move)
[![npm monthly downloads](https://img.shields.io/npm/dm/react-flip-move.svg)](https://www.npmjs.com/package/react-flip-move)



This module was built to tackle the common but arduous problem of animating a list of items when the list's order changes.

CSS transitions only work for CSS properties. If your list is shuffled, the items have rearranged themselves, but without the use of CSS. The DOM nodes don't know that their on-screen location has changed; they've just been removed and inserted elsewhere in the document.

Flip Move uses the [_FLIP technique_](https://aerotwist.com/blog/flip-your-animations/#the-general-approach) to work out what such a transition would look like, and fakes it using 60+ FPS hardware-accelerated CSS transforms.

[![demo](https://s3.amazonaws.com/githubdocs/fm-main-demo.gif)](http://joshwcomeau.github.io/react-flip-move/examples/#/shuffle)



## Demos

  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/shuffle" target="_blank">__List/Grid Shuffle__</a>
  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/square" target="_blank">__Fuscia Square__</a>
  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/scrabble" target="_blank">__Scrabble__</a>
  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/laboratory" target="_blank">__Laboratory__</a>

## Table of Contents

* [Installation](#installation)
* [Features](#features)
* [Quickstart](#quickstart)
* [Compatibility](#compatibility)
* [Enter/Leave Animations](https://github.com/joshwcomeau/react-flip-move/blob/master/documentation/enter_leave_animations.md)
* [API Reference](https://github.com/joshwcomeau/react-flip-move/blob/master/documentation/api_reference.md)
* [Gotchas](#gotchas)
* [Known Issues](#known-issues)
* [Contributions](#contributions)
* [Development](#development)
* [Flow support](#flow-support)
* [License](#license)



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

  * Implementation based on the [_FLIP technique_](https://medium.com/developers-writing/animating-the-unanimatable-1346a5aab3cd), a beautiful-in-its-simplicity method of tackling this problem. UMD build, when minified and gzipped, is under 6kb! ⚡



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

### HTML Attributes

FlipMove creates its own DOM node to wrap the children it needs to animate. Sometimes, you'll want to be able to pass specific HTML attributes to this node.

All props other than the ones listed above will be delegated to this new node, so you can apply them directly to FlipMove. For example:

```html
<div>
  <FlipMove typeName="ul" className="row" style={{ backgroundColor: 'red' }}>
    <li className="col">Column 1</li>
    <li className="col">Column 2</li>
  </FlipMove>
</div>
```

FlipMove passes the `className` and `style` props along to the `ul` that needs to be created. Here's how it renders:

```html
<div>
  <ul class="row" style="background-color: red">
    <li class="col">Column 1</li>
    <li class="col">Column 2</li>
  </ul>
</div>
```

This works for all HTML props - there's no validation.

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

`npm run build` launches eslint, flow checks, tests, babel transpiling and webpack bundling. So if everything passes, you're good to go. 


## Development

This project uses [React Storybook](https://github.com/kadirahq/react-storybook) in development. The developer experience is absolutely lovely, and it makes testing new features like enter/leave presets super straightforward.

After installing dependencies, launch the Storybook dev server with `npm run storybook`.

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
