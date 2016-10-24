# Code Tour

This project started off pretty simply: Use the FLIP technique to handle list re-orderings.

Over the past year, though, the code has become increasingly complex as new features were added, and edge-cases corrected.

This guide serves as a high-level overview of how the code works, to make it easier for others (and future me) to continue developing this project.


## Prop Conversion via HOC

FlipMove takes a lot of props, and these props need a fair bit of validation/cleanup.

Rather than litter the main component with a bunch of guards and boilerplate, I created a higher-order component which handles all of that business.

the file `prop-converter.js` holds all prop-validation logic. It should mostly be pretty self-explanatory: It takes in props, validates them, makes a few tweaks, and passes them down to FlipMove.


### DOM Manipulation

There's no getting around it: when you practice the FLIP technique, you have to get down and dirty with the DOM.

I've tried to isolate all DOM activity to a set of impure functions, located in `dom-manipulation.js`.


## FlipMove

All of the core logic lives within the primary FlipMove component. It's become a bit of a behemoth, so let's walk through how it works at a high level.


### Instantiation

A bunch of stuff happens when a FlipMove component is instantiated.

##### `childrenData`

`childrenData` holds metadata about the rendered children. A snapshot might look like this:

```js
{
  abc123: {
    domNode: <div>...</div>,
    boundingBox: {
      top: 10,
      left: 0,
      right: 500,
      bottom: 530,
      width: 100,
      height: 300,
    },
  },
}
```

The object is keyed by the `key` prop that you must supply when passing children to FlipMove, and it holds a reference to the backing instance, and that backing instance's bounding box✱.

> ✱ Sidenote: Typically, a boundingBox refers to where an element is relative to the _viewport_. In our case, though, it refers to the element's position relative to its parent. We do this so that scrolling doesn't break everything.

##### `parentData`

Similarly, `parentData` holds the same information about the wrapping container element, the one created by FlipMove itself.


##### `heightPlaceholderData`

The default behaviour, when items are removed from the DOM, is for the container height to instantly snap down to its new height.

This makes sense, when you think about it. Items that are animating out NEED to be removed from the DOM flow, so that its siblings can begin to move and take its space. However, it means that the parent container suddenly has "holes", and will collapse to only fit the non-removing containers.

To combat this issue, an optional prop can be provided, to maintain the container's height until all animations have completed.

In order to accomplish this goal, we have a placeholder. When items are removed, it grows to fill the "holes" created by them, so that the parent container doesn't need to shrink at all.

`heightPlaceholderData` just holds a reference to that DOM node.


##### `state.children`

Also within our constructor, we transfer the contents of `this.props.children` into the component's state.

You may have read that this is an anti-pattern, and produces multiple sources of truth. In our case, though, we actually need two separate sources of truth, to deal with leave animations.

Let's say our component receives new props, and two of the children are missing in them. We can deduce that these children need to be removed from the DOM.

If we simply use this.props.children, though, the missing children will instantly disappear. We can't smoothly transition them away, because they're immediately removed from the DOM.

By copying props to state, and rendering from `this.state.children`, we can hang onto them for a brief moment.


##### `remainingAnimations` and `childrenToAnimate`

We need to track which element(s) are currently undergoing an animation, and how many are left.

We have hooks for `onStartAll` and `onFinishAll`, and these hooks are provided the element(s) and DOM node(s) of all animating children. `childrenToAnimate` is an array which holds all the `key`s of children that are animating.

`remainingAnimations` is a simple counter, and it's how we can tell that _all_ animations have completed. Because we can stagger animations, they don't all finish at the same time.


##### `originalDomStyles`

Finally, in our constructor, we have an object that holds CSS.

Don't worry too much about this; it's an edge-case bug fix for when items are removed and then re-introduced in rapid succession, to ensure that their original styles can be re-applied.



## FLIP flow

Let's quickly go over how the FLIP process works:

- The component receives props.

- We update our cached values for children and parent bounding boxes. This will become the "First" position, our origins.

- We compute our new set of children - this may be a simple matter of using this.props.children, but if items are leaving, we need to do some rejigging.

- we set our state to these new children, causing a re-render. The re-render causes the children to render in their new, final position, also known as the 'Last' position, in FLIP terminology.

- After the component has been re-rendered, but _before_ the changes have been painted to screen, we need to run our animation. Before we can do that, though, we need to do our animation prep. Prep consists of:
    - for children that are about to leave, remove them from the document flow, so that its siblings can shift into its position.
    - update the placeholder height, if needed, to keep the container open despite the removal from document flow.

- Finally, the animation! We filter out all children that don't need to be animated, invoke the `onStartAll` callback with the dynamic children, and hand each one to our `animateChild` method.

- `animateChild` does the actual flipping. For items that are being shuffled, it starts by calculating where it should be, by comparing the cached boundingBox with a freshly-calculated one. For items that are entering/leaving, we just merge in the `from` animation style. This is the 'Invert' stage.

- At this point, the DOM has been redrawn with the items in their new positions, but then we've offset them (using `transform: translate`) so that everything is exactly where it was before the change. We allow a frame to pass, so that these invisible changes can be painted to the screen.

- Then, to "Play" the animation, we simply remove our `transform` prop, and apply a `transition` so that it happens gradually. The item's transform will undo itself, and the item will shift back into its natural, new position.

- We bind a `transitionEnd` event listener so that we know exactly when each animation ends. At that point, we do a few things:

    - remove the `transition` property we applied.
    - trigger the `onFinish` hook for this element.
    - If this is the last item that needed to animate, trigger the `onFinishAll` hook, and clean up our various variables so that the next run starts from a clean slate.


### Method Map

The summary above is well and good, but sometimes I just need to refresh my memory on how the method calls are laid out. Here's what an update cycle looks like:


```
- componentWillReceiveProps
  - this.updateBoundingBoxCaches
    - getRelativeBoundingBox
  - this.calculateNextSetOfChildren
  - this.setState

- componentDidUpdate
  - this.prepForAnimation
    - removeNodeFromDOMFlow
    - updateHeightPlaceholder
  - this.runAnimation
    - this.doesChildNeedToBeAnimated
      - getPositionDelta
    - this.animateChild
      - this.computeInitialStyles
      - applyStylesToDOMNode
      - createTransitionString
      - applyStylesToDOMNode
      - this.bindTransitionEndHandler
        - this.triggerFinishHooks
          - this.formatChildrenForHooks
    - this.formatChildrenForHooks
```
