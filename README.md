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

### [Changelog](https://github.com/darsain/motio/wiki/Changelog)

Motio upholds the [Semantic Versioning Specification](http://semver.org/).

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

- **[Markup](https://github.com/darsain/motio/wiki/Markup)** - how should the HTML & CSS look like
- **[Calling](https://github.com/darsain/motio/wiki/Calling)** - how to call Motio
- **[Options](https://github.com/darsain/motio/wiki/Options)** - all available options
- **[Properties](https://github.com/darsain/motio/wiki/Properties)** - accessible Motio object properties
- **[Methods](https://github.com/darsain/motio/wiki/Methods)** - all available methods, and how to use them
- **[Events](https://github.com/darsain/motio/wiki/Events)** - all available events, and how to register callbacks

*Other languages are maintained by 3rd parties.*

### Chinese

- [Markup](http://strongme.github.io/Motio-Wiki-CN-Markup.html)
- [Calling](http://strongme.github.io/Motio-Wiki-CN-Calling.html)
- [Options](http://strongme.github.io/Motio-Wiki-CN-Options.html)
- [Properties](http://strongme.github.io/Motio-Wiki-CN-Properties.html)
- [Methods](http://strongme.github.io/Motio-Wiki-CN-Methods.html)
- [Events](http://strongme.github.io/Motio-Wiki-CN-Events.html)

## Contributing

Please, read the [Contributing Guidelines](CONTRIBUTING.md) for this project.