# API Reference

FlipMove is a React component, and is configured via the following props:



### `children`

| **Accepted Types:** | **Default Value** |
|---------------------|-------------------|
|  `Array`, `Object` | `undefined` |


The children passed to FlipMove are the component(s) or DOM element(s) that will be moved about. Accepts either a single child (as long as it has a unique `key` property) or an array of children.

---

### `easing`

| **Accepted Types:** | **Default Value** |
|---------------------|-------------------|
|  `String` | "ease-in-out" |


Any valid CSS3 timing function (eg. "linear", "ease-in", "cubic-bezier(1, 0, 0, 1)").

---

### `duration`

| **Accepted Types:** | **Default Value** |
|---------------------|-------------------|
|  `Number` | `350` |


The length, in milliseconds, that the transition ought to take.


---

### `delay`

| **Accepted Types:** | **Default Value** |
|---------------------|-------------------|
|  `Number` | `0` |


The length, in milliseconds, to wait before the animation begins.

---

### `staggerDurationBy`

| **Accepted Types:** | **Default Value** |
|---------------------|-------------------|
|  `Number` | `0` |


The length, in milliseconds, to be added to the duration of each subsequent element.

For example, if you are animating 4 elements with a `duration` of 200 and a `staggerDurationBy` of 20:

* The first element will take 200ms to transition.
* The second element will take 220ms to transition.
* The third element will take 240ms to transition.
* The fourth element will take 260ms to transition.

This effect is great for "humanizing" transitions and making them feel less robotic.

---

### `staggerDelayBy`

| **Accepted Types:** | **Default Value** |
|---------------------|-------------------|
|  `Number` | `0` |


The length, in milliseconds, to be added to the delay of each subsequent element.

For example, if you are animating 4 elements with a `delay` of 0 and a `staggerDelayBy` of 20:

* The first element will start transitioning immediately.
* The second element will start transitioning after 20ms.
* The third element will start transitioning after 40ms.
* The fourth element will start transitioning after 60ms.

Similarly to staggerDurationBy, This effect is great for "humanizing" transitions and making them feel less robotic.

**Protip:** You can make elements animate one-at-a-time by using an identical `duration` and `staggerDelayBy`.

---

### `appearAnimation`

| **Accepted Types:**            | **Default Value** |
|--------------------------------|-------------------|
|  `String`, `Boolean`, `Object` | undefined         |

Control the appear animation that runs when the component mounts. Works identically to [`enterAnimation`](#enteranimation) below, but only fires on the initial children.

---

### `enterAnimation`

| **Accepted Types:**            | **Default Value** |
|--------------------------------|-------------------|
|  `String`, `Boolean`, `Object` | 'elevator'        |

Control the onEnter animation that runs when new items are added to the DOM. For examples of this property, see the <strong><a href="https://github.com/joshwcomeau/react-flip-move/blob/master/documentation/enter_leave_animations.md">enter/leave docs</a></strong>.

Accepts several types:

**String:** You can enter one of the following presets to select that as your enter animation:
  * `elevator` (default)
  * `fade`
  * `accordionVertical`
  * `accordionHorizontal`
  * `none`

<a href="https://github.com/joshwcomeau/react-flip-move/blob/master/src/enter-leave-presets.js">View the CSS implementation of these presets.</a>

**Boolean:** You can enter `false` to disable the enter animation, or `true` to select the default enter animation (elevator).

**Object:** For fully granular control, you can pass in an object that contains the styles you'd like to animate.

It requires two keys: `from` and `to`. Each key holds an object of CSS properties. You can supply any valid camelCase CSS properties, and flip-move will transition between the two, over the course of the specified `duration`.

Example:

```jsx
const customEnterAnimation = {
  from: { transform: 'scale(0.5, 1)' },
  to:   { transform: 'scale(1, 1)' }
};

<FlipMove enterAnimation={customEnterAnimation}>
  {renderChildren()}
</FlipMove>
```

It is recommended that you stick to hardware-accelerated CSS properties for optimal performance: transform and opacity.

---

### `leaveAnimation`

| **Accepted Types:**            | **Default Value** |
|--------------------------------|-------------------|
|  `String`, `Boolean`, `Object` | 'elevator'        |

Control the onLeave animation that runs when new items are removed from the DOM. For examples of this property, see the <strong><a href="https://github.com/joshwcomeau/react-flip-move/blob/master/documentation/enter_leave_animations.md">enter/leave docs</a></strong>.

This property functions identically to `enterAnimation`.

Accepts several types:

**String:** You can enter one of the following presets to select that as your enter animation:
  * `elevator` (default)
  * `fade`
  * `accordionVertical`
  * `accordionHorizontal`
  * `none`

<a href="https://github.com/joshwcomeau/react-flip-move/blob/master/src/enter-leave-presets.js">View the CSS implementation of these presets.</a>

**Boolean:** You can enter `false` to disable the leave animation, or `true` to select the default leave animation (elevator).

**Object:** For fully granular control, you can pass in an object that contains the styles you'd like to animate.

It requires two keys: `from` and `to`. Each key holds an object of CSS properties. You can supply any valid camelCase CSS properties, and flip-move will transition between the two, over the course of the specified `duration`.

Example:

```jsx
const customLeaveAnimation = {
  from: { transform: 'scale(1, 1)' },
  to:   { transform: 'scale(0.5, 1) translateY(-20px)' }
};

<FlipMove leaveAnimation={customLeaveAnimation}>
  {renderChildren()}
</FlipMove>
```

It is recommended that you stick to hardware-accelerated CSS properties for optimal performance: transform and opacity.

---

### `maintainContainerHeight`

| **Accepted Types:** | **Default Value** |
|---------------------|-------------------|
|  `Boolean`          | `false`           |

Do not collapse container height until after leaving animations complete.

When `false`, children are immediately removed from the DOM flow as they animate away. Setting this value to `true` will maintain the height of the container until after their leaving animation completes.

---

### `verticalAlignment`

| **Accepted Types:** | **Default Value** | **Accepted Values** |
|---------------------|-------------------|---------------------|
|  `String`           | `'top'`           | `'top'`, `'bottom'` |

If the container is bottom-aligned and an element is removed, the container's top edge moves lower. You can tell `react-flip-move` to account for this by passing `'bottom'` to the `verticalAlignment` prop.

---

### `onStart`

| **Accepted Types:** | **Default Value** |
|---------------------|-------------------|
|  `Function`         | `undefined`       |


A callback to be invoked **once per child element** at the start of the animation.

The callback is invoked with two arguments:

* `childElement`: A reference to the React Element being animated.
* `domNode`: A reference to the unadulterated DOM node being animated.

In general, it is advisable to ignore the `domNode` argument and work with the `childElement`. The `domNode` is just an escape hatch for doing complex things not otherwise possible.

---

### `onFinish`

| **Accepted Types:** | **Default Value** |
|---------------------|-------------------|
|  `Function`         | `undefined`       |


A callback to be invoked **once per child element** at the end of the animation.

The callback is invoked with two arguments:

* `childElement`: A reference to the React Element being animated.
* `domNode`: A reference to the unadulterated DOM node being animated.

In general, it is advisable to ignore the `domNode` argument and work with the `childElement`. The `domNode` is just an escape hatch for doing complex things not otherwise possible.

---

### `onStartAll`

| **Accepted Types:** | **Default Value** |
|---------------------|-------------------|
|  `Function`         | `undefined`       |


A callback to be invoked **once per group** at the start of the animation.

The callback is invoked with two arguments:

* `childElements`: An array of the references to the React Element(s) being animated.
* `domNodes`: An array of the references to the unadulterated DOM node(s) being animated.

These arguments are similar to the ones provided for `onStart`, except we provide an *array* of the elements and nodes. The order of both arguments is guaranteed; this means you can use a zipping function like <a href="https://lodash.com/docs#zip">lodash's .zip</a> to get pairs of element/node, if needed.

In general, it is advisable to ignore the `domNodes` argument and work with the `childElements`. The `domNodes` are just an escape hatch for doing complex things not otherwise possible.

---

### `onFinishAll`

| **Accepted Types:** | **Default Value** |
|---------------------|-------------------|
|  `Function`         | `undefined`       |


A callback to be invoked **once per group** at the end of the animation.

The callback is invoked with two arguments:

* `childElements`: An array of the references to the React Element(s) being animated.
* `domNodes`: An array of the references to the unadulterated DOM node(s) being animated.

These arguments are similar to the ones provided for `onFinish`, except we provide an *array* of the elements and nodes. The order of both arguments is guaranteed; this means you can use a zipping function like <a href="https://lodash.com/docs#zip">lodash's .zip</a> to get pairs of element/node, if needed.

In general, it is advisable to ignore the `domNodes` argument and work with the `childElements`. The `domNodes` are just an escape hatch for doing complex things not otherwise possible.

---

### `typeName`

| **Accepted Types:**  | **Default Value** |
|----------------------|-------------------|
|  `String`, `null`    | 'div'             |


Flip Move wraps your children in a container element. By default, this element is a `div`, but you may wish to provide a custom HTML element (for example, if your children are list items, you may wish to set this to `ul`).

Any valid HTML element type is accepted, but peculiar things may happen if you use an unconventional element.

With React 16, Flip Move can opt not to use a container element: set `typeName` to `null` to use this new "wrapperless" behaviour. [Read more](https://github.com/joshwcomeau/react-flip-move/blob/master/README.md#wrapping-elements).

---

### `disableAllAnimations`

| **Accepted Types:** | **Default Value** |
|---------------------|-------------------|
|  `Boolean`          | `false`           |


Sometimes, you may wish to temporarily disable the animations and have the normal behaviour resumed. Setting this flag to `true` skips all animations.

---

### `getPosition`

| **Accepted Types:** | **Default Value**       |
|---------------------|-------------------------|
|  `Function`         | `getBoundingClientRect` |


This function is called with a DOM node as the only argument. It should return an object as specified by the [getBoundingClientRect() spec](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).

For normal usage of FlipMove you won't need this. An example of usage is when FlipMove is used in a container that is scaled using CSS. You can correct the values from `getBoundingClientRect` by using this prop.

---
