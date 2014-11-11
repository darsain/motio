# Options

All default options are stored in the `Motio.defaults` object. You can modify them simply by:

```js
Motio.defaults.fps = 60;
```

By default, everything is disabled. Initiating Motio with all default options will leave you with a dead FRAME that doesn't do anything.

## Quick reference

Motio call with all default options as defined in the source.

```js
var panning = new Motio(element, {
	fps:      15, // Frames per second.

	// Sprite animation specific options
	frames:   0, // Number of frames in sprite.
	vertical: false, // Tells Motio that you are using vertically stacked sprite image.
	width:    0, // Set the frame width manually (optional).
	height:   0, // Set the frame height manually (optional).

	// Panning specific options
	speedX:   0, // Horizontal panning speed in pixels per second.
	speedY:   0, // Vertical panning speed in pixels per second.
	bgWidth:  0, // Width of the background image (optional).
	bgHeight: 0  // Height of the background image (optional).
});
```

# Options

---

### fps

Type: `Int`
Default: `15`

Animation frames per second. Bigger number means smoother animations, but higher CPU load. Maximum value is 60.

*This option can be changed dynamically with `.set()` method.*

## Sprite animation mode specific options

### frames

Type: `Integer`
Default: `null`

How many frames are in the sprite image. Setting this options triggers the sprite animation mode. Otherwise Motio is in the panning mode.

### vertical

Type: `Boolean`
Default: `false`

Tells Motio that you are using vertically stacked sprite image.

### width

Type: `Integer`
Default: `0`

Sets the frame width manually. This is highly optional, as Motio figures out this value automatically, but if the element you are applying Motio to is currently hidden, this is impossible. In such situation use this option to help Motio out.

### height

Type: `Integer`
Default: `0`

Sets the frame height manually. This is highly optional, as Motio figures out this value automatically, but if the element you are applying Motio to is currently hidden, this is impossible. In such situation use this option to help Motio out.

## Panning mode specific options

### speedX

Type: `Integer`
Default: `null`

Horizontal animation speed in pixels per second. Use negative values to move backwards.

*This option can be changed dynamically with `.set()` method.*

### speedY

Type: `Integer`
Default: `null`

Vertical animation speed in pixels per second. Use negative values to move backwards.

*This option can be changed dynamically with `.set()` method.*

### bgWidth

Type: `Integer`
Default: `null`

Width of the background image used for panning. This is highly optional.

This and `bgHeight` options are needed so the Motio will know when to reset the background position back to 0, and thus not overflow the JavaScript's 2^53 integer limit. When omitted, the position will iterate into ridiculous numbers, which will in a few million years cause a buggy animation... You basically set these options if you have OCD.

### bgHeight

Type: `Integer`
Default: `null`

Height of the background image used for panning. This is highly optional.

## jQuery plugin options

These options are relevant only when initiating Motio via a jQuery proxy.

### startPaused

Type: `Boolean`
Default: `0`

By default, initiating via a jQuery plugin automatically starts the animation. Passing `true` into this value will prohibit that.
