**2.2.2** :: *7th Aug 2014*

- Fixing another extremely rare jamming of animations. Rendering pipeline has been more streamlined so there shouldn't be more of this.

**2.2.1** :: *18th Apr 2013*

- Fixing extremely rare jamming of sprite based animations.

**2.2.0** :: *11th Apr 2013*

- Exposing `element` property.
- Fixing immediate animation breaking other animations.

**2.1.0** :: *6th Apr 2013*

- Adding `width` & `height` options.

**2.0.2** :: *5th Apr 2013*

- Removing forgotten toggle event.

**2.0.1** :: *5th Apr 2013*

- Fixing `.to()` method not returning current instance.

**2.0.0** :: *5th Apr 2013*

- Dropping jQuery dependency.
- Adding optional jQuery plugin version of Motio.
- Improved events API.
- Method `.toStart()` - when called on an animation that is already at the start - will repeat the animation from the end. Ditto for the `.toEnd()` method.
- Methods `.toStart()`, `.toEnd()`, and `.to()` now accept callbacks.
- Removed `toStart`, `toEnd`, and `to` events.
- Added reversed sprite based animation playback by passing `true` into the `.play()` method's first argument.

**1.0.0** :: *25th May 2012*

The initial Motio version, dependent on jQuery.