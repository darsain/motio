# Motio

jQuery plugin for simple but powerful sprite based animations and panning.

[See the DEMO](http://darsain.github.com/motio)


## Calling

Motio is called on an element representing animation container, where animation is delivered in CSS background image.

In sprite based animations, container should have the dimensions of one sprite frame.
E.g, if you have 10 frames in a horizontal sprite that is 1000 x 100 pixels big, the container should be 100 x 100 pixels big.

In panning, container size doesn't play any role, just the background image should be seamless. Or not :), depending on what are you going for.

```js
$(selector)( [ options [, returnInstance ]] );
```

### [ options ]

Object with options. Properties:

#### Shared options

**fps:** `Int` `default: 15` frames per second
**vertical:** `Bool` `default: 0` whether the images in sprite are positioned vertically instead of horizontally
**paused:** `Bool` `default: 0` whether to start animation paused

#### Sprite animation specific options

**frames:** `Int` `default: 0` number of frames in sprite - if this option remains `0`, it is considered that you are requesting panning animation type

#### Panning animation specific options

Panning is decided by **frames** option above. If you want to pan background, leave **frames** option at `0`.

**speed:** `Int` `default: 50` panning speed in pixels per second
**bgSize:** `Int` `default: 50` background size so motio could reset background position if it gets over this value. not required

### [ returnInstance ]

Boolean argument requesting to return a plugin instance instead of a chainable jQuery object. You can than use all methods documented below directly on this instance.

If motio is called on more than one element, it returns array of instances.

#### Usage:

```js
var bgPan = $('#bg').motio( { paused: 1 }, true );

bgPan.set( 'speed', 100 );
bgPan.play();
```


## Methods

All methods can be called via `.motio()` call:

```js
$(selector).motio( methodName [, arguments, ... ] );
```

Rr diractly via Motio instance:

```js
// Calling motio with `returnInstance = true`, and saving the instance
var motioInstance = $(selector).motio( options, true );
motioInstance.methodName( [ arguments, ... ] );
```

Reference to Motio instance is also saved in a frame data. You can retrieve it with:

```js
var motioInstance = $(selector).data('plugin_motio');
```


### play

```js
$(selector).motio( 'play' );
```

Starts playing an animation when paused.

### pause

```js
$(selector).motio( 'pause' );
```

Pauses a playing animation.

### toggle

```js
$(selector).motio( 'toggle' );
```

Toggles between playing and paused states.

### set

```js
$(selector).motio( 'set', property, value );
```

Updates one of the options. Only these options can be updates: **speed**, **fps**

**property:** `String` name of the property that should be updated
**value:** `Mixed` new value of the property

### toStart

```js
$(selector).motio( 'toStart' [, immediate ] );
```

Animates the animation to the start and than triggers pause. Doesn't work with panning animations.

**immediate:** `Bool` move to the start immediately without animation

### toEnd

```js
$(selector).motio( 'toStart' [, immediate ] );
```

Animates the animation to the end and than triggers pause. Doesn't work with panning animations.

**immediate:** `Bool` move to the end immediately without animation

### to

```js
$(selector).motio( 'to', frame [, immediate ] );
```

Animates the animation to the passed frame index. Doesn't work with panning animations.

**frame:** `Int` frame index starting at `0`
**immediate:** `Bool` move to the end immediately without animation

### on

```js
$(selector).motio( 'on', eventName, function );
```

Binds a callback function to one of the custom events trigger by motio. Only for jQuery **1.7**+.
If you are using older jQuery version, you can use the equivalent: `$(selector).bind('motio:eventName', fn);`.

**eventName:** `String` name of a custom event to bind the function to
**function:** `Function` callback function

### off

```js
$(selector).motio( 'off', eventName [, function ] );
```

Unbinds a callback function from one of the custom events trigger by motio. If no function is specified, it unbinds all callbacks. Only for jQuery **1.7**+.
If you are using older jQuery version, you can use the equivalent: `$(selector).unbind('motio:eventName', fn);`.

**eventName:** `String` name of a custom event to unbind the function from
**function:** `Function` callback function

### destroy

```js
$(selector).motio( 'destroy' );
// or alias
$(selector).motio( false );
```

Removes motio from elements.


## Custom events

Motio is triggering bunch of useful events. You can bind your callbacks to them in a few different ways:

```js
$(selector).motio( 'on', eventName, function );
// or directly via Motio instance
var motioInstance = $(selector).motio( options, true );
motioInstance.on( eventName, function );

// jQuery <1.7
$(selector).bind( 'motio:eventName', function );
```

And similarly unbinding with:

```js
$(selector).motio( 'off', eventName, function );
// or via instance
motioInstance.off( eventName, function );

// jQuery <1.7
$(selector).unbind( 'motio:eventName', function );
```

Integrated Motio on/off methods are using jQuery $.Callbacks API, which is in jQuery sice **1.7**+.
If you can't use newer versions of jQuery, you can go for jQuery bind/unbind methods called on a frame element, with 'motio:' prefix on all event names.

### frame

Triggered on each frame. Receives 2 arguments, which are based on an animation type.

+ sprite - `function( activeFrameIndex, numberOfFrames ){ ... }` - active frame index starts at `0`
+ panning - `function( currentPosition, backgroundSize ){ ... }` - `backgroundSize` is `0` if you haven't passed bgSize in options


### start

When **toStart** method has been called, this event is triggered when an animation arrives at the start and pauses itself.


### end

When **toEnd** method has been called, this event is triggered when an animation arrives at the end and pauses itself.


### pause

Triggered when animation is paused.


### play

Triggered when animation unpauses itself.


### toggle

Triggered when toggle method is called.
