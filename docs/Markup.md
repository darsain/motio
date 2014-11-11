# Markup

Motio animates the background position of an element passed to it. The background can be a seamless image (panning animation), or an animation frames sprite (sprite based animation).

### Example

You have an element with background that holds either seamless repeating image (for panning), or animation frames sprite (sprite based animation).

```html
<div id="panning" class="panning"></div>
<div id="sprite" class="sprite"></div>
```

The size and background of the elements is handled by your CSS.

```css
.panning {
	width: auto; // Span to the full width of container
	height: 300px;
	background: url('seamless-sky.jpg');
}

.sprite {
	width: 256px; // Width of one animation frame
	height: 256px; // Height of one animation frame
	background: url('animation_frames_sprite.png');
}
```

Motio calls than look like this:

```js
// Panning
var element = document.querySelector('#panning');
var panning = new Motio(element, {
	fps: 30, // Frames per second. More fps = higher CPU load.
	speedX: -30 // Negative horizontal speed = panning to left.
});
panning.play(); // start animation

// Sprite
var element = document.querySelector('#sprite');
var sprite = new Motio(element, {
	fps: 10,
	frames: 14
});
sprite.play(); // start animation
```

Motio knows that animation is sprite based when you set the `frames` option.

Initiating animation with `#play()` method is not needed when calling via a jQuery proxy, as in this case the animation is initiated automatically after `new Motio` object has been created. Motio assumes that you are using jQuery proxy just to initiate animation and leave it alone. Calling methods and controlling the Motio animations via jQuery proxy, even when possible, just doesn't make sense. There is a `new Motio`, why would you even selector proxy everything... ?

For more options and methods and everything, [RTFM](README.md).

## Panning

There are no rules in the panning mode. Just give element a background, and pass it to Motio.

## Sprite

To have a correctly working sprite based animation, you need an element that is the exact size of a one animation frame. Example:

![Sprite markup](http://i.imgur.com/Sazfe0Q.png)

This means that the element width & height (specifically the element's border box size) has to equal the width & height of one animation frame. The element size is set by you in CSS. You can set padding, margin, and border, Motio will still work, as long as the border-box size equals the size of one frame. The only thing that'll break it is changing the `background-origin`. So don't touch that :)

Also, calling spriote based Motio on hidden elements just doesn't work, as Motio cannot retrieve their size. In this case, use [`width`](Options.md#width) & [`height`](Options.md#height) options to set the width and height of the element manually.
