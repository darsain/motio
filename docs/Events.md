# Events

You can register callbacks to Motio events with `#on()` and `#off()` methods:

```js
var motio = new Motio(frame, options);

// Register a callback to multiple events
motio.on('play pause', fn);

// Start playing the animation
motio.play();
```

More usage examples can be found in the [on & off methods documentation](Methods.md#on).

## Common arguments

#### this

The `this` value in all callbacks is the Motio object triggering the event. With it you have access to all [Motio object properties](Properties.md).

#### 1st argument

All callbacks receive the event name as the first argument.

---

Example:

```js
motio.on('frame', function (eventName) {
	console.log(eventName); // 'frame'
	console.log(this.frame); // frame index
});
```

## Events

### pause

Triggered when animation is paused.

### play

Triggered when animation is resumed.

### frame

Triggered on each animation frame.