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
        <FlipMove easing="ease-in-out">
          { this.renderTopArticles() }
        </FlipMove>
      </div>
    );
  }
}
```



## How It Works

Curious how this works, under the hood? [__Read the full article__](https://github.com/joshwcomeau/react-flip-move/blob/master/docs/how-it-works.md).


## API

TODO


## Planned functionality

I don't have many plans for this module aside from maintenance. The one feature I feel like it's missing is the ability for changes in size/opacity to be animated (eg. list items become increasingly transparent the further down the list you go).

Got other ideas? Open an issue =) Happy to explore possibilities.


## Contributions

Contributors welcome! Please discuss new features with me ahead of time, and submit PRs for bug fixes with tests.


## License

[MIT](https://github.com/joshwcomeau/flip-move/blob/master/LICENSE.md)
