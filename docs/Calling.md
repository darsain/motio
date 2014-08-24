# Calling

```js
var motio = new Motio( frame [, options ] );
```

This will create a new Motio object, ready to be used. By default, everything is turned off, so calling the Motio with all default options will leave you with a dead FRAME that doesn't do anything.

New Motio object is also paused, so if you want to immediately start the animation, you have to call the `.play()` method afterwards.

The list & documentation of all methods available can be found in the [Methods documentation page](Methods.md).

---

### frame

Type: `Element`

DOM element of an object with animation background. Example:

```js
var motio = new Motio(document.getElementById('frame')); // Native
var motio = new Motio($('#frame')[0]); // With jQuery
```

### options

Type: `Object`

Object with Motio options. All options are documented in the [Options Wiki page](Options.md).


## Calling via jQuery plugin

```js
$('#frame').motio( [ options ] );
```

Initiating motio via a jQuery plugin automatically starts the animation, so you don't have to call the `.play()` method afterwards. You can disable this with [`startPaused`](Options.md#startpaused) option.