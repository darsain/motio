# Properties

Motio object exposes some useful properties:

### #element

Type: `Object`

The element Motio is called on.

### #options

Type: `Object`

Object with all options used by the current Motio object. This is essentially a `Motio.defaults` object extended by options passed to `new Motio()`.

### #width

Type: `Integer`

Width of the frame. Doesn't update, so if you have a panning animation on `body` element and you resize the window, it will not reflect in this value. You don't really ever need this property in panning mode anyway.

### #height

Type: `Integer`

Height of the frame. Doesn't update, so if you have a panning animation on `body` element and you resize the window, it will not reflect in this value. You don't really ever need this property in panning mode anyway.

### #isPaused

Type: `Boolean`

This property is `true` when Motio is paused, `false` otherwise.

## Panning mode specific properties

### #pos

Type: `Object`

Background position object:

```js
{
	x: 100, // Horizontal background position.
	y: 100  // Vertical background position.
}
```

## Sprite mode specific properties

### #frame

Type: `Integer`

Active frame index.

### #frames

Type: `Integer`

Number of frames total.