# Enter/Leave Animations

FlipMove supports CSS-based enter/leave animations. For convenience, several presets are provided:


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

#### Accordian (Vertical)

![Accordian (Vertical)](https://s3.amazonaws.com/githubdocs/fm-accordian-vertical.gif)

```js
<FlipMove enterAnimation="accordianVertical" leaveAnimation="accordianVertical" />
```

#### Accordian (Horizontal)

![Accordian (Horizontal)](https://s3.amazonaws.com/githubdocs/fm-accordian-horizontal.gif)

```js
<FlipMove enterAnimation="accordianHorizontal" leaveAnimation="accordianHorizontal" />
```

#### Custom

You can supply your own CSS-based transitions to customize the behaviour. Both `enterAnimation` and `leaveAnimation` take an object with `from` and `to` properties. You can then provide any valid CSS properties to this object, although for performance reasons it is recommended that you stick to `transform` and `opacity`.

![Custom](https://s3.amazonaws.com/githubdocs/fm-custom-rotate-x.gif)

```js
 <FlipMove
   staggerDelayBy={150}
   enterAnimation={{
     from: {
       transform: 'rotateX(180deg)',
       opacity: 0.1,
     },
     to: {
       transform: '',
     },
   }}
   leaveAnimation={{
     from: {
        transform: '',
     },
     to: {
       transform: 'rotateX(-120deg)',
       opacity: 0.1,
     },
   }}
 >
   {this.renderRows()}
 </FlipMove>
```