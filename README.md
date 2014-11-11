# [Motio](http://darsa.in/motio)

Small JavaScript library for simple but powerful sprite based animations and panning.

Motio takes an element and animates its background position to create an animation effect. All is super optimized for
speed and chained to the requestAnimationFrame, with a polyfill for older browsers without it.

That being said, animating the element background is not the fastest possible way how to do this (canvas solutions are
a lot faster), but it is sure as hell the most simple one, and compatible with everything from IE6 and up.

#### Dependencies

Motio has no dependencies, but there is an optional
[Motio jQuery plugin extension](https://raw.github.com/darsain/motio/master/dist/jquery.motio.min.js) available.

#### Compatibility

Works everywhere.

## Usage

Sprite animation mode:

```js
var element = document.querySelector('#sprite');
var sprite = new Motio(element, {
	fps: 10,
	frames: 14
});
sprite.play();   // start animation
sprite.pause();  // pause animation
sprite.toggle(); // toggle play/pause
sprite.toStart(); // animate to 1st frame and stop
sprite.toEnd();   // animate to last frame and stop
sprite.to(10);    // animate to 11th frame and stop
```

Seamless background panning mode:

```js
var element = document.querySelector('#panning');
var panning = new Motio(element, {
	fps: 30, // Frames per second. More fps = higher CPU load.
	speedX: -30 // Negative horizontal speed = panning to left.
});
panning.play();    // start animation
panning.pause();   // pause animation
panning.toggle();  // toggle play/pause
```

## Download

Latest stable release:

- [Production `motio.min.js`](https://raw.github.com/darsain/motio/master/dist/motio.min.js) - 3KB, 1.6KB gzipped
- [Development `motio.js`](https://raw.github.com/darsain/motio/master/dist/motio.js) - 12KB

jQuery plugin version:

- [Production `jquery.motio.min.js`](https://raw.github.com/darsain/motio/master/dist/jquery.motio.min.js) - 3.7KB, 1.8KB gzipped
- [Development `jquery.motio.js`](https://raw.github.com/darsain/motio/master/dist/jquery.motio.js) - 13.5KB

When isolating issues on jsfiddle, you can use this URL:

- [http://darsain.github.io/motio/js/motio.min.js](http://darsain.github.io/motio/js/motio.min.js)

## Documentation

Can be found in the [docs](https://github.com/darsain/motio/tree/master/docs) directory.

## Contributing

Please, read the [Contributing Guidelines](CONTRIBUTING.md) for this project.
