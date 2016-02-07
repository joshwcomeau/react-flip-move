React Flip Move
=========

[![build status](https://img.shields.io/travis/joshwcomeau/react-flip-move/master.svg?style=flat-square)](https://travis-ci.org/joshwcomeau/react-flip-move)
[![npm version](https://img.shields.io/npm/v/react-flip-move.svg?style=flat-square)](https://www.npmjs.com/package/react-flip-move)

Animations library for React that automagically handles animations when a DOM node gets reordered or moved. Emphasis on smooth, 60+ FPS animations.

[![demo](https://s3.amazonaws.com/githubdocs/demo-with-dev-tools.gif)](http://joshwcomeau.github.io/react-flip-move/examples/#/shuffle)


## Demos

  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/shuffle" target="_blank">__List/Grid Shuffle__</a>
  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/square" target="_blank">__Fuscia Square__</a>
  * <a href="http://joshwcomeau.github.io/react-flip-move/examples/#/scrabble" target="_blank">__Scrabble__</a>


The implementation couldn't be simpler. Just wrap the items you'd like to move in a `FlipMove`:

```js
class TopArticles extends Component {
  renderTopArticles() {
    return this.props.articles.map( (article, i) => {
      return <Article {...article} key={i} />;
    });
  }
  render() {
    return (
      <div className="top-articles">
        <FlipMove transition="300" easing="ease-in-out">
          { this.renderTopArticles() }
        </FlipMove>
      </div>
    );
  }
}
```


## Installation

TODO


## Examples

TODO


## Credit

This library was heavily inspired by Ryan Florence's [MagicMove](https://github.com/ryanflorence/react-magic-move), with a few key differences:

* Works with React 0.14+, and will be maintained.
* Uses `transform` CSS properties for 60+ FPS animations, instead of expensive positioning properties like top/left/right/bottom. [Read why this matters](https://aerotwist.com/blog/pixels-are-expensive/).
* _Much_ simpler implementation, does not create any additional DOM nodes.
* Uses the [Web Animations API](http://w3c.github.io/web-animations/) under the hood
* More configurable.


## How It Works

#### FLIP technique
The general approach was adapted from the [FLIP technique](https://aerotwist.com/blog/flip-your-animations/). FLIP stands for **First, Last, Invert,** and **Play**.

To understand, let's take a simplified example: Two items in a list that trade places. Here's the HTML output after React renders based on its props:

_**Note:** I'm inlining CSS in these examples purely for illustrative purposes. This isn't how the code actually works =)_


##### First

```html
<ul id="article-titles">
  <li id="article-one" style="height: 100px;">List Item 1</li>
  <li id="article-two" style="height: 100px;">List Item 2</li>
</ul>
```

Before the animation has happened, List Item 1 is at 0px from the top. List item 2 is at 100px from the top, because it's underneath an item that is 100px tall. These values are our **first** position.


##### Last

Our articles change places. This could be the result of React sending new props, with our articles in a different order.

```html
<ul id="article-titles">
  <li id="article-two" style="height: 100px;">List Item 2</li>
  <li id="article-one" style="height: 100px;">List Item 1</li>
</ul>
```

So now, List Item 1 is 100px from the top, and List Item 2 is 0px from the top. These values are our **last** position.

##### Invert

Now, the fun bit. We want to take the difference in their positions, so that they APPEAR to not have moved. In order for that to happen:

* List Item 1 needs to be artificially _raised_ by 100px.
* List Item 2 needs to be artificially _lowered_ by 100px.

```html
<ul id="article-titles">
  <li id="article-two" style="height: 100px; transform: translateY(100px)">
    List Item 2
  </li>
  <li id="article-one" style="height: 100px; transform: translateY(-100px)">
    List Item 1
  </li>
</ul>
```

Even though their position in the DOM has changed, the user would see these two items in their _original_ position: with List Item 1 on top of List Item 2. This is our **invert** stage.

_**Note:** this transform is NOT animated. It happens instantly, and as far as the user is concerned, **nothing has happened yet**. The two list items are just sitting there, in their original positions._


##### Play

Finally, we *play* them. This involves animating both elements to have a `transform: translateY` of `0px`:

```html
<ul id="article-titles">
  <li id="article-two" style="height: 100px; transform: translateY(0px); transition: 500ms">
    List Item 2
  </li>
  <li id="article-one" style="height: 100px; transform: translateY(0px); transition: 500ms">
    List Item 1
  </li>
</ul>
```

The user sees List Item 1 drop by 100px over half a second, as List Item 2 raises over the same interval. The two appear to slide into their new positions.

#### Implementing FLIP and React.

The original FLIP technique by Google's Paul Lewis is made to transition an element between two CSS classes. In our case, we don't have two CSS classes, but we have two moments in the component lifecycle that will work.

TODO: Finish this thought.

## API

TODO


## Planned functionality

I don't have many plans for this module aside from maintenance. The one feature I feel like it's missing is the ability for changes in size/opacity to be animated (eg. list items become increasingly transparent the further down the list you go).

Got other ideas? Open an issue =) Happy to explore possibilities.


## Contributions

Contributors welcome! Please discuss new features with me ahead of time, and submit PRs for bug fixes with tests.


## License

[MIT](https://github.com/joshwcomeau/flip-move/blob/master/LICENSE.md)
