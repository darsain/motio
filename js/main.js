/*global Motio */
jQuery(function ($) {
	'use strict';

	var windowSpy = new $.Espy(window);

	// ==========================================================================
	//   Header clouds
	// ==========================================================================
	(function () {
		var header = $('header')[0];
		var headerClouds = new Motio(header, {
			fps: 30,
			speedX: 60,
			bgWidth: 1024,
			bgHeight: 1024
		});

		// Play only when in the viewport
		windowSpy.add(header, function (entered) {
			headerClouds[entered ? 'play' : 'pause']();
		});
	}());

	// ==========================================================================
	//   Examples
	// ==========================================================================

	// Panning
	(function () {
		var $example = $('#panning .example');
		var frame = $example.find('.frame')[0];
		var offset = $example.offset();
		var motio = new Motio(frame, {
			fps: 30,
			bgWidth: 1024,
			bgHeight: 1024
		});

		// Play/Pause when mouse enters/leaves the frame
		$example.on('mouseenter mouseleave', function (event) {
			if (event.type === 'mouseenter') {
				motio.play();
			} else {
				motio.pause();
			}
		});

		// Update example offset offset on window resize
		$(window).on('resize', function () {
			offset = $example.offset();
		});

		// Update the animation speed & direction based on a cursor position
		$example.on('mousemove', function (event) {
			motio.set('speedX', event.pageX - offset.left - motio.width / 2);
			motio.set('speedY', event.pageY - offset.top - motio.height / 2);
		});
	}());

	// Sprite
	$('a[data-toggle="tab"][href=#sprite]').one('shown', function () {
		var $example = $('#sprite .example');
		var frame = $example.find('.frame')[0];
		var motio = new Motio(frame, {
			fps: 10,
			frames: 14
		});

		// Play when mouse enters the frame, and pause when it leaves
		$example.on('mouseenter mouseleave', function (event) {
			motio[event.type === 'mouseenter' ? 'play' : 'pause']();
		});
	});

	// 360 view
	$('a[data-toggle="tab"][href=#circview]').one('shown', function () {
		var $example = $('#circview .example');
		var exampleLeft = $example.offset().left;
		var exampleWidth = $example.width();
		var frame = $example.find('.frame')[0];
		var motio = new Motio(frame, {
			frames: 18
		});

		// Update example left offset on window resize
		$(window).on('resize', function () {
			exampleLeft = $example.offset().left;
		});

		// Activate frame based on the cursor position
		$example.on('mousemove', function (event) {
			motio.to(Math.floor(motio.frames / exampleWidth * (event.pageX - exampleLeft)), true);
		});
	});

	// Extreme spriting - minigame
	// This is really dumb, and on top of that adapted from older version of Motio, so please ignore.
	$('a[data-toggle="tab"][href=#game]').one('shown', function () {
		var $game = $('#game .frame');
		var pos = 350;
		var $char = $game.find('.char').css({ left: pos + 'px' });
		var posMax = $game.innerWidth() - $char.innerWidth();
		var facing = 'right';
		var moveSpeed = 300;
		var moveFps = 30;
		var pressed = [];
		var inAction = 0;
		var isRunning = 0;
		var mIndex;
		var listenOn = [37,39,32,66];
		var $mations = $char.children();
		var mations = {
			right: {
				stand: $mations.filter('.stand').motio({ frames: 8, startPaused: 1, fps: 10 }),
				run:   $mations.filter('.run'  ).motio({ frames: 6, startPaused: 1, fps: 10 }),
				jump:  $mations.filter('.jump' ).motio({ frames: 10, startPaused: 1, fps: 15 }),
				kick:  $mations.filter('.kick' ).motio({ frames: 9, startPaused: 1, fps: 15 })
			},
			left: {
				stand: $mations.filter('.stand_left').motio({ frames: 8, startPaused: 1, fps: 10 }),
				run:   $mations.filter('.run_left'  ).motio({ frames: 6, startPaused: 1, fps: 10 }),
				jump:  $mations.filter('.jump_left' ).motio({ frames: 10, startPaused: 1, fps: 15 }),
				kick:  $mations.filter('.kick_left' ).motio({ frames: 9, startPaused: 1, fps: 15 })
			}
		};

		// Hide everything on start
		$mations.hide();

		// Start with standing animation
		mations[facing].stand.show().motio('play');

		// Resets the stance back to running or standing after actions like kick
		function resetStance() {
			/*jshint validthis:true */
			inAction = 0;
			$(this.element).hide();
			mations[facing][isRunning ? 'run' : 'stand'].show().motio('play');
		}

		// Keydown handlers
		$(document).on('keydown', function (event) {
			if ($.inArray(event.which, listenOn) === -1 || pressed[event.which]) {
				return;
			}
			pressed[event.which] = true;

			var request;
			switch (event.which) {
				// Left arrow
				case 37:
					request = 'run';
					facing = 'left';
					break;

				// Right arrow
				case 39:
					request = 'run';
					facing = 'right';
					break;

				// Spacebar
				case 32:
					request = 'jump';
					break;

				// B
				case 66:
					request = 'kick';
					break;
			}

			// Show concerned animation
			$mations.hide().motio('toStart', true);
			mations[facing][request].show();

			if (request === 'run') {
				inAction = 0;
				mIndex = clearTimeout(mIndex);
				isRunning = 1;
				move();
				mations[facing][request].motio('play');
			} else {
				inAction = 1;
				mations[facing][request].motio('toEnd', resetStance);
			}

			return false;
		});

		// Keyup handlers
		$(document).on('keyup', function (event) {
			if ($.inArray(event.which, listenOn) === -1) {
				return;
			}
			pressed[event.which] = false;

			var released;
			switch (event.which) {
				// Left & arrow
				case 37:
					released = 'left';
					break;

				// Right arrow
				case 39:
					released = 'right';
					break;
			}

			if (isRunning && facing === released) {
				mations[released].run.hide().motio('toStart', true);
				isRunning = 0;
				mIndex = clearTimeout(mIndex);

				if (!inAction) {
					mations[facing].stand.show().motio('play');
				}
			}
			return false;
		});

		// Move function
		function move() {
			if (pos === 0 && facing === 'left' || pos === posMax && facing === 'right') {
				return;
			}

			pos += (facing === 'right' ? moveSpeed : -moveSpeed) / moveFps;

			if (pos < 0) {
				pos = 0;
			} else if (pos > posMax) {
				pos = posMax;
			}

			$char[0].style.left = pos + 'px';
			mIndex = setTimeout(move, 1000 / moveFps);
		}
	});
});