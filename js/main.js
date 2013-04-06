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
		var $frame = $('.examples .panning');
		var offset = $frame.offset();
		var motio = new Motio($frame[0], {
			fps: 60,
			bgWidth: 1024,
			bgHeight: 1024
		});

		// Play when mouse enters the frame, and pause when it leaves
		$frame.on('mouseenter mouseleave', function (event) {
			offset = $frame.offset();
			motio[event.type === 'mouseenter' ? 'play' : 'pause']();
		});

		// Update animation speed & direction based on a cursor position
		$frame.on('mousemove', function (event) {
			motio.set('speedX', event.pageX - offset.left - motio.width / 2);
			motio.set('speedY', event.pageY - offset.top - motio.height / 2);
		});
	}());

	// Sprite
	(function () {
		var $frame = $('.examples .sprite');
		var motio = new Motio($frame[0], {
			frames: 14,
			fps: 60
		});

		// Play when mouse enters the frame, and pause when it leaves
		$frame.on('mouseenter mouseleave', function (event) {
			motio[event.type === 'mouseenter' ? 'play' : 'pause']();
		});
	}());
});