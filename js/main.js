jQuery(function($){

	// -----------------------------------------------------------------------------------
	//   Examples
	// -----------------------------------------------------------------------------------

	$('#examples').find('.motiowrap').each(function(i,el){

		var $wrap = $(this),
			$frame = $wrap.filter('.motio').add( $wrap.find('.motio') ).eq(0),
			options = $frame.data('motio'),
			$buttons = $wrap.find('[data-action]'),
			$ranges = $wrap.find('.range'),
			stats = new Stats();

		// Stats
		stats.domElement.style.position = 'absolute';
		if( $frame.is('#pan') ){

			stats.domElement.style.right = '10px';
			stats.domElement.style.bottom = '10px';

		} else {

			stats.domElement.style.left = '-90px';
			stats.domElement.style.top = '0';

		}
		$frame.append( stats.domElement );

		function frame(){

			stats.begin();
			stats.end();

		}

		var inst = $frame.motio( options, true );
		inst.on('frame', frame);

		$buttons.on('click', function(i,event){

			var $button = $(this),
				action = $button.data('action'),
				prop = $button.data('property'),
				value = $button.data('value');

			switch( action ){

				case 'set':
					$frame.motio( action, prop, value );
				break;

				default:
					$frame.motio( action );

			}

		});

		$ranges.on('change', function(i,event){

			var $el = $(this),
				prop = $el.attr('name'),
				value = $el.val();

			$frame.motio( 'set', prop, value / 1 );

		});


	});

	// Minigame
	function gameInit(){

		var $game = $('#game'),
			pos = 400,
			$char = $game.find('.char').css({ left: pos + 'px' }),
			posMax = $game.innerWidth() - $char.innerWidth(),
			facing = 'right',
			moveSpeed = 300,
			moveFps = 30,
			pressed = [],
			inAction = 0,
			inRunning = 0,
			mIndex,
			listenOn = [37,39,32,66],
			$mations = $char.children().hide(),
			mations = {
				right: {
					stand: $mations.filter('.stand').motio({ frames: 8, paused: 1, fps: 10 }),
					run:   $mations.filter('.run'  ).motio({ frames: 6, paused: 1, fps: 10 }),
					jump:  $mations.filter('.jump' ).motio({ frames: 10, paused: 1, fps: 15 }),
					kick:  $mations.filter('.kick' ).motio({ frames: 9, paused: 1, fps: 15 })
				},
				left: {
					stand: $mations.filter('.stand_left').motio({ frames: 8, paused: 1, fps: 10 }),
					run:   $mations.filter('.run_left'  ).motio({ frames: 6, paused: 1, fps: 10 }),
					jump:  $mations.filter('.jump_left' ).motio({ frames: 10, paused: 1, fps: 15 }),
					kick:  $mations.filter('.kick_left' ).motio({ frames: 9, paused: 1, fps: 15 })
				}
			};

		// Start with standing animation
		mations[facing].stand.show().motio('play');

		// On actions end
		$mations.not('.stand,.stand_left,.run,.run_left').motio('on', 'end', function(){

			inAction = 0;
			$(this).hide();
			mations[facing][ inRunning ? 'run' : 'stand' ].show().motio('play');

		});

		// Keydown handlers
		$(document).on('keydown', function(event){

			if( $.inArray( event.which, listenOn ) === -1 || pressed[event.which]  ){

				return;

			}

			pressed[event.which] = true;

			var request;

			switch( event.which ){

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

			if( request === 'run' ){

				inAction = 0;
				mIndex = clearTimeout( mIndex );
				inRunning = 1;
				move();

			} else {

				inAction = 1;

			}

			$mations.hide().motio('toStart', true);
			mations[facing][request].show().motio( request === 'run' ? 'play' : 'toEnd' );

			return false;

		});

		// Keyup handlers
		$(document).on('keyup', function(event){

			if( $.inArray( event.which, listenOn ) === -1 ){

				return;

			}

			pressed[event.which] = false;

			var released;

			switch(event.which){

				// Left & arrow
				case 37:
					released = 'left';
				break;

				// Right arrow
				case 39:
					released = 'right';
				break;

			}

			if( inRunning && facing === released ){

				mations[released].run.hide().motio('toStart', true);

				inRunning = 0;
				mIndex = clearTimeout( mIndex );

				if( !inAction ){

					mations['left'].stand.add(mations['right'].stand).motio('toStart', true);
					mations[facing].stand.show().motio('play');

				}

			}

			return false;

		});

		// Move function
		function move(){

			if( pos === 0 && facing === 'left' || pos === posMax && facing === 'right' ){
				return;
			}

			pos += ( facing === 'right' ? moveSpeed : -moveSpeed ) / moveFps;

			if( pos < 0 ){
				pos = 0;
			}
			if( pos > posMax ){
				pos = posMax;
			}

			$char[0].style.left = pos + 'px ';

			mIndex = setTimeout( move, 1000 / moveFps );

		}

	}

	// Initiate game only on tab activation
	(function(){

		var gameIsActivated = 0;

		$(document).on('activated', function(e, section){

			if( !gameIsActivated && section === 'minigame' ){

				gameIsActivated = 1;

				gameInit();

			}

		});

	}());


	// -----------------------------------------------------------------------------------
	//   Page navigation
	// -----------------------------------------------------------------------------------

	// Navigation
	var $nav = $('#nav'),
		$sections = $('#sections').children(),
		activeClass = 'active';

	// Tabs
	$nav.on('click', 'a', function(e){
		e.preventDefault();
		activate( $(this).attr('href').substr(1) );
	});

	// Back to top button
	$('a[href="#top"]').on('click', function(e){
		e.preventDefault();
		$(document).scrollTop(0);
	});

	// Activate a section
	function activate( sectionID, initial ){

		sectionID = sectionID && $sections.filter('#'+sectionID).length ? sectionID : $sections.eq(0).attr('id');
		$nav.find('a').removeClass(activeClass).filter('[href=#'+sectionID+']').addClass(activeClass);
		$sections.hide().filter('#'+sectionID).show();

		if( !initial ){
			window.location.hash = '!' + sectionID;
		}

		$(document).trigger('activated', [ sectionID ] );

	}

	// Activate initial section
	activate( window.location.hash.match(/^#!/) ? window.location.hash.substr(2) : 0, 1 );


	// -----------------------------------------------------------------------------------
	//   Additional plugins
	// -----------------------------------------------------------------------------------

	// Trigger prettyPrint
	prettyPrint();

	// Range inputs
	$('input.range').rangeinput().show();

});