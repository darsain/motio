/*!
 * jQuery Motio v1.0.1
 * https://github.com/Darsain/motio
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */

/*jshint eqeqeq: true, noempty: true, strict: true, undef: true, expr: true, smarttabs: true, browser: true */
/*global jQuery:false */

;(function($, undefined){
'use strict';

	var pluginName = 'motio',
		namespace = 'plugin_' + pluginName,
		rAF;

	// Plugin "class"
	function Plugin( frame, options ){

		// Private global variables
		var $frame, o, isPan, tIndex, lastTime, frameSize, frames, active, originalBgPos, bgPos, affected, type, to,
			self = this,
			callbacks = !$.Callbacks ? false : {};

		/**
		 * Pause animation
		 *
		 * @public
		 */
		this.pause = function(){

			if( tIndex ){

				tIndex = clearTimeout( tIndex );

				trigger( 'pause' );

			}

		};

		/**
		 * Play animation
		 *
		 * @public
		 */
		this.play = function(){

			if( !tIndex ){

				render();
				trigger( 'play' );

			}

		};

		/**
		 * Pause or Play animation, depending on its current state
		 *
		 * @public
		 */
		this.toggle = function(){

			trigger( 'toggle' );
			self[ tIndex ? 'pause' : 'play' ]();

		};

		/**
		 * Update one of the dynamic option properties
		 *
		 * Only some options can be updated:
		 *  speed, fps
		 *
		 * @public
		 *
		 * @param {String} option Option name
		 * @param {Mixed} value   New option value
		 */
		this.set = function( option, value ){

			var updateable = [ 'speed', 'fps' ];

			if( $.inArray( option, updateable ) !== -1 ){

				o[option] = value;

			}

		};

		/**
		 * Animate or directly set sprite to its first frame and than pause
		 *
		 * @public
		 *
		 * @param {Bool} immediate Move to start immediately without animation
		 */
		this.toStart = function( immediate ){

			if( isPan ){

				return;

			}

			if( immediate || active === 0 ){

				type = false;

				trigger( 'start' );
				self.pause();
				setPos( 0 );

			} else {

				type = 'toStart';

				self.play();

			}

		};


		/**
		 * Animate or directly set sprite to its last frame and than pause
		 *
		 * @public
		 *
		 * @param {Bool} immediate Move to end immediately without animation
		 */
		this.toEnd = function( immediate ){

			if( isPan ){

				return;

			}

			if( immediate || active === frames.length - 1 ){

				type = 0;

				trigger( 'end' );
				self.pause();
				setPos( frames.length -1 );

			} else {

				type = 'toEnd';

				self.play();

			}

		};


		/**
		 * Animate or directly set sprite to passed frame index and than pause
		 *
		 * @public
		 *
		 * @param {Int}  frame     Frame index starting at 0
		 * @param {Bool} immediate Move to end immediately without animation
		 */
		this.to = function( frame, immediate ){

			if( isPan || !isNumber( frame ) || frame < 0 && frame >= frames.length ){

				return;

			}

			if( immediate || frame === active ){

				type = 0;

				trigger( 'to', [ frame ] );
				self.pause();
				setPos( frame );

			} else {

				type = 'to';
				to = frame;

				self.play();

			}

		};

		/**
		 * Binds callbacks to custom event lists using jQuery.Callbacks
		 *
		 * @public
		 *
		 * @param  {String}   eName Event name
		 * @param  {Function} fn    Callback function, or array with functions
		 */
		this.on = function( eName, fn ){

			if( callbacks && fn ){

				if( !callbacks[eName] ){

					callbacks[eName] = $.Callbacks('unique');

				}

				callbacks[eName].add( fn );

			}

		};

		/**
		 * Remove on or all callbacks from custom event list
		 *
		 * @public
		 *
		 * @param  {String}   eName Event name
		 * @param  {Function} fn    Callback function to be removed. If nothing is passed, all callbacks for 'eName' will be removed
		 */
		this.off = function( eName, fn ){

			if( callbacks && callbacks[eName] ){

				if( fn ){

					callbacks[eName].remove( fn );

				} else {

					callbacks[eName].empty();

				}

			}

		};

		/**
		 * Trigger callbacks from custom event list
		 *
		 * @public
		 *
		 * @param  {String} eName Event name
		 * @param  {Array}  args  Array with arguments for callback functions
		 */
		function trigger( eName, args ){

			if( callbacks && callbacks[eName] ){

				callbacks[eName].fireWith( frame, args );

			}

			$frame.trigger( pluginName + ':' + eName, args );

		}

		/**
		 * Destroy plugin instance and reset backgroundPosition to its original state
		 *
		 * @public
		 */
		this.destroy = function(){

			self.pause();
			$frame.css('backgroundPosition', originalBgPos);
			$.removeData( frame, namespace );

		};

		/**
		 * Render animation frame
		 *
		 * @public
		 */
		function render(){

			var newpos;

			// Call next frame
			tIndex = setTimeout( function(){

				rAF( render );

			}, 1000 / o.fps );


			if( isPan ){

				bgPos[affected] = bgPos[affected] + ( o.speed / o.fps );

				if( o.bgSize > 0 && Math.abs( bgPos[affected] ) > o.bgSize ){

					bgPos[affected] = bgPos[affected] % o.bgSize;

				}

				newpos = bgPos;

			} else {

				switch( type ){

					case 'toStart':

						if( --active <= 0 ){

							type = active = 0;

							self.pause();

							trigger( 'start' );

						}

					break;

					case 'toEnd':

						if( ++active >= frames.length -1 ){

							type = 0;
							active = frames.length - 1;

							self.pause();

							trigger( 'end' );

						}

					break;

					case 'to':

						if( active < to ){

							active++;

						} else if( active > to ){

							active--;

						}

						if( active === to ){

							trigger( 'to', [ frame ] );
							self.pause();

						}

					break;

					default:

						if( ++active >= frames.length ){

							active = 0;

						}

				}

				newpos = active;

			}

			// Update background position
			setPos( newpos );

		}


		/**
		 * Set frame position
		 *
		 * @param {Mixed} arg Frame index in 'frames' array, or position object
		 */
		function setPos( arg ){

			var pos = !isPan && isNumber( arg ) ? frames[arg] : typeof arg === 'object' ? arg.x + 'px ' + arg.y + 'px' : false;

			if( pos ){

				frame.style.backgroundPosition = pos;

				if( !isPan ){

					active = arg;

				}

				trigger( 'frame', isPan ? [ arg[affected], o.bgSize ] : [ arg, frames.length ] );

			}

		}


		/**
		 * Check whether the value is a number
		 *
		 * @private
		 *
		 * @param  {Mixed}  value Value to be checked
		 *
		 * @return {Boolean} True if number, false if not
		 */
		function isNumber( value ){

			return !isNaN( parseFloat( value ) ) && isFinite( value );

		}


		/** Construct */
		(function(){

			// Set variables
			$frame    = $(frame);
			o         = $.extend( {}, $.fn[pluginName].defaults, options );
			isPan     = !o.frames;
			tIndex    = 0;
			frameSize = $frame[ o.vertical ? 'innerHeight' : 'innerWidth' ]();
			affected  = o.vertical ? 'y' : 'x';
			originalBgPos = $frame.css('backgroundPosition') || $frame.css('backgroundPositionX') + ' ' + $frame.css('backgroundPositionY');

			// Background position
			var posString = originalBgPos.replace(/left|top/g, 0).split(" ");
			bgPos = {
				x: parseInt( posString[0], 10 ),
				y: parseInt( posString[1], 10 )
			};

			// Build frames array
			if( !isPan ){

				var tmpPos = bgPos;
				frames = [];

				for( var i = 0; i < o.frames; i++ ){

					tmpPos[affected] = i * -frameSize;

					frames.push( tmpPos.x + 'px ' + tmpPos.y + 'px' );

				}

				active = -1;

			}

			// Start animation
			if( !o.paused ){

				lastTime = 0;
				render();

			}

		}());

	}


	// jQuery plugin extension
	$.fn[pluginName] = function( options, returnInstance ){

		var method = false,
			methodArgs,
			instances = [];

		// Basic attributes logic
		if( typeof options !== 'undefined' && !$.isPlainObject( options ) ){
			method = options === false ? 'destroy' : options;
			methodArgs = arguments;
			Array.prototype.shift.call( methodArgs );
		}

		// Apply requested actions on all elements
		this.each(function( i, e ){

			// Plugin call with prevention against multiple instantiations
			var plugin = $.data( e, namespace );

			if( plugin && method ){

				// Call plugin method
				if( plugin[method] ){

					plugin[method].apply( plugin, methodArgs );

				}

			} else if( !plugin && !method ){

				// Create a new plugin object if it doesn't exist yet
				plugin =  $.data( e, namespace, new Plugin( e, options ) );

			}

			// Push plugin to instances
			instances.push( plugin );

		});

		// Return chainable jQuery object, or plugin instance(s)
		return returnInstance && !method ? instances.length > 1 ? instances : instances[0] : this;

	};


	// Default options
	$.fn[pluginName].defaults = {
		// global options
		fps:      15,    // frames per second - bigger number means smoother animations but higher CPU load
		vertical: 0,     // true for vertical sprites
		paused:   0,     // whether to start motio paused

		// sprite based animation specific options ("frames === 0" means that you are requesting panning animation)
		frames:   0,     // number of frames in sprite

		// pan specific options
		speed:    50,    // number of pixels to move per second (use negative number to go in an opposite direction)
		bgSize:   0      // size of the background image in animated direction (width for horizontal, height for vertical)
						 // it is needed so the script will know when to reset the background position to 0, and thus not overflow the JavaScript 2^53 integer limit
						 // when 0 (=unknown), the position will iterate into ridiculous numbers, which might eventually result into a buggy animation later on...
	};


	// local requestAnimationFrame polyfill
	(function(){

		var lastTime = 0,
			vendors = ['ms', 'moz', 'webkit', 'o'];

		for( var x = 0; x < vendors.length && !rAF; ++x ){
			rAF = window[vendors[x]+'RequestAnimationFrame'];
		}

		if( !rAF ){
			rAF = function( callback, element ){
				var currTime = new Date().getTime(),
					timeToCall = Math.max(0, 16 - ( currTime - lastTime ));
				lastTime = currTime + timeToCall;
				return setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
			};
		}


	}());

})(jQuery);