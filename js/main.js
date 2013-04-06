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
	$('a[data-toggle="tab"][href=#circview]').one('shown', function () { console.log('asd');
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
});