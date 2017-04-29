window.onload = function( ) {
	AppInit( ).navigationList( "nav-sections", "btn-" );
	AppInit( ).navigationList( "toggle-sections", "tg-" );
	AppInit( ).navigationList( "next-section", "next-" );
	AppInit( ).navigationList( "nav-home", "btn-" );
	AppInit( ).navigationToggle( );
	AppInit( ).workSection( );
	AppInit( ).smoothScrolling( );
	AppInit( ).gallery1( "gallery1" );
	AppInit( ).gallery2( );

}

window.onscroll = function( ) {
	let container = document.body;
	let navigation = document.getElementById( "nav-container" );
	let content = document.getElementById( "content" );

	if( container.scrollTop > 1 ) {
		navigation.setAttribute( "class", "floating-nav" );
		content.setAttribute( "class", "floating-offset" );

	} else {
		navigation.setAttribute( "class", "" );
		content.setAttribute( "class", "" );
	}

	if( container.scrollTop > 767 && container.scrollTop < 1500 ||
		container.scrollTop > 2014 && container.scrollTop < 3360 ||
		container.scrollTop > 4120 && container.scrollTop < 5154 ) {
		CSSUtility.addClass( "nav-container", "dropShadow" );
	}
}


/* ===============================================
	APPLICATION SESSION STATE
=============================================== */
let AppSessionState = {
	nav_section : {}		//Holds all the navigation button
}


function AppInit( ) {
	/*\
	|*|	Find all the buttons in the navigation that matches the id "btn-*"
	|*|
	|*|	@navigationId	- Refers to the navigation container.
	|*| @prefix			- id prefix for individual buttons
	\*/
	function navigationList( navigationId, prefix ) {
		let navigationList = document.getElementById( navigationId ).children;
		let list = [];

		//===============================
		// Retrieve All Navigation Tabs
		//===============================
		for( var i = 0; i < navigationList.length; i++ ) {
			if( ( navigationList[ i ].id ).match( prefix ) ) {
				let id = document.getElementById( navigationList[ i ].id ).dataset["s"];
				let section = document.getElementById( id );
				AppSessionState.nav_section[ navigationList[ i ].id ] = id;
			}
		}
	}


	/*\
	|*|	Setup the navigation toggle button.  This button only seen when screen is too small.
	\*/
	function initNavigationToggle( ) {
		let nav_icon = document.getElementById( "nav-bar" );
		let hidden_menu = document.getElementById( "hidden-menu" );
		hidden_menu.style.display = "none";

		nav_icon.addEventListener( 'click', function( ) {
			if( hidden_menu.style.display === "none" ) {
				hidden_menu.style.display = "block";
			} else {
				hidden_menu.style.display = "none";
			}
		} );
	}


	/*\
	|*| Section 4 - WORKS
	|*| 	Adding eventListener to board-member, advisor, awards, and fellowships
	|*| 
	\*/
	function initWorkSection( ) {
		let workButton = [ "board-member", "advisor", "award", "fellowship" ];

		for( var i = 0; i < workButton.length; i++ ) {
			document.getElementsByName( workButton[i] ).forEach( ( element ) => {
				let info = element.children[1];

				element.children[0].addEventListener( 'click', ( e ) => {
					if( isOpened( info ) ) {
						smoothClose( info );
					} else {
						let height = heightSample( info );
						smoothOpen( info, height );
					}
				});
			});
		}
		

		function heightSample( obj ) {
			let tempClass = obj.getAttribute( "class" );
			let height = 0;

			obj.setAttribute( "class", "test" );
			height = obj.clientHeight;
			obj.setAttribute( "class", tempClass );

			return height;
		}

		function isOpened( obj ) {
			return obj.getAttribute( "class" ).match( /open-info/ ) ? true : false;
		}


		function smoothOpen( elementObj, openHeight ) {
			const frame = new FrameRegulator( 60, 100 );

			let heightPerSecond = openHeight / frame.getFPS( );
			let newHeight = 0;

			let paddingPerSecond = 10 / frame.getFPS( );		
			let newPad = 0;

			let scrollIntervalId = setInterval( ( ) => {
				newPad += paddingPerSecond;
				elementObj.style.paddingTop = Math.ceil( newPad ) + "px";
				elementObj.style.paddingBottom = Math.ceil( newPad ) + "px";

				newHeight += Math.round( heightPerSecond );
				elementObj.style.height = newHeight + "px";

				if( elementObj.style.height.replace( /[a-z]/g, "" ) >= openHeight ) {
					elementObj.setAttribute( "class", "open-info" );
					clearInterval( scrollIntervalId );
				}
			}, frame.calcFPS( ) );
		}

		function smoothClose( elementObj ) {
			const frame = new FrameRegulator( 60, 100 );


			let sampleHeight = elementObj.clientHeight - 20;
			let heightPerSecond = sampleHeight / frame.getFPS( );
			let offHeight = 0;

			let samplePadding = 10;
			let paddingPerSecond = samplePadding / frame.getFPS( );
			let offPadding = 0;

			elementObj.style.overflow = "hidden";

			let scrollIntervalId = setInterval( ( ) => {
				offHeight += heightPerSecond;
				elementObj.style.height = ( sampleHeight - Math.round( offHeight ) ) + "px";
				

				offPadding += paddingPerSecond;
				elementObj.style.paddingTop = ( samplePadding - Math.round( offPadding ) ) + "px";
				elementObj.style.paddingBottom = ( samplePadding - Math.round( offPadding ) ) + "px";

				if( elementObj.style.height.replace( /[a-z]/g, "" ) <= 0 ) {
					elementObj.style = "";
					elementObj.setAttribute( "class", "more-info" );
					clearInterval( scrollIntervalId ); 
				}
			}, frame.calcFPS( ) );
		}
	}


	/*\
	|*|	Initialize navigation links smooth scrolling
	\*/
	function initSmoothScrolling( ) {
		let sections = Object.keys( AppSessionState.nav_section );

		sections.forEach( ( index ) => {
			let button = document.getElementById( index );
			button.addEventListener( "click", ( e ) => {
				let container = document.body;
				let tempScrollTop = container.scrollTop;

				const frame = new FrameRegulator( 60, 500 );

				// The destination scroll position
				let targetSection 	= AppSessionState.nav_section[ e.srcElement.id ];	
				let scrollOffset	= ScrollUtility.getVerticalSectionOffset( "container", targetSection ) - 80;
				let scrollPerSecond = MathUtility.getDiff( tempScrollTop, scrollOffset ) / frame.getFPS( );
				
				container.scrollTop = tempScrollTop;

				console.log( targetSection );
				console.log( scrollOffset );
				console.log( scrollPerSecond );

				let scrollIntervalId = setInterval( ( ) => {
					// SCROLL DO NOTHING
					if( scrollOffset == -80 ) {
						clearInterval( scrollIntervalId );

					// SMOOTH SCROLLING DOWN
					} else if( container.scrollTop < scrollOffset ) {
						container.scrollTop += Math.round( scrollPerSecond );

						if( container.scrollTop >= scrollOffset ) {
							container.scrollTop = scrollOffset;
							clearInterval( scrollIntervalId );
						}

					// SMOOTH SCROLLING UP
					} else {
						container.scrollTop += Math.round( scrollPerSecond );

						if( container.scrollTop <= scrollOffset ) {
							container.scrollTop = scrollOffset;
							clearInterval( scrollIntervalId );
						}
					}
				}, frame.calcFPS( ) );
			});
		});
	}


	/*\
	|*|	Initialize gallery1 scrolling for section 6
	\*/
	function initGallery1( galleryId ) {
		let galleryBtns = document.querySelector( ".gallery-control-box" ).children;

		for( var i = 0; i < galleryBtns.length; i++ ) {
			galleryBtns[ i ].addEventListener( 'click', ( e ) => {
				let frame 	= new FrameRegulator( 60, 250 );
				let gallery = document.getElementById( "gallery1" );
				
				let curLeftOffset = TextUtility.removeCSSSubfix( gallery.style.left ) || 0;
				let targetOffset = ( ( e.srcElement.id ).split( "" ).pop( ) - 1 ) * 0.25 * -5120;

				let diff = Math.abs( MathUtility.getDiff( curLeftOffset, targetOffset ) );
				let diffPerSecond = diff / frame.getFPS( );

				gallery.style.left = curLeftOffset + "px";

				let scrollIntervalId = setInterval( ( ) => {
					// ==================================
					// SCROLL GALLERY TO THE LEFT
					//		DECREASE THE LEFT VALUE
					//===================================
					if( curLeftOffset > targetOffset ) {
						gallery.style.left = CSSUtility.decrementProp( gallery.style.left, diffPerSecond );

						let newOffset = TextUtility.removeCSSSubfix( gallery.style.left );

						if( newOffset <= targetOffset ) {
							gallery.style.left = targetOffset + "px";
							clearInterval( scrollIntervalId );
						}

					// ==================================
					// SCROLL GALLERY TO THE RIGHT
					//		INCREASE THE LEFT VALUE
					//===================================
					} else {
						gallery.style.left = CSSUtility.incrementProp( gallery.style.left, diffPerSecond );

						let newOffset = TextUtility.removeCSSSubfix( gallery.style.left );

						if( newOffset >= targetOffset ) {
							gallery.style.left = targetOffset + "px";
							clearInterval( scrollIntervalId );
						}
					}					
				}, frame.calcFPS( ) );
			} );
		}
	}

	/*\
	|*|	Initialize gallery2 scrolling for section 7
	\*/
	function initGallery2( ) {
		let galleryBtns = document.querySelector( ".gallery2-control" ).children;

		for( var i = 0; i < galleryBtns.length; i++ ) {
			galleryBtns[ i ].addEventListener( 'click', ( e ) => {
				let frame 	= new FrameRegulator( 60, 250 );
				let gallery = document.getElementById( "gallery2" );

				let curLeftOffset = TextUtility.removeCSSSubfix( gallery.style.left ) || 0;
				let targetOffset = ( ( e.srcElement.id ).split( "" ).pop( ) - 1 ) * 0.25 * -4300;

				let diff = Math.abs( MathUtility.getDiff( curLeftOffset, targetOffset ) );
				let diffPerSecond = diff / frame.getFPS( );

				gallery.style.left = curLeftOffset + "px";

				let scrollIntervalId = setInterval( ( ) => {
					// ==================================
					// SCROLL GALLERY TO THE LEFT
					//		DECREASE THE LEFT VALUE
					//===================================
					if( curLeftOffset > targetOffset ) {
						gallery.style.left = CSSUtility.decrementProp( gallery.style.left, diffPerSecond );

						let newOffset = TextUtility.removeCSSSubfix( gallery.style.left );

						if( newOffset <= targetOffset ) {
							gallery.style.left = targetOffset + "px";
							clearInterval( scrollIntervalId );
						}

					// ==================================
					// SCROLL GALLERY TO THE RIGHT
					//		INCREASE THE LEFT VALUE
					//===================================
					} else {
						gallery.style.left = CSSUtility.incrementProp( gallery.style.left, diffPerSecond );

						let newOffset = TextUtility.removeCSSSubfix( gallery.style.left );

						if( newOffset >= targetOffset ) {
							gallery.style.left = targetOffset + "px";
							clearInterval( scrollIntervalId );
						}
					}					
				}, frame.calcFPS( ) );
			} );
		}
	}


	let initAPI = {
		navigationList : navigationList,
		navigationToggle : initNavigationToggle,
		workSection : initWorkSection,
		smoothScrolling : initSmoothScrolling,
		gallery1 : initGallery1,
		gallery2 : initGallery2
	};

	return initAPI;
}



/* ===============================================
	Init Section 1
=============================================== */
function initSection1( ) {
	let section = document.getElementById( "section1" );
	section.style.width = window.innerWidth + "px";
	section.style.height = (window.innerWidth / wRatio * hRatio) + "px";
}



/* ===============================================
	Utility Methods
=============================================== */
var ratio  = MathUtil( ).GCD( screen.width, screen.height );
var wRatio = screen.width / ratio;
var hRatio = screen.height / ratio;





/*\
|*|	Math Utility Library	
\*/
function MathUtil( ) {
	function calcGCD( a, b ) {
		return b == 0 ? a : calcGCD( b, a % b ); 
	}

	function getDiff( a, b ) {
		return b - a;
	}

	return mathAPI = {
		GCD : calcGCD,
		getDiff : getDiff
	};
}
const MathUtility = new MathUtil( );



/*\
|*|	============================================
|*|	Scroll Utility Library
|*|	============================================ \*/
function ScrollUtil( ) {

	/*\	================================================================================
	|*|	getVerticalSectionOffset
	|*| 	Used for "Smooth Scrolling".  
	|*|		This effect is used in a single page website, where the user clicks on the
	|*|		navigation link, and it will smoothly scroll to the section instead of
	|*|		instantly jump to the id anchor.
	|*|	
	|*|		REQUIRE : DEFINITION RESTRUCTURE
	|*|			SAMPLING - WHEN YOU WANT TO FIND OUT A RESULT BEFORE HAND.
	|*|				EXAMPLE - YOU WANT TO KNOW THE OFFSET HEIGHT FOR THE SMOOTH SCROLLING
	|*|			
	|*|		
	|*| 	@containerID	- The container id that is responsible for the scrolling
	|*|						  The container id is used to reset the scrolling to the top
	|*|		@targetID		- The id anchor you wish to scroll towards.
	|*|
	|*|	return	- It returns a numeric value. The value is the offset scroll height
	|*|			  From top to the id anchor.
	|*|	============================================================================= */
	function getVerticalSectionOffset( containerID, targetID ) {
		let height = 0;

		document.getElementById( targetID ).scrollIntoView( );
		height = container.scrollTop;
		document.getElementById( containerID ).scrollIntoView(true);

		return height;
	}

	return scrollAPI = {
		getVerticalSectionOffset : getVerticalSectionOffset
	};
}
const ScrollUtility = new ScrollUtil( );



/*\	============================================
|*|	FRAME REGULATOR OBJECT
|*|		For animation purposes, this does not only applies to graphics, but also for 
|*|		animating transition effects that CSS cannot accomplish.
|*|
|*| HOW TO USE:
|*|		const newFrame = new FrameRegulator( fps, duration );
|*|		@fps 	  - The frames per second used by the animation
|*|		@duration - How many seconds or how long the animation last.
|*|	============================================ \*/
function FrameRegulator( fps, duration ) {
	function privateField( ) {
		this._fps;
		this._duration;
	}

	privateField._fps = fps;
	privateField._duration = duration;

	this.calcFPS = function( ) {
		return privateField._fps / privateField._duration;
	}

	this.getFPS = function( ) {
		return privateField._fps;
	}

	return FrameAPI = {
		calcFPS : this.calcFPS,
		getFPS : this.getFPS
	};
}



/*\	============================================
|*|	TEXT UTILITY OBJECT
|*|		FOR TEXT MANIPULATION PURPOSES
|*|	============================================ \*/
function TextUtil( ) {
	this.removeCSSSubfix = function( targetProperty ) {
		return targetProperty.replace( /[a-z]/g, "" );
	}

	return TextUtilAPI = {
		removeCSSSubfix : this.removeCSSSubfix
	};
}
const TextUtility = new TextUtil( );



/*\	============================================
|*|	CSS UTILITY
|*|		FOR CSS MANIPULATION PURPOSES
|*|	============================================ \*/
function CSSUtil( ) {
	this.incrementProp = function( targetProperty, value ) {
		let newValue = parseFloat( TextUtility.removeCSSSubfix( targetProperty ) ) + value;
		return newValue + "px";
	}

	this.decrementProp = function( targetProperty, value ) {
		let newValue = parseFloat( TextUtility.removeCSSSubfix( targetProperty ) ) - value;
		return newValue  + "px";
	}

	this.removeClass = function( targetId, className ) {
		let element 	= document.getElementById( targetId );
		let classList	= Array.from( element.classList );

		classList = classList.filter( ( e ) => {
			return ( e === className ) ? false : true;
		});

		element.setAttribute( "class", classList.join( " " ) );
	}

	this.addClass = function( targetId, className ) {
		let element 	= document.getElementById( targetId );
		let classList	= Array.from( element.classList );
		classList.push( className );

		element.setAttribute( "class", classList.join( " " ) );
	}

	return CSSUtilAPI = {
		incrementProp : this.incrementProp,
		decrementProp : this.decrementProp,
		removeClass : this.removeClass,
		addClass : this.addClass
	};
}
const CSSUtility = new CSSUtil( );