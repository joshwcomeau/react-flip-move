How It Works
============

### FLIP technique
The general approach was adapted from the _FLIP technique_. FLIP stands for **First, Last, Invert,** and **Play**.

To understand, let's take a simplified example: Two items in a list that trade places. We'll look at how the HTML changes with this technique, and then examine React's part in it.

_**Note:** I'm inlining CSS in these examples purely for illustrative purposes =)_


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

If the browser was allowed to paint the **last** step, we'd see the two elements instantly swap places. Before the browser is allowed to do that, though, we intervene with the **invert** step.

We want to take the difference in their positions, so that they APPEAR to not have moved. In order for that to happen:

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

### Thoughts

**Hardware Acceleration**. We use `transform: translateY` instead of a more intuitive property like `top` because `transform` is able to be hardware-accelerated and implemented by the GPU. This means it runs much, much smoother.

**Rendering Process**. We're also taking advantage of the browser's rendering process here. Browsers have 4 steps in their process to getting stuff on your screen:

  1. __Recalculate Style.__ Figure out which CSS selectors apply to which DOM nodes.
  2. __Layout.__ Figure out where everything on the page needs to be.
  3. __Paint.__ Draw the items onto the screen.
  4. __Composite.__ Flatten compositor layers.

The key stages are #2 and #3 - by using `requestAnimationFrame`, a native Javascript method on the window object, we can execute some code after the layout has been calculated but before it has been painted to the screen. After the **last** position has been calculated, we can quickly **invert** our styles, forcing another layout calculation and avoiding the paint.


------------------------------


## Implementing FLIP and React.

The original FLIP technique, as described by Google's Paul Lewis, is made to transition an element between two CSS classes.

In our case, we don't have two CSS classes, but we have two moments in the component lifecycle that will work.

We are deriving our **first** position in the _componentWillReceiveProps_ method. When `FlipMove` receives new props, we iterate through the children, and store each child's _bounding rectangle_ in our state.

The _bounding rectangle_ is an object that indicates the positioning of an object, relative to the viewport. It provides top/left/right/bottom and width/height properties.

After our first set of props, our state might look like:

```js
{
  child1: {
    top: 0, bottom: 250, left: 0, right: 0, width: 100, height: 50
  },
  child2: {
    top: 50, bottom: 200, left: 0, right: 0, width: 100, height: 50
  },
  child3: {
    top: 100, bottom: 150, left: 0, right: 0, width: 100, height: 50
  }
}
```

To calculate our **last** position, we have another moment in the component lifecycle: `componentDidUpdate`.

This method runs after the layout has been recalculated but, crucially, before the browser has painted it to the screen. This makes it the perfect place to calculate how our elements have changed.

If, in the example above, the list had been reversed, we can now compute the following positions:

```js
{
  child1: {
    top: 100, bottom: 150, left: 0, right: 0, width: 100, height: 50
  },
  child2: {
    top: 50, bottom: 200, left: 0, right: 0, width: 100, height: 50
  },
  child3: {
    top: 200, bottom: 250, left: 0, right: 0, width: 100, height: 50
  }
}
```

We can then immediately move into the **invert** phase, by calculating the deltas in `top` and `left`. In this case, `child1` has a Y delta of +100 and `child3` has a Y delta of -100. `child2` has not budged.

The rest is pretty straightforward: We can apply a `transform: translateY(100px)` to `child1`, a `transform: translateY(-100px)` to `child3`, and let the CSS transition do its thing =)



## Additional Reading

* <a href="https://aerotwist.com/blog/flip-your-animations/" target="_blank">FLIP Your Animations</a>
* <a href="https://aerotwist.com/blog/pixels-are-expensive/" target="_blank">Pixels Are Expensive</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame" target="_blank">window.requestAnimationFrame</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect" target="_blank">element.getBoundingClientRect</a>
