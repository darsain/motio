# Methods

Motio has a handful of very useful methods. You can call them directly on a [new Motio object](Calling.md):

```js
var motio = new Motio(frame, options);
// Play method call
motio.play();
```

All methods return the current Motio object, unless specified otherwise. This means that you can chain method calls if you want:

```js
motio.on('frame', callback).set('speedX', 50).play();
```

#### Calling methods via a jQuery plugin proxy

If you are using the jQuery plugin version of Motio, you can also call all methods via a proxy, like this:

```js
$('#frame').motio('methodName' [, arguments... ] );
```

Assuming the `$('#frame')` element has already a Motio object associated with it. This happens when [calling a Motio via a jQuery plugin](Calling.md#calling-via-jquery-plugin). Example:

```js
$('#frame').motio('toEnd', callbackFunction);
```

## Methods

### #play([reverse])

Starts playing continuous animation that doesn't stop until interrupted by other methods.

- **[reverse]** `Boolean` Pass true to animate in the opposite direction.

The **reverse** argument is relevant only in sprite animation mode, as panning animation direction is controlled by passing a positive or negative integers into the `speedX` & `speedY` options.

### #pause()

Pauses the current animation.

### #toggle()

Pauses when playing, resumes when paused.

### #toStart([immediate], [callback])

*Available only in sprite animation mode!*

Animate to the first frame, and pause the animation. If the first frame is already active, it will repeat the animation from the last frame.

- **[immediate]** `Boolean` Whether the last frame should be activated immediately, skipping the animation.
- **[callback]** `Function` Callback to be fired when animation reaches the destination.

If you interrupt the animation before it reaches the destination, callback won't fire.

```js
motio.toStart(true); // Activate first frame immediately without animation.
motio.toStart(callback); // Execute callback when animation reaches the destination.
motio.toStart(true, callback); // Combination of both arguments.
```

### #toEnd([immediate], [callback])

*Available only in sprite animation mode!*

Animates to the last frame, and pause the animation. If the last frame is already active, it will repeat the animation from the first frame.

- **[immediate]** `Boolean` Whether the last frame should be activated immediately, skipping the animation.
- **[callback]** `Function` Callback to be fired when animation reaches the last frame.

If you interrupt the animation before it reaches the destination, callback won't fire.

```js
motio.toEnd(true); // Activate last frame immediately without animation.
motio.toEnd(callback); // Execute callback when animation reaches the destination.
motio.toEnd(true, callback); // Combination of both arguments.
```

### #to(frame, [immediate], [callback])

*Available only in sprite animation mode!*

Animate to the specified frame, and pause the animation.

- **[frame]** `Integer` Animation destination frame index, starting at `0`.
- **[immediate]** `Boolean` Whether the last frame should be activated immediately, skipping the animation.
- **[callback]** `Function` Callback to be fired when animation reaches the destination.

If you interrupt the animation before it reaches the destination, callback won't fire.

If the current active frame is specified as the destination, Motio will be paused, and callback will be fired immediately.

```js
motio.to(2, true); // Activate 3rd frame immediately without animation.
motio.to(2, callback); // Execute callback when animation reaches the 3rd frame.
motio.to(2, true, callback); // Combination of both arguments.
```

### #set(name, value)

Change a specified option value.

- **name** `String` Name of the option to be changed.
- **value** `Mixed` New option value.

Only these options can be changed dynamically:

- fps
- speedX
- speedY

Example:

```js
motio.set('speedX', 100);
```

### #on(eventName, callback)

Registers a callback to one or more of the Motio events. All available events and arguments they receive can be found in the [Events documentation](Events.md).

- **eventName:** `Mixed` Name of the event, or callback map object.
- **callback:** `Mixed` Callback function, or an array with callback functions.

Examples:

```js
// Basic usage
motio.on('frame', function () {});

// Multiple events, one callback
motio.on('play pause', function () {});

// Multiple callbacks for multiple events
motio.on('play pause', [
	function () {},
	function () {}
]);

// Callback map object
motio.on({
	play: function () {},
	frame: [
		function () {},
		function () {}
	]
});
```

### #off(eventName, [callback])

Removes one, multiple, or all callbacks from one of the Motio events.

- **eventName]** `String` Name of the event.
- **[callback]** `Mixed` Callback function, or an array with callback functions to be removed. Omit to remove all callbacks.

Examples:

```js
// Removes one callback from load event
motio.off('load', fn1);

// Removes one callback from multiple events
motio.off('load move', fn1);

// Removes multiple callbacks from multiple event
motio.off('load move', [ fn1, fn2 ]);

// Removes all callbacks from load event
motio.off('load');
```

### #destroy()

Pauses the animation, and resets the background position to `0 0`.