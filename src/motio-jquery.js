/*!
 * motio 2.2.2 - 7th Aug 2014
 * https://github.com/darsain/motio
 *
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 */
;
(function (w, undefined) {
  'use strict';

  var className = 'Motio';

  // Local WindowAnimationTiming interface polyfill
  var cAF = w.cancelAnimationFrame || w.cancelRequestAnimationFrame;
  var rAF = w.requestAnimationFrame;
  (function () {
    var vendors = ['moz', 'webkit', 'o'];
    var lastTime = 0;

    // For a more accurate WindowAnimationTiming interface implementation, ditch the native
    // requestAnimationFrame when cancelAnimationFrame is not present (older versions of Firefox)
    for (var i = 0, l = vendors.length; i < l && !cAF; ++i) {
      cAF = w[vendors[i] + 'CancelAnimationFrame'] || w[vendors[i] + 'CancelRequestAnimationFrame'];
      rAF = cAF && w[vendors[i] + 'RequestAnimationFrame'];
    }

    if (!cAF) {
      rAF = function (callback) {
        var currTime = +new Date();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        lastTime = currTime + timeToCall;
        return w.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);
      };

      cAF = function (id) {
        clearTimeout(id);
      };
    }
  }());

  // Returns time in as precise manner as possible
  var getTime = (function () {
    var perf = w.performance;
    if (perf && perf.now) return perf.now.bind(perf);
    return function () {
      return +new Date();
    };
  }());

  /**
   * Motio.
   *
   * @class
   *
   * @param {Element} element       DOM element with animation background.
   * @param {Object}  options     Object with plugin options.
   * @param {Object}  callbackMap Callbacks map.
   */
  function Motio(element, options) {
    // Options
    var o = defaults(options);

    // Private variables
    var self = this;
    var isPan = !o.frames;
    var frames = [];
    var callbacks = {};
    var animation = {};
    var active = 0;
    var pos, bgPos, lastPos, frameID, i, l;

    // Exposed properties
    self.element = element;
    self.width = o.width || element.clientWidth;
    self.height = o.height || element.clientHeight;
    self.options = o;
    self.isPaused = true;

    /**
     * Pause animation.
     *
     * @return {Object} Motio instance.
     */
    self.pause = function () {
      cAF(frameID);
      frameID = 0;
      animation.lastFrame = 0;
      if (!self.isPaused) {
        self.isPaused = true;
        trigger('pause');
      }
      return self;
    };

    /**
     * Play animation.
     *
     * @param {Boolean} reversed Reversed animation.
     *
     * @return {Object} Motio instance.
     */
    self.play = function (reversed) {
      animation.finite = false;
      animation.callback = undefined;
      animation.immediate = false;
      resume(reversed);
      return self;
    };

    /**
     * Request rendering when paused.
     *
     * @param {Boolean} reversed Reversed animation.
     *
     * @return {Void}
     */
    function resume(reversed) {
      animation.reversed = reversed;
      if (!frameID) {
        self.isPaused = false;
        trigger('play');
        frameID = rAF(render);
      }
    }

    /**
     * Toggle animation.
     *
     * @return {Object} Motio instance.
     */
    self.toggle = function () {
      self[frameID ? 'pause' : 'play']();
      return self;
    };

    /**
     * Animate to the first frame and pause.
     *
     * @param {Boolean}  immediate Reposition immediately without animation.
     * @param {Function} callback  Execute a callback on arrival.
     *
     * @return {Object} Motio instance.
     */
    self.toStart = function (immediate, callback) {
      return self.to(0, immediate, callback);
    };

    /**
     * Animate to the last frame and pause.
     *
     * @param {Boolean}  immediate Reposition immediately without animation.
     * @param {Function} callback  Execute a callback on arrival.
     *
     * @return {Object} Motio instance.
     */
    self.toEnd = function (immediate, callback) {
      return self.to(frames.length - 1, immediate, callback);
    };

    /**
     * Animate to a specified frame index and pause.
     *
     * @param {Integer}  frame     Frame index starting at 0.
     * @param {Boolean}  immediate Reposition immediately without animation.
     * @param {Function} callback  Execute a callback on arrival.
     *
     * @return {Object} Motio instance.
     */
    self.to = function (frame, immediate, callback) {
      if (isPan || !isNumber(frame) || frame < 0 || frame >= frames.length) {
        return self;
      }

      // Handle optional argument
      if (type(immediate) === 'function') {
        callback = immediate;
        immediate = false;
      }

      // Handle cases where the requested animation is already active
      if (frame === active) {
        if (frame === 0) {
          active = frames.length;
        } else if (frame === frames.length - 1) {
          active = -1;
        } else {
          if (type(callback) === 'function') {
            callback.call(self);
          }
          self.pause();
          return self;
        }
      }

      // Update animation object
      animation.finite = true;
      animation.to = frame;
      animation.immediate = !!immediate;
      animation.callback = callback;

      // Resume rendering if paused
      resume();

      return self;
    };

    /**
     * Determine position for next frame.
     *
     * @return {Void}
     */
    function positionTick() {
      if (isPan) {
        pos.x += o.speedX / o.fps;
        pos.y += o.speedY / o.fps;
        if (o.bgWidth && Math.abs(pos.x) > o.bgWidth) {
          pos.x = pos.x % o.bgWidth;
        }
        if (o.bgHeight && Math.abs(pos.y) > o.bgHeight) {
          pos.y = pos.y % o.bgHeight;
        }
      } else {
        if (animation.finite) {
          if (animation.immediate) {
            active = animation.to;
          } else {
            active += active > animation.to ? -1 : 1;
          }
        } else {
          if (animation.reversed) {
            if (--active <= 0) {
              active = frames.length - 1;
            }
          } else {
            if (++active >= frames.length) {
              active = 0;
            }
          }
        }
        // Update active frame property
        self.frame = active;
      }
    }

    /**
     * Render animation frame.
     *
     * @return {Void}
     */
    function render() {
      frameID = rAF(render);
      var time = getTime();

      // Don't render when it's not time for next frame yet
      if (o.fps < 60 && animation.lastFrame && animation.lastFrame + (1000 / o.fps) + 1 > time) return;

      animation.lastFrame = time;
      positionTick();

      // Prepare new background position
      bgPos = isPan ? Math.round(pos.x) + 'px ' + Math.round(pos.y) + 'px' : frames[active];

      // Update the position only when there is a change
      // to not cause redundant reflows & repaints
      if (bgPos !== lastPos) {
        element.style.backgroundPosition = lastPos = bgPos;
      }

      // Trigger frame event
      trigger('frame');

      // When arrived to a finite animation destination, pause & execute the callback
      if (animation.finite && animation.to === active) {
        self.pause();
        if (type(animation.callback) === 'function') {
          animation.callback.call(self);
        }
      }
    }

    /**
     * Update one of the dynamic option properties.
     *
     * Only these options can be updated:
     *  speed, fps
     *
     * @param {String} option Option name.
     * @param {Mixed}  value  New option value.
     *
     * @return {Object} Motio instance.
     */
    self.set = function (option, value) {
      o[option] = value;
      return self;
    };

    /**
     * Registers callbacks.
     *
     * @param  {Mixed} name Event name, or callbacks map.
     * @param  {Mixed} fn   Callback, or an array of callback functions.
     *
     * @return {Object} Motio instance.
     */
    self.on = function (name, fn) {
      // Callbacks map
      if (type(name) === 'object') {
        for (var key in name) {
          if (name.hasOwnProperty(key)) {
            self.on(key, name[key]);
          }
        }
        // Callback
      } else if (type(fn) === 'function') {
        var names = name.split(' ');
        for (var n = 0, nl = names.length; n < nl; n++) {
          callbacks[names[n]] = callbacks[names[n]] || [];
          if (callbackIndex(names[n], fn) === -1) {
            callbacks[names[n]].push(fn);
          }
        }
        // Callbacks array
      } else if (type(fn) === 'array') {
        for (var f = 0, fl = fn.length; f < fl; f++) {
          self.on(name, fn[f]);
        }
      }
      return self;
    };

    /**
     * Remove one or all callbacks.
     *
     * @param  {String} name Event name.
     * @param  {Mixed}  fn   Callback, or an array of callback functions. Omit to remove all callbacks.
     *
     * @return {Object} Motio instance.
     */
    self.off = function (name, fn) {
      if (fn instanceof Array) {
        for (var f = 0, fl = fn.length; f < fl; f++) {
          self.off(name, fn[f]);
        }
      } else {
        var names = name.split(' ');
        for (var n = 0, nl = names.length; n < nl; n++) {
          callbacks[names[n]] = callbacks[names[n]] || [];
          if (type(fn) === 'undefined') {
            callbacks[names[n]].length = 0;
          } else {
            var index = callbackIndex(names[n], fn);
            if (index !== -1) {
              callbacks[names[n]].splice(index, 1);
            }
          }
        }
      }
      return self;
    };

    /**
     * Returns callback array index.
     *
     * @param  {String}   name Event name.
     * @param  {Function} fn   Function
     *
     * @return {Int} Callback array index, or -1 if isn't registered.
     */
    function callbackIndex(name, fn) {
      for (i = 0, l = callbacks[name].length; i < l; i++) {
        if (callbacks[name][i] === fn) {
          return i;
        }
      }
      return -1;
    }

    /**
     * Trigger callbacks for event.
     *
     * @param  {String} name Event name.
     * @param  {Mixed}  argX Arguments passed to callbacks.
     *
     * @return {Void}
     */
    function trigger(name, arg1) {
      if (callbacks[name]) {
        for (i = 0, l = callbacks[name].length; i < l; i++) {
          callbacks[name][i].call(self, name, arg1);
        }
      }
    }

    /**
     * Returns a computed style property of a frame element.
     *
     * @param {String}  name Property name.
     *
     * @return {String}
     */
    function getProp(name) {
      return w.getComputedStyle ? w.getComputedStyle(element, null)[name] : element.currentStyle[name];
    }

    /**
     * Destroy plugin instance and reset backgroundPosition to its original state
     *
     * @public
     */
    self.destroy = function () {
      self.pause();
      element.style.backgroundPosition = '';
      return self;
    };

    /**
     * Construct.
     */
    (function () {
      // Background position
      var posString = (
        getProp('backgroundPosition') ||
        getProp('backgroundPositionX') + ' ' + getProp('backgroundPositionY')
      ).replace(/left|top/gi, 0).split(' ');
      pos = {
        x: getInt(posString[0]),
        y: getInt(posString[1])
      };

      // Build frames array
      if (!isPan) {
        frames.length = 0;
        for (var i = 0; i < o.frames; i++) {
          if (o.vertical) {
            pos.y = i * -self.height;
          } else {
            pos.x = i * -self.width;
          }
          frames.push(pos.x + 'px ' + pos.y + 'px');
        }
        // Expose sprite mode properties
        self.frames = frames.length;
        self.frame = 0;
      } else {
        // Expose panning mode properties
        self.pos = pos;
      }
    }());
  }

  /**
   * Return type of the value.
   *
   * @param  {Mixed} value
   *
   * @return {String}
   */
  function type(value) {
    if (value == null) {
      return String(value);
    }
    if (typeof value === 'object' || typeof value === 'function') {
      return (value instanceof w.NodeList && 'nodelist') ||
        (value instanceof w.HTMLCollection && 'htmlcollection') ||
        Object.prototype.toString.call(value).match(/\s([a-z]+)/i)[1].toLowerCase();
    }
    return typeof value;
  }

  /**
   * Check if variable is a number.
   *
   * @param {Mixed} value
   *
   * @return {Boolean}
   */
  function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  /**
   * Fills unassigned option properties with default values. Does 1 level deep object clone.
   *
   * @param  {Object} options
   *
   * @return {Void}
   */
  function defaults(options) {
    var output = {};
    options = type(options) === 'object' ? options : {};
    for (var key in Motio.defaults) {
      output[key] = (options.hasOwnProperty(key) ? options : Motio.defaults)[key];
    }
    return output;
  }

  /**
   * Parse integer out of a string.
   *
   * @param  {Mixed} value
   *
   * @return {Int}
   */
  function getInt(value) {
    return 0 | parseInt(value, 10);
  }

  // Expose class globally
  w[className] = Motio;

  // Default options
  Motio.defaults = {
    fps: 15, // Frames per second.

    // Sprite animation specific options
    frames: 0, // Number of frames in sprite.
    vertical: 0, // Tells Motio that you are using vertically stacked sprite image.
    width: 0, // Set the frame width manually (optional).
    height: 0, // Set the frame height manually (optional).

    // Panning specific options
    speedX: 0, // Horizontal panning speed in pixels per second.
    speedY: 0, // Vertical panning speed in pixels per second.
    bgWidth: 0, // Width of the background image (optional).
    bgHeight: 0 // Height of the background image (optional).
  };
})(window);

/*!
 * jQuery-Sprite - 16th Out 2015
 * https://github.com/miamarti/jquery-sprite-animation
 *
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 */
(function ($) {

  var isIE9 = function () {
    return navigator.appVersion.indexOf("MSIE 9") > 0;
  };

  var $ds = function (T) {
    return {
      set: function (name, value) {
        try {
          $(T)[0].dataset[name.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
          })] = value;
        } catch (e) {
          $(T).attr('data-' + name, value);
        }
      },
      get: function (name) {
        var result;
        try {
          result = $(T)[0].dataset[name.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
          })];
        } catch (e) {
          result = $(T).attr('data-' + name);
        }
        return result;
      },
      is: function (name, value) {
        var result;
        try {
          result = ($(T)[0].dataset[name.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
          })] === value);
        } catch (e) {
          result = ($(T).attr('data-' + name) === value);
        }
        return result;
      },
      hasOwnProperty: function (name) {
        var result = false;
        try {
          result = $(T)[0].dataset.hasOwnProperty('name');
        } catch (e) {
          result = ($(T).attr('data-' + name) !== undefined && $(T).attr('data-' + name) !== '' && $(T).attr('data-' + name) !== null);
        }
        return result;
      }
    };
  };
  $.fn.sprite = function (options) {

    var defaults = {
      slide: 1
    };
    var settings = $.extend({}, defaults, options);
    if (!$ds(this).hasOwnProperty('slide')) {
      $ds(this).set('slide', 1);
    }
    if (!$ds(this).hasOwnProperty('cycle')) {
      $ds(this).set('cycle', 0);
    }

    var $this = this;
    var $core = {
      elmt: $this[0],
      config: undefined,
      sprite: undefined,
      isEnd: false,
      cycle: 0,

      main: function (config) {
        $core.setConfig(config);
        $core.createElements();
        $core.createObject();
      },

      setConfig: function (config) {
        $core.config = config;
      },

      createElements: function () {
        $core.createTemps();
        $core.createStyles();
      },

      createTemps: function () {
        var tempDiv = document.createElement("div");
        tempDiv.setAttribute('class', 'slide-tmp');
        tempDiv.setAttribute('data-slide', $core.config.sld);
        for (var key in $core.config.cycles) {
          tempDiv.appendChild(document.createElement("div"));
        }
        document.body.appendChild(tempDiv);
      },

      createStyles: function () {

        var finalUrlOfSlide = '';
        var sheet = document.createElement('style');
        sheet.setAttribute('data-ref', 'jquerySprite');
        var context = '[data-slide="' + $core.config.sld + '"]';

        var innerSheet = '';
        innerSheet += context + '.slide-tmp{';
        innerSheet += '    width: 0px;';
        innerSheet += '    height: 0px;';
        innerSheet += '    position: fixed;';
        innerSheet += '    left: 0px;';
        innerSheet += '    top: 0px;';
        innerSheet += '    opacity: 0;';
        innerSheet += '    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity = 0);';
        innerSheet += '    filter: alpha(opacity = 0);';
        innerSheet += '}';

        for (var key in $core.config.cycles) {
          innerSheet += context + '.slide-tmp div:nth-of-type(' + ($core.cycle + 1) + '){';
          innerSheet += '    background: url("' + $core.config.cycles[key].url + '") 0 0 no-repeat;';
          innerSheet += '}';

          innerSheet += context + '[data-cycle="' + $core.cycle + '"]{';
          innerSheet += '    background: url("' + $core.config.cycles[key].url + '") 0 0 no-repeat;';
          innerSheet += '}';

          finalUrlOfSlide = $core.config.cycles[key].url;
          $core.cycle++;
        }

        innerSheet += context + '{';
        innerSheet += '    background: url("' + finalUrlOfSlide + '") no-repeat;';
        innerSheet += '    background-position: 0 0;';
        innerSheet += '}';

        innerSheet += '.is-end-cicle {';
        innerSheet += '    background-position: right 0 !important;';
        innerSheet += '}';

        sheet.innerHTML = innerSheet;
        document.body.appendChild(sheet);
      },

      createObject: function () {
        $core.reset();

        if ($core.sprite && $core.sprite.destroy) {
          $core.sprite.destroy();
        }
        $core.sprite = new Motio($core.elmt, $core.config);

        $core.sprite.on('frame', function () {
          if (this.frame === 0) {
            $ds($core.elmt).set('cycle', parseInt($ds($core.elmt).get('cycle')) + 1);
            if ($ds($core.elmt).is('cycle', $core.cycle.toString())) {
              this.to(1, true);
              $core.isEnd = true;
              $this.addClass('is-end-cicle');
            }
          }
          if ($core.config.hasOwnProperty('onFrame')) {
            $core.config.onFrame(this);
          }
        });

        if ($core.config.hasOwnProperty('onPlay')) {
          $core.config.onPlay(this);
        }

        if ($core.config.hasOwnProperty('onPause')) {
          $core.config.onPause(this);
        }
      },

      reset: function () {
        $this.removeClass('is-end-cicle');
        if ($core.isEnd) {
          $ds($core.elmt).set('cycle', 0);
          $core.isEnd = false;
        }
      },

      toggle: function () {
        $core.reset();
        $core.sprite.toggle();
      },

      play: function () {
        $core.reset();
        $core.sprite.play();
      },

      pause: function () {
        $core.reset();
        $core.sprite.pause();
      },

      destroy: function () {
        $('[data-ref="jquerySprite"]').remove();
        $('.slide-tmp').remove();
        $ds($core.elmt).set('cycle', 0);
        $core.reset();
        $core.sprite.destroy();
        if (isIE9) {
          delete $this['play'];
          delete $this['pause'];
          delete $this['toggle'];
          delete $this['destroy'];
        } else {
          delete $this.__proto__['play'];
          delete $this.__proto__['pause'];
          delete $this.__proto__['toggle'];
          delete $this.__proto__['destroy'];
        }
      }
    };

    if (!this || !this.hasOwnProperty('play')) {
      $core.main(settings);
      if (isIE9) {
        this['play'] = $.proxy($core.play, $core);
        this['pause'] = $.proxy($core.pause, $core);
        this['toggle'] = $.proxy($core.toggle, $core);
        this['destroy'] = $.proxy($core.destroy, $core);
      } else {
        this.__proto__['play'] = $.proxy($core.play, $core);
        this.__proto__['pause'] = $.proxy($core.pause, $core);
        this.__proto__['toggle'] = $.proxy($core.toggle, $core);
        this.__proto__['destroy'] = $.proxy($core.destroy, $core);
      }
    }

    return $this;
  };
}(jQuery));
