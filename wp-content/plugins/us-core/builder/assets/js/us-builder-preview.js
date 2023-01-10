/**
 * Available spaces
 * _window.$usbp - USBuilderPreview class instance
 * _window.parent.$usb - USBuilder class instance
 * _window.parent.$usbcore - Mini library of various methods
 * _window.parent.$usbdata - Data for import into the USBuilder
 * _window.$usbdata - Data for import into the USBuilderPreview
 * _window.$us - UpSolution Theme Core JavaScript Code
 *
 * Note: Double underscore `__funcname` is introduced for functions that are created through `$usbcore.debounce(...)`.
 */
! function( $, undefined ) {

	// Private variables that are used only in the context of this function, it is necessary to optimize the code.
	var _window = window,
		_document = document,
		_undefined = undefined;

	// Check for is set objects
	_window.$usbdata = _window.$usbdata || {};

	var
		// Get parent window
		parent = _window.parent || {},
		// Get $usbcore helpers
		$usbcore = parent.$usbcore || {};

	// If there is no parent window object, we will complete the execute script
	if ( ! parent.$usb ) {
		return;
	}

	/**
	 * Default data
	 *
	 * @private
	 * @type {{}}
	 */
	var _default = {
		customPrefix: 'us_custom_' // For design options
	}

	/**
	 * @class USBuilderPreview
	 */
	var USBuilderPreview = function() {
		var self = this;

		// Variables
		self.fps = 1000 / 200;
		self.mainContainer = parent.$usb.mainContainer || 'container';
		self._preloaders = {}; // All active preloaders
		self._highlights = {}; // All highlights

		// Elements
		self.$document = $( _document );
		self.$body = $( 'body', self.document );
		self.highlight = $( '.usb-builder-hover', self.$body )[0];
		self.elmMainContainer = self.getElmNode( self.mainContainer );

		// Bondable events.
		self._events = {
			// Track DragAndDrop events
			clickedControlsHoverPanel: self._clickedControlsHoverPanel.bind( self ),
			endDrag: self._endDrag.bind( self ),
			maybeDrag: self._maybeDrag.bind( self ),
			maybeStartDrag: self._maybeStartDrag.bind( self ),

			// Other handlers
			DOMContentLoaded: self._DOMContentLoaded.bind( self ),
			elmAnimationEnd: self._elmAnimationEnd.bind( self ),
			elmAnimationStart: self._elmAnimationStart.bind( self ),
			elmCopy: self._elmCopy.bind( self ),
			elmDelete: self._elmDelete.bind( self ),
			elmDuplicate: self._elmDuplicate.bind( self ),
			elmMove: self._elmMove.bind( self ),
			elmSelected: self._elmSelected.bind( self ),
			keydown: parent.$usb._events.keydown, // Extends from the main object
			linkClickHandler: self._linkClickHandler.bind( self ),
			stop: self._stop.bind( self ),

			// Alias for calling on events
			autoSetHighlightsPosition: $usbcore.debounce( self.setHighlightsPosition.bind( self ), self.fps )
		};

		// This event is needed to get various data from the iframe
		_window.onmessage = $usbcore._onMessage.bind( self );

		// When leaving the window with the cursor, hide all the highlights
		_window.onmouseout = $usbcore.debounce( function( e ) {
			e = e || _window.event;
			var elm = e.relatedTarget || e.toElement;
			if ( ! elm || elm.nodeName.toLowerCase() === 'html' ) {
				self._mouseLeavesIframe.call( self, e );
			}
		}, 1 );

		// Highlight position updates on window resize or page scrolling
		_window.onresize = self._events.autoSetHighlightsPosition;
		_document.onscroll = self._events.autoSetHighlightsPosition;

		// Disable Drag and Drop on body
		self.$body.attr( 'draggable', 'false' );

		// Events
		self.$document
			// The event fires when the initial HTML document has been completely loaded and parsed,
			// without waiting for stylesheets, images, and subframes to finish loading.
			.ready( self._events.DOMContentLoaded )
			// Capturing keyboard shortcuts
			.on( 'keydown', self._events.keydown )
			// Disabled dragstart from default
			.on( 'dragstart', function() { return false } )
			// Highlight actions
			.on( 'mousedown', '.usb-builder-hover-panel', self._events.clickedControlsHoverPanel )
			.on( 'mouseup', '.ui-icon_duplicate', self._events.elmDuplicate )
			.on( 'mouseup', '.ui-icon_copy', self._events.elmCopy )
			.on( 'mouseup', '.ui-icon_delete', self._events.elmDelete )
			// Track Drag and Drop events
			.on( 'mousedown', self._events.maybeStartDrag )
			.on( 'mousemove', self._events.maybeDrag )
			.on( 'mouseup', self._events.endDrag )
			// Other events
			.on( 'mouseup', '[data-usbid]', $usbcore.debounce( self._events.elmSelected, 1 ) )
			.on( 'mousemove', $usbcore.debounce( self._events.elmMove, self.fps ) )
			.on( 'mouseleave', $usbcore.debounce( self._events.elmLeave, self.fps ) )
			// Handlers for css animation in elements
			.on( 'animationstart', '[data-usbid]', $usbcore.debounce( self._events.elmAnimationStart, 1 ) )
			.on( 'animationend', '[data-usbid]', $usbcore.debounce( self._events.elmAnimationEnd, 1 ) )
			// When the cursor is within `header` or `footer` then hide all highlights
			.on( 'mouseenter', '.l-header, .l-footer', $usbcore.debounce( self.hideHighlight.bind( self ), 100 ) )
			// Watching content changes (via us scripts)
			.on( 'contentChange', '.l-canvas:first', self._events.autoSetHighlightsPosition );

		self.$body
			// Handler for all link clicks
			.on( 'click', 'a', self._events.linkClickHandler );

		/**
		 * Private events
		 * The events that can come from the main collector window
		 */
		for ( var handler in self._$events ) {
			if ( $.isFunction( self._$events[ handler ] ) ) {
				self.on( handler, self._$events[ handler ].bind( self ) );
			}
		}
	};

	/**
	 * @type {USBuilderPreview}
	 */
	var $usbPreviewPrototype = USBuilderPreview.prototype;

	/**
	 * Transports for send messages between windows or objects
	 */
	$.extend( $usbPreviewPrototype, $usbcore.mixins.events || {}, {
		/**
		 * Send a message to the parent window
		 *
		 * @param {String} eventType A string containing event type
		 * @param {[]} extraParams Additional parameters to pass along to the event handler
		 * @chainable
		 */
		postMessage: function( eventType, extraParams ) {
			parent.postMessage( JSON.stringify( [ /* Namespace */'usb', eventType, extraParams ] ) );
		}
	} );

	/**
	 * Extends the functionality by importing methods from main prototype builder.js
	 * Methods that need to extend the current prototype must be specified explicitly in the list
	 * TODO: Optimize and get rid of this extension.
	 */
	[
		'_debugLog',
		'canBeChildOf',
		'config',
		'flushTemp',
		'getAttachmentUrl',
		'getCurrentPreviewOffset',
		'getElmChildren',
		'getElmId',
		'getElmName',
		'getElmParentId',
		'getElmShortcode',
		'getElmTitle',
		'getElmType',
		'getElmValue',
		'getInsertPosition',
		'getNewElmId',
		'getSpareElmId',
		'getTemp',
		'hasSameTypeParent',
		'hideTransit',
		'isColumn',
		'isElmContainer',
		'isElmTab',
		'isEmptyTempContent',
		'isHidePanel',
		'isMainContainer',
		'isMode',
		'isParentDragging',
		'isRootElmContainer',
		'isRow',
		'isSecondElmContainer',
		'isSetTransit',
		'isUpdateIncludeParent',
		'isValidId',
		'moveElm',
		'restoreTempContent',
		'saveTempContent',
		'setMode',
		'setTemp',
		'setTransitPosition',
		'showTransit'
	].map( function( method ) {
		var self = this;
		if ( !! parent.$usb[ method ] && ! self[ method ] ) {
			self[ method ] = parent.$usb[ method ].bind( parent.$usb ) || $.noop;
		}
	}.bind( $usbPreviewPrototype ) );

	/**
	 * Functionality for implementing Drag And Drop
	 * All the necessary methods that are somehow involved in this approach
	 */
	$.extend( $usbPreviewPrototype, {
		// The number of pixels when dragging after which the movement will be initialized
		_dragStartDistance: parent.$usb._dragStartDistance || 8,

		/**
		 * Get all data from the event that is needed for Drag and Drop
		 *
		 * @private
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 * @return {{}} The event data
		 */
		_extractEventData: function( e ) {
			return {
				clientX: e.clientX,
				clientY: e.clientY,
				pageX: e.pageX,
				pageY: e.pageY,
				target: e.target
			};
		},

		/**
		 * Event handler for clicking on any element in the highlight controls on HoverPanel
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_clickedControlsHoverPanel: function( e ) {
			var self = this,
				elmId = $( e.currentTarget ).closest( '.usb-builder-hover' ).data( 'elmid' );
			if ( ! elmId  ) {
				return;
			}

			// Set element data on click on hover panel
			self.hoveredElmId = elmId;
			self.hoveredElm = self.getElmNode( elmId );

			// The we activate observations to start moving the element
			$( self.hoveredElm )
				.trigger( 'mousedown', [ e.pageX, e.pageY ] );
		},

		/**
		 * Handler for checking movement
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_maybeStartDrag: function( e, pageX, pageY ) {
			e.stopPropagation();
			var self = this;

			// If there drag in the parent window, then we will exit this method
			if ( self.isParentDragging() ) {
				return;
			}
			//var target = self._getNearestElm( e.target );

			// Defining the element to move
			var target = ( self.hoveredElm && $usbcore.$hasClass( e.target, 'usb-builder-hover-panel-name' ) )
				? self.hoveredElm
				: self._getNearestElm( e.target );

			if ( ! target ) {
				return;
			}
			// Clearing all asset and temporary data to move
			self.clearDragAssets();
			// Set temp data
			self.setTemp( 'iframeDrag', {
				isParentTab: false, // Moving in sections in the context of Tabs/Tour
				isDragging: false,
				startDrag: true,
				startX: e.pageX || pageX || 0,
				startY: e.pageY || pageY || 0,
				target: target,
			} );
		},

		/**
		 * Position selection handler for move element
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_maybeDrag: function( e ) {
			var self = this,
				target = e.target,
				currentPreviewOffset = self.getCurrentPreviewOffset(),
				// Get offset for transit
				transit = {
					pageX: Math.ceil( currentPreviewOffset.x + e.pageX - _window.scrollX ), // X axis
					pageY: Math.ceil( currentPreviewOffset.y + e.pageY - _window.scrollY ) // Y axis
				};

			if ( ! $usbcore.isFirefox && self.isParentDragging() ) {
				// Determination of the place where the element can fall
				self._maybeDrop( self._extractEventData( e ) );
				// Set position for transit when adding a new element
				self.setTransitPosition( transit.pageX, transit.pageY );
				return;
			}

			var temp = self.getTemp( 'iframeDrag' );
			if ( $.isEmptyObject( temp ) || ! temp.startDrag || ! temp.target ) {
				return;
			}

			// If the cursor leaves the window, then we end dragging
			if ( target && ( target instanceof HTMLDocument || target.tagName.toLowerCase() === 'html' ) ) {
				self.restoreTempContent(); // Restore the current content that contains the floating element
				self.clearDragAssets();
				self.setMode( 'editor' );
				return;
			}

			// Get ffsets from origin along axis X and Y
			var diffX = Math.abs( temp.startX - e.pageX ),
				diffY = Math.abs( temp.startY - e.pageY );

			// The check the distance of the germinated mouse and if it is more than
			// the specified one, then activate all the necessary methods
			if ( diffX >= self._dragStartDistance || diffY >= self._dragStartDistance ) {
				var // Get target id
					targetId = self.getElmId( temp.target );

				if ( self.isMode( 'editor' ) ) {
					// Selecting mode of moving elements
					self.setMode( 'drag:move' );
					// Add a flag that dragging is activated
					temp.isDragging = true;
					// Moving in sections in the context of tabs
					temp.isParentTab = !! self.isElmTab( self.getElmParentId( targetId ) );
					// Show the transit, default pageX and pageY do not set for correct offset
					self.showTransit( targetId, /*pageX*/0, /*pageY*/0 );
					// Add helpers classes for visual control
					$usbcore
						.$addClass( temp.target, 'usb_transit' )
						.$addClass( _document.body, 'usb_draging' );
					// Hide tab button
					if ( temp.isParentTab ) {
						$usbcore
							.$addClass( self._getSectionButtonById( targetId ), 'usb_transit' );
					}
					// Hide highlight for editable element
					if ( self.hasEditableHighlight( targetId ) ) {
						temp.editable = true;
						self.hideEditableHighlight( targetId );
					}
				}

				if ( ! self.isMode( 'drag:move' ) ) {
					return;
				}

				// Saving content to a temporary variable and removing the float
				if ( self.isEmptyTempContent() ) {
					// The save content to temp
					self.saveTempContent();
					// Temporarily remove the element to be moved from the content
					parent.$usb.pageData.content = ( '' + parent.$usb.pageData.content )
						.replace( self.getElmShortcode( self.getElmId( temp.target ) ), '' );
				}

				// Determination of the place where the element can fall
				self._maybeDrop( self._extractEventData( e ) );

				// Set position for transit when move element
				self.setTransitPosition( transit.pageX, transit.pageY );
			}
		},

		/**
		 *
		 * Determining the location where the element will be drag
		 * This method is called from both the current window and the parent.window
		 *
		 * @private
		 * @param {{}} data The data from event
		 *
		 * TODO: Develop a linear system of checks that will be taken out of the method!
		 */
		_maybeDrop: function( data ) {
			var self = this;
			if (
				! data
				|| ! data.target
				|| ! self.isMode( 'drag:add', 'drag:move' )
			) {
				return;
			}

			var // Get current temp
				temp = self.getTemp( 'iframeDrag' ),
				// This is the ID of the new or moved element
				currentId = self.isMode( 'drag:add' )
					? self.getNewElmId()
					: self.getElmId( temp.target ),
				// Save a real target since the target can be replaced (Note: Replacement
				// occurs when working with tabs and programmatic element borders).
				realTarget = data.target;

			// Redirects from tab buttons to sections
			if ( temp.isParentTab && $usbcore.$hasClass( data.target, 'w-tabs-item' ) ) {
				// The find main element of a button
				if ( $usbcore.$hasClass( data.target.parentNode, 'w-tabs-item' ) ) {
					realTarget = data.target.parentNode;
				}
				// Find the element of the section related to the button.
				var _sectionId = $usbcore.$attr( realTarget, 'data-related-to' );
				if ( _sectionId ) {
					data.target = self.getElmNode( _sectionId );
				}
			}

			var // The found target where the item will be added. All non-root containers must have the target
				// of the root container for example, for vc_column this is vc_row etc.
				targetContainer = self.isSecondElmContainer( currentId )
					? self._getNearestRootElmContainer( data.target )
					: self._getNearestElmContainer( data.target ),
				// Real targets all contain the data of the elements over which the cursor passes
				target = self._getNearestElm( data.target ) || self.elmMainContainer,
				targetId = self.getElmId( target );

			// If the moved element is open for editing then hide the highlight
			if ( !! temp.editable ) {
				self.hideEditableHighlight();
			}

			// Check the target, if it is missing, add the main container
			targetContainer = targetContainer || self.elmMainContainer;

			var // This is the target id that does not change and contains the container
				targetContainerId = self.getElmId( targetContainer );

			// If the cursor is on the border, then reload the target to add before or after
			var  borderUnderMouse = self._getBorderUnderMouse( targetContainer, data.clientX, data.clientY );
			if ( borderUnderMouse !== self._DIRECTION.UNKNOWN ) {
				if ( self.isElmContainer( targetContainerId ) ) {
					var parentId = self.getElmParentId( targetContainerId ) || self.mainContainer;
					// Reload real target
					if ( borderUnderMouse === self._DIRECTION.TOP && ! self.isSecondElmContainer( parentId ) ) {
						targetId = parentId;
						target = self.getElmNode( parentId );
					}
					// Get next parentId
					if ( ! self.isSecondElmContainer( parentId ) ) {
						parentId = self.getElmParentId( parentId );
					}
					// Reload target
					targetContainerId = parentId || self.mainContainer;
					targetContainer = self.getElmNode( parentId );
				}
			}

			var // The check if the moved element is a tab, accordion, tour or vc_column(_inner), if so, then enable strict mode
				strictMode = self.isSecondElmContainer( currentId );

			// If element and target are `vc_row` then change target to main container
			if ( self.isRow( currentId ) && self.isRow( targetContainerId ) ) {
				targetContainerId = self.mainContainer;
			}

			// Exception when moving vc_column* within one vc_row*, this fixes a blink bug for the css grid
			if ( self.isSecondElmContainer( currentId ) && targetContainerId === targetId ) return;

			// Determine if it is a descendant of itself.
			if ( self.hasSameTypeParent( currentId, targetContainerId ) ) return;

			// Check if the element can be a child of the hover element
			if ( ! self.canBeChildOf( currentId, targetContainerId, strictMode ) ) return;

			// Determine which axis to determine the direction
			var isMouseDirectionX = self.config( 'moving_child_x_direction', [] )
				.indexOf( self.getElmType( temp.parentId ) ) > -1;

			var // Get the direction of the mouse movement relative to the target along Y or X axis
				// Note: IMPORTANT: To determine the direction, you must use the real node `data.target`,
				// not `target`, as it can be replaced when working from containers.
				mouseDirection = isMouseDirectionX
					? self._getMouseDirectionX( realTarget, data.clientX, data.clientY )  // X axis
					: self._getMouseDirectionY( realTarget, data.clientX, data.clientY ), // Y axis
				// Get a list of all children of the container where mouse movement occurs
				children = self.getElmChildren( targetContainerId ),
				// This is the child ID to search for in the list of children
				targetChildId = ( self.isSecondElmContainer( currentId ) && ! self.isElmContainer( targetId ) )
					? self.getElmId( self._getNearestSecondElmContainer( data.target ) )
					: targetId,
				// This is the index or sequential number of adding an element to the list of nodes
				currentIndex;

			// Get the `currentIndex` to add an element to the document
			if ( ( currentIndex = children.indexOf( targetChildId ) ) === -1 ) {
				currentIndex = 0;
			}
			if ( mouseDirection === self._DIRECTION.BOTTOM || mouseDirection === self._DIRECTION.RIGHT ) {
				currentIndex++;
			}
			if ( ! currentIndex || currentIndex < 0 ) {
				currentIndex = 0;
			}

			// Checking and searching for elements that are near the cursor
			if (
				currentId.indexOf( 'vc_tta_' ) != 0 // Note: Ignore Tabs/Tour/Accordion elements as they are hidden
				&& ! self.isColumn( currentId ) // Skip calculate for `vc_column` and `vc_column_inner`
				&& (
					self.isSecondElmContainer( targetId )
					|| ( // In the mode of adding new element to the main container, allow adding to the end of the list
						self.isMode( 'drag:add' )
						&& self.isMainContainer( targetContainerId )
					)
				)
			) {
				// Get the size of an children elements and its position relative to the viewport
				for ( var elmIndex in children ) {
					var elmId = children[ elmIndex ],
						elm = self.getElmNode( elmId );
					if ( ! elm ) {
						continue;
					}
					var elmRect = $usbcore.$rect( elm ),
						elmX = Math.floor( Math.abs( elmRect.x ) + _window.scrollX ),
						elmY = Math.floor( Math.abs( elmRect.y ) + _window.scrollY );
					// The comparisons where the cursor is in relation to the outer borders of elements
					if ( data.pageY > elmY && data.pageX > elmX ) {
						currentIndex = $usbcore.parseInt( elmIndex ) + 1;
					}
				}
			}

			// Save the last found container
			if ( temp.lastFoundContainer !== targetContainer ) {
				$usbcore
					.$removeClass( temp.lastFoundContainer, 'usb_dropcontainer' )
					.$addClass( targetContainer, 'usb_dropcontainer' );
				temp.lastFoundContainer = targetContainer;
			}

			// Save insert data to a temp variable
			temp.parentId = targetContainerId;
			temp.currentId = currentId;
			temp.currentIndex = currentIndex;

			// Saving data for Firefox since endDrag in the frame window does not work
			if ( $usbcore.isFirefox ) {
				var parentTemp = self.getTemp( 'drag' );
				parentTemp.parentId = temp.parentId;
				parentTemp.currentId = currentId;
				parentTemp.currentIndex = currentIndex;
			}

			// Get insert position
			var insert = self.getInsertPosition( temp.parentId, currentIndex );

			// Additional check for `insert` changes to reduce the number of document calls
			if ( $usbcore.comparePlainObject( insert, temp.lastInsert ) ) {
				return;
			}
			temp.lastInsert = insert;

			// Create new dropplace element
			$usbcore.$remove( temp.place ); // Remove old dropplace element
			temp.place = _document.createElement( 'div' );
			temp.place.className = 'usb_dropplace';

			// This is where additional settings are added for the vertical line when moving containers
			var isHorizontalWrapper = ( self.getElmName( temp.parentId ) === 'hwrapper' );
			if ( self.isRootElmContainer( temp.parentId ) || isHorizontalWrapper || temp.isParentTab ) {
				temp.place.className += '_container'; // `{usb_dropplace}_container`
				if ( isHorizontalWrapper ) {
					// Add height to the wrapper as elements inside it are not blocks
					temp.place.style.height = $usbcore.$rect( targetContainer ).height + 'px';
				}
			}

			// This is an explicit transfer of the node for the target (Needed to display position by section Tabs/Tour buttons)
			// Note: This is a forced solution since the buttons outside the section are not a shortcode.
			if ( temp.isParentTab ) {
				insert.parent = realTarget;
				if ( $usbcore.isNode( insert.parent ) && [ 'prepend', 'append' ].indexOf( insert.position ) > -1 ) {
					insert.parent = insert.parent.parentNode || insert.parent;
				}
			}

			// Adding a temporary container to the place where the item will be added
			self.trigger( 'insertElm', [ insert.parent, insert.position, temp.place ] );
		},

		/**
		 * End a drag
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_endDrag: function( e ) {
			var self = this;
			/**
			 * Kill current event
			 * Note: For FF, we ignore stop since the transmitted object is data, not an event object,
			 * all due to the peculiarities of the FF from work the iframe
			 */
			if ( ! $usbcore.isFirefox ) {
				self._events.stop( e );
			}

			// Get current temp object
			var temp = self.getTemp( 'iframeDrag' );
			// Duplicate the signal in the parent window for correct completion
			if ( self.isParentDragging() ) {
				// Move the data to add a new element
				$.extend( self.getTemp( 'drag' ), {
					parentId: temp.parentId,
					currentId: temp.currentId,
					currentIndex: temp.currentIndex
				} );
				self.postMessage( 'endDrag' );
				return;
			}
			// Reset all data
			self.setMode( 'editor' );

			// If the move is not activated or not started then clear all assets
			if ( ! temp.startDrag || ! temp.isDragging ) {
				// Clearing all asset and temporary data to move
				self.clearDragAssets();
				// Selecting an element for editing
				if (
					! temp.isDragging
					&& $usbcore.$hasClass( e.target, 'usb-builder-hover-panel-name' )
				) {
					// Hide highlight for editable element
					self.hideEditableHighlight();
					// Running a trigger to initialize shortcode edit mode
					var $highlight = $( e.target ).closest( '.usb-builder-hover' );
					if ( $highlight.length ) {
						var elmId = $highlight.data( 'elmid' );
						self.hoveredElm = self.getElmNode( elmId );
						$( self.hoveredElm ).trigger( 'mouseup' );
					}
				}
				// End execution
				return;
			}

			// Restore the current content that contains the floating element
			self.restoreTempContent();

			// Move the element to a new position
			if ( !! temp.parentId && !! temp.currentId ) {
				self.moveElm( temp.currentId, temp.parentId, temp.currentIndex || 0 );
				// If the element was selected for editing then restore the highlight
				if ( !! temp.editable ) {
					self.showEditableHighlight( temp.currentId );
					// Force highlights position
					self.setHighlightsPosition();
				}
			}

			// Clearing all asset and temporary data to move
			self.clearDragAssets();
		},

		/**
		 * Clearing all asset and temporary data to move
		 */
		clearDragAssets: function() {
			var self = this,
				temp = self.getTemp( 'iframeDrag' );
			if ( $.isEmptyObject( temp ) ) {
				return;
			}
			$usbcore
				// Remove classes
				.$removeClass( temp.target, 'usb_transit' )
				.$removeClass( temp.lastFoundContainer, 'usb_dropcontainer' )
				.$removeClass( _document.body, 'usb_draging' )
				// Remove dropplace element
				.$remove( temp.place );
			// Show tab button
			if ( temp.isParentTab ) {
				$usbcore.$removeClass( self._getSectionButtonById( self.getElmId( temp.target ) ), 'usb_transit' );
			}
			// Hide the transit
			self.hideTransit();
			// Flush temp data
			self.flushTemp( 'iframeDrag' );
		}
	} );

	/**
	 * Functionality for the implementation of highlights
	 * TODO: Position the highlight in the first container of the element.
	 */
	$.extend( $usbPreviewPrototype, {
		/**
		 * Show the highlight
		 * This method is called many times, so the implementation should be Vanilla JS
		 */
		showHighlight: function() {
			var self = this;
			if ( ! self.isMode( 'editor' ) || ! self.isValidId( self.hoveredElmId ) ) {
				return;
			}
			var parentId = self.hoveredElmId,
				iteration = 0;
			while ( parentId !== self.mainContainer && parentId !== null ) {
				if ( iteration++ >= /* max number of iterations */1000/* 1 second */ ) {
					break;
				}
				// Add a clone for the new found element
				self._createHighlight( parentId );

				// Show highlight
				var item = self._highlights[ parentId ];
				item.active = true;
				item.highlight.style.display = 'block';

				/**
				 * Get next parent elm
				 * @var {String|null}
				 */
				parentId = self.getElmParentId( parentId );
			}
			// Set the highlight position
			self.setHighlightsPosition.call( self );
		},

		/**
		 * Hide the highlight
		 * This method is called many times, so the implementation should be Vanilla JS
		 */
		hideHighlight: function() {
			var self = this;
			if ( $.isEmptyObject( self._highlights ) ) {
				return;
			}
			for ( var elmId in self._highlights  ) {
				var item = self._highlights[ elmId ];
				item.active = false;
				item.highlight.style.display = 'none';
			}
			self.hoveredElm = null;
			self.hoveredElmId = null;
		},

		/**
		 * Set the highlights position
		 * This method is called many times, so the implementation should be Vanilla JS
		 */
		setHighlightsPosition: function() {
			var self = this;
			if ( ! self.isMode( 'editor' ) || $.isEmptyObject( self._highlights ) ) {
				return;
			}
			for ( var elmId in self._highlights ) {
				if ( ! self.isValidId( elmId ) ) {
					continue;
				}
				var item = self._highlights[ elmId ],
					// Receiving at this stage is necessary because the elements can be completely rebooted
					elm = self.getElmNode( elmId );
				if (
					! $usbcore.isNode( elm )
					|| (
						! item.active
						&& ! item.editable
					)
				) {
					continue;
				}
				var elmRect = $usbcore.$rect( elm ),
					cssProps = {
						top: elmRect.top + ( _window.pageYOffset || elm.scrollTop ),
						left: elmRect.left + ( _window.pageXOffset || elm.scrollLeft ),
						width: elmRect.width,
						height: elmRect.height
					};
				// Set css props
				$( item.highlight ).css( cssProps );

				/* UX improvement when the element width is less then hover panel */
				if ( elmRect.width < 75 ) {
					$usbcore.$addClass( item.highlight, 'small' );
				} else {
					$usbcore.$removeClass( item.highlight, 'small' );
				}
			}
		},

		/**
		 * Show highlight for editable element
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 */
		showEditableHighlight: function( id ) {
			var self = this;
			if ( ! self.isValidId( id ) ) {
				return;
			}
			// Hide highlight for editable element
			self.hideEditableHighlight();
			// Get highlight object
			var item = self._highlights[ id ];
			// Create new highlight
			if ( ! item ) {
				self.hideHighlight();
				item = self._createHighlight( id );
				if ( item ) {
					item.active = true;
				}
				self.setHighlightsPosition();
			}
			// Show editable mode
			if ( item ) {
				item.editable = true;
				$usbcore.$addClass( item.highlight, 'usb_editable' );
			}
		},

		/**
		 * Hide highlight for editable element
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1" (Optional parameter)
		 */
		hideEditableHighlight: function() {
			var self = this;
			if ( $.isEmptyObject( self._highlights ) ) {
				return;
			}
			var id = '' + arguments[ 0 ],
				highlights = self._highlights;
			// We update the list where we leave the highlights by the passed id
			if ( !! id && self.hasEditableHighlight( id ) ) {
				highlights = [ highlights[ id ] ];
			}
			for ( var elmId in highlights  ) {
				var item = highlights[ elmId ];
				if ( ! item.editable ) {
					continue;
				}
				// Removing the class that includes the highlighting of the editable element
				$usbcore.$removeClass( item.highlight, 'usb_editable' );
			}
		},

		/**
		 * Determines if editable highlight
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {Boolean} True if editable highlight, False otherwise.
		 */
		hasEditableHighlight: function( id ) {
			return !! ( this._highlights[ id ] || {} ).editable;
		},

		/**
		 * The MutationObserver interface provides the ability to watch for changes being made to the DOM tree.
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#mutationobserverinit
		 *
		 * @private
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {MutationObserver|undefined}
		 */
		_getMutationObserver: function( id ) {
			var target, self = this;
			if (
				! self.isValidId( id )
				|| ! ( target = self.getElmNode( id ) )
			) {
				return;
			}
			var observer = new MutationObserver( $usbcore.debounce( self.setHighlightsPosition.bind( self ), 1 ) );
			observer.observe( target, {
				characterData: true,
				childList: true,
				subtree: true
			} );
			return observer;
		},

		/**
		 * Create new highlight
		 *
		 * @private
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {{}|null} The highlight object
		 */
		_createHighlight: function( id ) {
			var self = this;
			if (
				! self.isValidId( id )
				||  self._highlights[ id ]
				|| ! $usbcore.isNode( self.highlight )
			) {
				return null;
			}

			// Clone an element from a template
			var highlightElm = self.highlight.cloneNode( true ),
				elm = self.getElmNode( id ),
				elmEditLink = $usbcore.$attr( elm, 'data-edit_link' );
			// Add a title for highlighting
			highlightElm
				.querySelector( '.usb-builder-hover-panel-name' )
				.innerText = self.getElmTitle( id );
			// Add Edit link if set
			if ( elmEditLink ) {
				$usbcore.$attr(
					highlightElm.querySelector( '.usb-builder-hover-panel-edit' ),
					'href',
					elmEditLink
				);
			}
			// Add all the necessary settings
			$usbcore
				.$attr( highlightElm, 'data-elmid', id )
				.$addClass( highlightElm, 'elm_' + self.getElmType( id ) );
			self.highlight
				.after( highlightElm );

			/**
			 * Definition and purpose of zIndex for highlight only
			 * Note: Necessary for correct display on mobile responsive mode.
			 */
			var zIndex = 9999; // The default zIndex
			if ( self.isSecondElmContainer( id ) ) {
				zIndex -= 1;
			} else if ( self.isRootElmContainer( id ) ) {
				zIndex -= 2;
			}
			highlightElm.style.zIndex = zIndex;

			// Add nodes to a temporary variable
			return self._highlights[ id ] = {
				active: false,
				editable: false,
				highlight: highlightElm,
				MutationObserver: self._getMutationObserver( id )
			};
		},

		/**
		 * Remove a highlights
		 */
		removeHighlights: function() {
			var self = this;
			if ( $.isEmptyObject( self._highlights ) ) {
				return;
			}
			for ( var elmId in self._highlights ) {
				if ( ! self.isValidId( elmId ) ) {
					continue;
				}
				if ( null === self.getElmNode( elmId ) ) {
					// Get current highlight data
					var data = self._highlights[ elmId ];
					/**
					 * Disconnect from watching mutations
					 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/disconnect
					 */
					if ( data.MutationObserver instanceof MutationObserver ) {
						data.MutationObserver.disconnect();
					}
					// Remove node element
					$usbcore.$remove( data.highlight );
					// Remove data
					delete self._highlights[ elmId ];
				}
			}
		}
	} );

	/**
	 * Functionality for handling events
	 */
	$.extend( $usbPreviewPrototype, {
		/**
		 * Kill current event
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_stop: function( e ) {
			e.preventDefault();
			e.stopPropagation();
		},

		/**
		 * The event fires when the initial HTML document has been completely loaded and parsed,
		 * without waiting for stylesheets, images, and subframes to finish loading.
		 *
		 * @private
		 */
		_DOMContentLoaded: function() {
			// Added class after loading documents so that all scripts have time to be initialized.
			this.$body.addClass( 'usb_content_ready' );
		},

		/**
		 * Link click handler
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_linkClickHandler: function( e ) {
			var self = this,
				$target = $( e.currentTarget ),
				href = ( $target.attr( 'href' ) || '' ).toLowerCase();

			// Anything to exclude from opening in a new window.
			if (
				href.charAt( 0 ) == '#'
				|| href.substr( 0, 'javascript:'.length ) == 'javascript:'
				|| $target.is( '[ref=magnificPopup]' )
				|| $target.hasClass( '.w-tabs-item' ) // Exclude all TTA buttons.
			) {
				return;
			}

			// Kill event
			self._events.stop( e );

			// Opening links in a new window
			_window.open( href, '_blank' );
		},

		/**
		 * Handler for start css animation in element
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_elmAnimationStart: function( e ) {
			var self = this;
			if ( ! $usbcore.$attr( e.target, 'data-usbid' ) ) {
				return;
			}
			if (
				self.selectedElmId
				&& self.getElmType( self.selectedElmId ) !== 'us_grid'
			) {
				self.hideEditableHighlight();
			}
		},

		/**
		 * Handler for end css animation in element
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_elmAnimationEnd: function( e ) {
			var self = this;
			if ( ! $usbcore.$attr( e.target, 'data-usbid' ) ) {
				return;
			}
			if (
				self.isValidId( self.selectedElmId )
				&& self.getElmType( self.selectedElmId ) !== 'us_grid'
			) {
				self.showEditableHighlight( self.selectedElmId );
				self.setHighlightsPosition();
			}
		},

		/**
		 * The handler is triggered every time the cursor leaves the iframe window
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_mouseLeavesIframe: function( e ) {
			var self = this;
			if ( ! self.isHidePanel() ) {
				// The hide all highlights
				self.hideHighlight();
			}
			// Clearing all asset and temporary data to move
			self.clearDragAssets();
		},

		/**
		 * Selected element
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_elmSelected: function( e ) {
			var self = this;
			// Check the `editor` mode (Only in edit mode we can select elements to change)
			if ( ! self.isMode('editor') || self.isHidePanel() ) {
				return;
			}
			var elm = self._getNearestElm( e.target );
			if ( elm && elm === self.hoveredElm ) {
				self.selectedElmId = self.getElmId( elm );
				self.postMessage( 'elmSelected', self.selectedElmId );
			}
		},

		/**
		 * Handler when the cursor enters the bounds of an element
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_elmMove: function( e ) {
			var self = this;
			if ( self.isHidePanel() ) {
				return;
			}
			var elm = self._getNearestElm( e.target );
			if ( elm && elm !== self.hoveredElm ) {
				self.hideHighlight();
				self.hoveredElm = elm;
				self.hoveredElmId = self.getElmId( elm );
				self.postMessage( 'elmMove', self.hoveredElmId );
				self.showHighlight();
			}
		},

		/**
		 * Handler when the cursor moves out of the bounds of an element
		 *
		 * @private
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_elmLeave: function( e ) {
			var self = this;
			if ( self.isHidePanel() ) {
				return;
			}
			var elm = self._getNearestElm( e.target );
			if ( elm ) {
				self.postMessage( 'elmLeave', self.getElmId( elm ) );
				self.hoveredElm = null;
				self.hoveredElmId = null;
			}
		},

		/**
		 * Handler when the duplicate element
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_elmDuplicate: function( e ) {
			var self = this,
				$highlight = $( e.currentTarget ).closest( '.usb-builder-hover' ),
				elmId = $highlight.data( 'elmid' );
			if ( ! elmId ) {
				return;
			}
			self.postMessage( 'elmDuplicate', elmId );
		},

		/**
		 * Remove the class for the copy button, used instead of timeout to simplify logic
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @param {Function} fn The function to be executed
		 * @type debounced
		 */
		__removeClassInCopiedElm: $usbcore.debounce( $usbcore.fn, 1000 * 4 /* 4 second */ ),

		/**
		 * Handler for copying shortcode to clipboard
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_elmCopy: function( e ) {
			var self = this,
				$target = $( e.currentTarget ),
				$highlight = $target.closest( '.usb-builder-hover' ),
				elmId = $highlight.data( 'elmid' );
			if ( ! elmId || ! self.isRow( elmId ) ) {
				return;
			}
			// Send an event to the main window
			self.postMessage( 'elmCopy', elmId );
			$target // Add a temporary class that the item is copied to the clipboard
				.addClass( 'copied' );
			// Delete a temporary class after a specified time
			self.__removeClassInCopiedElm( function() {
				$target.removeClass( 'copied' );
			} );
		},

		/**
		 * Handler when the delete element
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_elmDelete: function( e ) {
			var self = this,
				$highlight = $( e.currentTarget ).closest( '.usb-builder-hover' ),
				elmId = $highlight.data( 'elmid' );
			if ( ! elmId  ) {
				return;
			}
			$usbcore
				.$remove( self._highlights[ elmId ].highlight || null );
			delete self._highlights[ elmId ];
			self.postMessage( 'elmDelete', elmId );
		}
	});

	/**
	 * Functionality for the implementation of Design options
	 * TODO: All methods that relate to the generation of styles from design settings must be optimized for performance!
	 */
	$.extend( $usbPreviewPrototype, {
		/**
		 * Delayed start of CSS animation
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @type debounced
		 */
		__startAnimation: $usbcore.debounce( function( elm ) {
			$usbcore.$addClass( elm, 'start' );
		}, 1 ),

		/**
		 * Add or update custom styles in a document
		 *
		 * @private
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @param {String} jsoncss The line of design settings from the $usof.field[ 'design_options' ]
		 * @param {{}} specificClasses List of specific classes that will be added if there is a value by key name
		 */
		_addDesignOptions: function( id, jsoncss, specificClasses ) {
			var self = this;

			if ( ! id ) {
				return;
			}
			jsoncss = '' + jsoncss;

			var $style;
			// Find element of styles for shortcode
			_document.querySelectorAll( 'style[data-for="'+ id +'"]' )
				.forEach( function( style, i ) {
					if ( i === 0 ) {
						return $style = style;
					}
					// Delete all unnecessary if any
					$usbcore.$remove( style );
				} );

			/**
			 * Get animated properties in one line
			 *
			 * @param {Node} node
			 * @return {String|undefinded}
			 */
			var getAnimateProps = function( node ) {
				if ( ! $usbcore.isNode( node ) ) {
					return;
				}
				var style = _window.getComputedStyle( node ),
					name = style.getPropertyValue( 'animation-name' ),
					delay = style.getPropertyValue( 'animation-delay' );
				if ( name && name !== 'none' ) {
					return name + delay;
				}
				return;
			};

			// Get shortcode element
			var node = self.getElmNode( id );

			// Get the first child for buttons
			// Note: Exception for elements that have wrapper that are not main.
			if ( self.getElmType( id ) === 'us_btn' && $usbcore.isNode( node ) ) {
				node = node.firstChild || node;
			}

			// If there is no style element then create a new one
			if ( ! $style ) {
				var // Custom prefix
					customPrefix = self.config( 'designOptions.customPrefix', _default.customPrefix ),
					// Generate unique class name
					className = $usbcore.uniqid( customPrefix );
				// If the element is absent then we will complete the action
				if ( ! $usbcore.isNode( node ) ) return;
				$style = $( '<style data-for="'+ id +'" data-classname="'+ className +'"></style>' )[0];
				// Add a new styling element to the page
				node.before( $style );
				// Removing the old custom class in the absence of a styling element `<style data-for="..." data-classname="..."></style>`
				if ( node.className.indexOf( customPrefix ) > -1 ) {
					node.className = node.className.replace(
						new RegExp( '(' + $usbcore.escapePcre( customPrefix ) + '\\w+)' ),
						''
					);
				}
				// Add a new class for custom styles
				$usbcore.$addClass( node, className );
			}

			// Determine the presence of an animation name
			var hasAnimateName = jsoncss.indexOf( 'animation-name' ) > -1,
				oldAnimateProp;

			// Compile and add styles to document
			if ( $style ) {
				var _className = $usbcore.$attr( $style, 'data-className' );
				// If there are animation settings, keep the old value
				if ( hasAnimateName ) {
					oldAnimateProp = getAnimateProps( node );
				}
				$style.innerText = self._compileDesignOptions( _className, jsoncss );
			}

			// Checking classes and restarting animation
			if ( hasAnimateName ) {
				var currentAnimateProps = getAnimateProps( node );
				if ( currentAnimateProps && currentAnimateProps !== oldAnimateProp ) {
					// Adjusting classes for normal animation work
					$usbcore.$addClass( node, 'us_animate_this' );
					$usbcore.$removeClass( node, 'start' );
					// Delayed start of CSS animation
					self.__startAnimation( node );
				}
			} else if ( $usbcore.$hasClass( node, 'us_animate_this' ) ) {
				$usbcore.$removeClass( node, 'us_animate_this start' );
			}

			// Switching specific design classes depending on the given properties
			self._toggleDesignSpecificClasses.apply( self, arguments );
		},

		/**
		 * Removing design styles for elements that do not exist
		 *
		 * @private
		 */
		_removeDesignForElmsNotExist: function() {
			var self = this;
			_document.querySelectorAll( 'style[data-for]' )
				.forEach( function( style ) {
					var id = $usbcore.$attr( style, 'data-for' );
					if ( id && null === self.getElmNode( id ) ) {
						$usbcore.$remove( style );
					}
				} );
		},

		/**
		 * Remove style tag by element ID
		 *
		 * @private
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 */
		_removeDesignById: function( id ) {
			_document.querySelectorAll( 'style[data-for="'+ id +'"]' )
				.forEach( function( style ) {
					$usbcore.$remove( style );
				} );
		},

		/**
		 * Compile and add styles to document
		 * Note: The method can be called many times, especially when choosing a color, it should be as efficient and
		 * fast as possible
		 *
		 * @private
		 * @param {String} className The unique name of the class attached to the element
		 * @param {String} jsoncss Design settings as a unescape string
		 * @return {String} Compiled css string
		 */
		_compileDesignOptions: function( className, jsoncss ) {
			var self = this,
				collections = {};
			// Get object jsoncss
			try {
				jsoncss = JSON.parse( unescape( '' + jsoncss ) || '{}' );
			} catch ( e ) {
				jsoncss = {};
			}
			// If there are no jsoncss options, return an empty string
			if ( $.isEmptyObject( jsoncss ) ) {
				return '';
			}

			// Create of collections for different responsive states
			self.config( 'responsiveStates', [] ).map( function( responsiveState ) {
				if ( !! jsoncss[ responsiveState ] ) {
					collections[ responsiveState ] = self._normalizeJsoncss( jsoncss[ responsiveState ] );
				}
			} );
			var // Result string, these are the compiled styles
				result = '';
			// The formation of styles for different responsive states
			for ( var responsiveState in collections ) {
				if ( $.isEmptyObject( collections[ responsiveState ] ) ) {
					continue;
				}
				var // Final css code
					cssCode = '',
					// Get the current collection ( Apply
					// masks to css properties )
					collection = self._applyMaskToBackgroundCss( collections[ responsiveState ] ),
					// Get breakpoint sizes
					breakpoint = self.config( 'designOptions.breakpoints.' + responsiveState, /* Default */'' );
				// Collection to string options
				for( var prop in collection ) {
					if ( ! prop || ! collection[ prop ] ) {
						continue;
					}
					cssCode += prop + ':' + collection[ prop ] + '!important;';
				}
				// Add class to styles
				if ( cssCode ) {
					cssCode = '.' + className + '{'+ cssCode +'}';
				}
				// Add styles to the result
				result += ( breakpoint )
					? '@media '+ breakpoint +' {'+ cssCode +'}'
					: cssCode;
			}
			return result;
		},

		/**
		 * This helper method is for normalizing css options ( jsoncss option -> css option )
		 * TODO: Minimal functionality providing only styling applications without optimizations
		 *
		 * @private
		 * @param {{}} cssOptions The css options
		 * @return {{}}
		 */
		_normalizeJsoncss: function( options ) {
			var self = this;

			if ( $.isEmptyObject( options ) ) {
				return options;
			}

			// For background-image get an image URL by attachment ID (Preliminary check)
			if ( !! options[ 'background-image' ] ) {
				var url = self.getAttachmentUrl( options[ 'background-image' ] );
				if ( !! url ) {
					options[ 'background-image' ] = 'url('+ url +')';
				}
			}

			// Normalization of css parameters
			for ( var prop in options ) {
				if ( ! prop || ! options[ prop ] ) {
					continue;
				}
				var value = options[ prop ];

				/**
				 * If the name contains the text color and the values start from the underscore,
				 * try to get the css variable
				 *
				 * Example: color, background-color, border-color, box-shadow-color etc.
				 */
				if ( /(^color|-color$)/.test( prop ) && ( '' + value ).charAt( 0 ) === '_' ) {
					value = self.getColorValue( value );
					// Remove gradient for text color
					if ( prop == 'color' && self._isCssGradient( value ) ) {
						value = value.replace( '-grad', '' );
					}
					options[ prop ] = value;
				}

				// Generate correct font-family value
				if ( prop === 'font-family' ) {
					options[ prop ] = self.config( 'designOptions.fontVars.' + value, /* Default */value );
				}
				// border-style to border-{position}-style provided that there is a width of this border
				if ( prop === 'border-style' ) {
					[ 'left', 'top', 'right', 'bottom' ] // List of possible positions
						.map( function( position ) {
							var borderWidth = options[ 'border-'+ position +'-width' ];
							if ( ! $usbcore.isUndefined( borderWidth ) && borderWidth !== '' ) {
								options[ 'border-'+ position +'-style' ] = '' + value;
							}
						} );
					delete options[ prop ];
				}
				// Check for line spacing
				if ( prop === 'font-height' ) {
					if ( !! value ) {
						options[ 'line-height' ] = value;
					}
					delete options[ prop ];
				}
			}

			// Forming `box-shadow` from the list of parameters
			if (
				!! options
				&& (
					!! options[ 'box-shadow-h-offset' ]
					|| !! options[ 'box-shadow-v-offset' ]
					|| !! options[ 'box-shadow-blur' ]
					|| !! options[ 'box-shadow-spread' ]
				)
			) {
				var _boxShadow = [];
				// Value map for `box-shadow` this map is needed to turn the list into a string,
				// the order is also very important here!
				[ 'h-offset', 'v-offset', 'blur', 'spread', 'color' ].map( function( key ) {
					var value = options[ 'box-shadow-' + key ];
					if ( $usbcore.isUndefined( value ) ) {
						value = ( key === 'color' )
							? 'currentColor' // The default color
							: '0';
					}
					_boxShadow.push( value );
					delete options[ 'box-shadow-' + key ];
				} );
				if ( _boxShadow.length ) {
					options[ 'box-shadow' ] = _boxShadow.join( ' ' );
				}
			}

			// Forming `text-shadow` from the list of parameters
			if (
				!! options
				&& (
					!! options[ 'text-shadow-h-offset' ]
					|| !! options[ 'text-shadow-v-offset' ]
					|| !! options[ 'text-shadow-blur' ]
				)
			) {
				var _textShadow = [];
				// Value map for `text-shadow` this map is needed to turn the list into a string,
				// the order is also very important here!
				[ 'h-offset', 'v-offset', 'blur', 'color' ].map( function( key ) {
					var value = options[ 'text-shadow-' + key ];
					if ( $usbcore.isUndefined( value ) ) {
						value = ( key === 'color' )
							? 'currentColor' // The default color
							: '0';
					}
					_textShadow.push( value );
					delete options[ 'text-shadow-' + key ];
				} );
				if ( _textShadow.length ) {
					options[ 'text-shadow' ] = _textShadow.join( ' ' );
				}
			}

			return options;
		},

		/**
		 * Apply masks to css properties
		 *
		 * @private
		 * @param {{}} collection The collection
		 * @return {{}}
		 */
		_applyMaskToBackgroundCss: function( collection ) {
			var self = this;
			collection = $.extend( {}, collection || {} );
			/**
			 * Masks for optimizing and combining styles
			 * NOTE: The order of all values must match the specification of the css
			 * @type {{}}
			 */
			var propNames = 'color image repeat attachment position size'.split( ' ' ) || [], // Get an array of
																							  // properties
				assignedProps = {},
				backgroupdPropValue = '';
			// If there are masks, then check and remove from the main collection
			for ( var i in propNames ) {
				var name = propNames[ i ],
					cssName = 'background-' + name;

				if ( !! collection[ cssName ] ) {
					assignedProps[ name ] = collection[ cssName ];
					delete collection[ cssName ];
				}
			}
			/**
			 * Adjust background options before merging
			 * @link https://www.w3schools.com/cssref/css3_pr_background.asp
			 */
			var _gradient = '';
			if ( !! assignedProps[ 'image' ] && self._isCssGradient( assignedProps[ 'color' ] ) ) {
				_gradient = assignedProps[ 'color' ];
				delete assignedProps[ 'color' ];
			}
			if ( !! assignedProps[ 'size' ] ) {
				// If size is set, position should have a value, setting default value for position if it is not set
				if ( ! assignedProps[ 'position' ] ) {
					assignedProps[ 'position' ] = 'left top';
				}
				assignedProps[ 'size' ] = '/ ' + assignedProps[ 'size' ];
			}

			for ( var i in propNames ) {
				var name = propNames[ i ];
				if ( !! assignedProps[ name ] ) {
					backgroupdPropValue += ' ' + assignedProps[ name ];
				}
			}
			// If there is a gradient then add to the end
			if ( _gradient ) {
				backgroupdPropValue += ', ' + _gradient;
			}
			// Add a property created by the mask
			collection[ 'background' ] = backgroupdPropValue.trim();

			return collection;
		},

		/**
		 * Determines whether the specified value is css gradient.
		 *
		 * @private
		 * @param {String} value The css value
		 * @return {String} True if the specified value is css gradient, False otherwise.
		 */
		_isCssGradient: function( value ) {
			value += ''; // To string
			return value.indexOf( 'gradient' ) > -1 || /\s?var\(.*-grad\s?\)$/.test( value ); // The support css var(*-grad);
		},

		/**
		 * Switching specific design classes depending on the given properties
		 *
		 * @private
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @param {String} jsoncss The line of design settings from the $usof.field[ 'design_options' ]
		 * @param {{}} specificClasses List of specific classes that will be added if there is a value by key name
		 */
		_toggleDesignSpecificClasses: function( id, jsoncss, specificClasses ) {
			var self = this,
				toggleClasses = {};
			if ( ! $.isPlainObject( specificClasses ) ) {
				return toggleClasses;
			}
			// Get shortcode element
			var node = self.getElmNode( id );
			// Get the first child for buttons
			// Note: Exception for elements that have wrapper that are not main.
			if ( self.getElmType( id ) === 'us_btn' && $usbcore.isNode( node ) ) {
				node = node.firstChild || node;
			}
			// Convert to json string
			if ( jsoncss ) {
				jsoncss = unescape( '' + jsoncss ) || '{}';
			}
			// Check jsoncss properties and adding or removing classes
			for ( var prop in specificClasses ) {
				var state = ( jsoncss.indexOf( '"'+ prop +'"' ) > -1 );
				$usbcore.$toggleClass( node, specificClasses[ prop ], state );
			}
		},
	} );

	/**
	 * Functionality for the implementation of Main API
	 */
	$.extend( $usbPreviewPrototype, {

		/**
		 * Direction constants
		 * @var {{}}
		 */
		_DIRECTION: {
			BOTTOM: 'bottom',
			LEFT: 'left',
			RIGHT: 'right',
			TOP: 'top',
			UNKNOWN: 'unknown'
		},

		/**
		 * Get the mouse movement angle
		 *
		 * @private
		 * @param {Node} target The target node
		 * @param {Number} clientX The coordinates along the X axis
		 * @param {Number} clientY The coordinates along the Y axis
		 * @return {Number} Return the angle of mouse movement
		 *
		 * Visual example of a map in 360°:
		 * +--------------------+--------------------+
		 * | -165              -90               -15 |
		 * |                    |                    |
		 * | -180               |                 -1 |
		 * +------------------- 0 -------------------+
		 * |  180               |                  1 |
		 * |                    |                    |
		 * |  165               90                15 |
		 * +--------------------+--------------------+
		 */
		_getMouseAngle: function( target, clientX, clientY ) {
			// Check if the target is a node
			if ( ! $usbcore.isNode( target ) ) {
				return 0;
			}
			var // Radius to Degree
				RAD_TO_DEG = 180 / Math.PI,
				// Get the size of the container and its position relative to the viewport
				rect = $usbcore.$rect( target ),
				// Get the center of the container
				center = {
					x: rect.width / 2 + rect.left,
					y: rect.height / 2 + rect.top
				},
				// Get a vector relative to the target (container)
				vector = {
					x: clientX - center.x,
					y: clientY - center.y
				},
				// Get a vector length
				vectorLength = Math.sqrt( vector.x * vector.x + vector.y * vector.y ),
				// Get a directions
				direction = {
					x: vector.x / vectorLength,
					y: vector.y / vectorLength
				};
			// Return the angle of mouse movement
			return Math.atan2( direction.y, direction.x ) * RAD_TO_DEG;
		},

		/**
		 * Get the direction of the mouse movement relative to the target along Y axis
		 *
		 * @private
		 * @param {Node} target The target node
		 * @param {Number} clientX The coordinates along the X axis
		 * @param {Number} clientY The coordinates along the Y axis
		 * @return {String}
		 */
		_getMouseDirectionY: function( target, clientX, clientY ) {
			var self = this;
			// Check if the target is a node
			if ( ! $usbcore.isNode( target ) ) {
				return self._DIRECTION.UNKNOWN;
			}
			// Get the mouse movement angle
			return ( self._getMouseAngle( target, clientX, clientY ) < 0 )
				? self._DIRECTION.TOP
				: self._DIRECTION.BOTTOM;
		},

		/**
		 * Get the direction of the mouse movement relative to the target along X axis
		 *
		 * @private
		 * @param {Node} target The target node
		 * @param {Number} clientX The coordinates along the X axis
		 * @param {Number} clientY The coordinates along the Y axis
		 * @return {String}
		 */
		_getMouseDirectionX: function( target, clientX, clientY ) {
			var self = this;
			// Check if the target is a node
			if ( ! $usbcore.isNode( target ) ) {
				return self._DIRECTION.UNKNOWN;
			}
			// Get the mouse movement angle
			var angle = self._getMouseAngle( target, clientX, clientY );
			return ( angle > -180 && angle <= -130 || angle <= 180 && angle > 130 )
				? self._DIRECTION.LEFT
				: self._DIRECTION.RIGHT;
		},

		/**
		 * Get the border under mouse.
		 *
		 * @private
		 * @param {Node} target The target node
		 * @param {Number} clientX The coordinates along the X axis
		 * @param {Number} clientY The coordinates along the Y axis
		 * @return {Boolean} True if mouse on container border, False otherwise.
		 */
		_getBorderUnderMouse: function( target, clientX, clientY ) {
			var self = this;
			if (
				! $usbcore.isNode( target )
				|| target === self.elmMainContainer
				|| ! $.isNumeric( clientX )
				|| ! $.isNumeric( clientY )
			) {
				return self._DIRECTION.UNKNOWN;
			}

			// Scrolling corrections
			clientX += _window.scrollX;
			clientY += _window.scrollY;

			// Get sizes
			var elmRect = $usbcore.$rect( target ),
				elmX = Math.floor( Math.abs( elmRect.x ) + _window.scrollX ),
				elmY = Math.floor( Math.abs( elmRect.y ) + _window.scrollY ),
				elmBottom = Math.floor( elmY + elmRect.height ),
				elmRight = Math.floor( elmX + elmRect.width ),
				borderAround = 10; // This is the size of the border around the perimeter of the container.

			// Top border
			if ( clientY > elmY && clientY <= ( elmY + borderAround ) ) {
				return self._DIRECTION.TOP;
			}
			// Bottom border
			else if ( clientY < elmBottom && clientY >= ( elmBottom - borderAround ) ) {
				return self._DIRECTION.BOTTOM;
			}
			// Left border
			else if ( clientX > elmX && clientX <= ( elmX + borderAround ) ) {
				return self._DIRECTION.LEFT;
			}
			// Rigth border
			else if ( clientX < elmRight && clientX >= ( elmRight - borderAround ) ) {
				return self._DIRECTION.RIGHT;
			}

			return self._DIRECTION.UNKNOWN;
		},

		/**
		 * Determines if hoverable element
		 *
		 * @private
		 * @param {Node} elm The elm
		 * @param {String} filterName
		 * @return {Boolean} True if hoverable element, False otherwise.
		 */
		_isHoverableNode: function( elm, filterName ) {
			var self = this;
			if ( ! elm ) {
				return false;
			}
			var elmId = self.getElmId( elm );
			switch ( filterName ) {
				case 'elmContainer':
					return self.isElmContainer( elmId );
					break;
				case 'secondContainer':
					return self.isSecondElmContainer( elmId );
					break;
				case 'rootContainer':
					return self.isRootElmContainer( elmId );
					break;
				default:
					return !! elmId;
					break;
			}
		},

		/**
		 * Get the nearest node
		 *
		 * TODO: It is necessary to optimize in the DOM to find only the first element,
		 * everything else is based on the getElmParentId method as it works from $usb.pageData.content
		 *
		 * @private
		 * @param {Node} elm The elm
		 * @param {String} filterName Filters when checking the found node
		 * @return {Mixed}
		 */
		_getNearestNode: function( elm, filterName ) {
			var found;
			while ( ! ( found = this._isHoverableNode( elm, filterName ) ) ) {
				if ( ! elm.parentNode ) {
					return null;
				}
				elm = elm.parentNode;
			}
			return ( found ) ? elm : null;
		},

		/**
		 * Get the nearest elment
		 *
		 * @private
		 * @param {Node} elm The elm
		 * @return {Mixed}
		 */
		_getNearestElm: function( elm ) {
			return this._getNearestNode( elm );
		},

		/**
		 * Get the nearest elment container
		 *
		 * @private
		 * @param {Node} elm The elm
		 * @return {Mixed}
		 */
		_getNearestElmContainer: function( elm ) {
			return this._getNearestNode( elm, 'elmContainer' );
		},

		/**
		 * Get the nearest second elment container
		 *
		 * @private
		 * @param {Node} elm The elm
		 * @return {Mixed}
		 */
		_getNearestSecondElmContainer: function( elm ) {
			return this._getNearestNode( elm, 'secondContainer' ); // TODO: ( secondContainer | elmContainer ) ???
		},

		/**
		 * Get the nearest root elment container
		 *
		 * @private
		 * @param {Node} elm The elm
		 * @return {Mixed}
		 */
		_getNearestRootElmContainer: function( elm ) {
			return this._getNearestNode( elm, 'rootContainer' );
		},

		/**
		 * Get the color value
		 * Note: The color result can include variable css
		 *
		 * @param {String} value The value
		 * @return {String} The color value
		 */
		getColorValue: function( value ) {
			if ( ( '' + value ).indexOf( '_' ) > -1 ) {
				return this.config( 'designOptions.colorVars.' + value, /* Default */value );
			}
			return value;
		},

		/**
		 * Get the target element
		 *
		 * @private
		 * @param {String} targetId Shortcode's usbid, e.g. "us_btn:1" or `container`
		 * @param {String} position The position
		 * @return {Mixed}
		 */
		_getTargetElm: function( targetId, position ) {
			var self = this;

			// Check the correctness of the data in the variables
			if (
				! targetId
				|| ! parent.$usb
				|| ['before', 'prepend', 'append', 'after'].indexOf( position ) === - 1
			) {
				return;
			}
			var isMainContainer = self.isMainContainer( targetId ),
				// Find parent element
				// TODO:Optimize and implement without jQuery
				$targetElm = $( self.getElmNode( isMainContainer ? self.mainContainer : targetId ) );
			// When positioned before or after, return the $parentElm unchanged
			if ( [ 'before', 'after' ].indexOf( position ) !== - 1 ) {
				return $targetElm;
			}
			/**
			 * Parent adjustment for different shortcodes
			 *
			 * Note: All searches for the location of the root element are strictly tied to
			 * the structure and classes, see the switch construction!
			 */
			if ( ! isMainContainer && $targetElm.length ) {
				var elmType = self.getElmType( targetId ),
					elmRootSelector = self.config( 'rootContainerSelectors.' + elmType );
				if ( elmRootSelector ) {
					// The settings can contain a list of containers `.container, .container > *`,
					// but we only get the first one found.
					$targetElm = $( '' + elmRootSelector, $targetElm ).first();
					if ( ! $targetElm.length ) {
						self._debugLog( 'Error: No element set for container `%s` in rootContainerSelectors'.replace( '%s', elmType ) );
					}
				}
			}

			return $targetElm;
		},

		/**
		 * Get an node or nodes by ID
		 *
		 * @param {String|[]} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {null|Node|[Node...]}
		 */
		getElmNode: function( id ) {
			if ( ! id ) {
				return;
			}
			var ids = id,
				self = this;

			// The convert to a single type to data
			if ( ! $.isArray( ids ) ) {
				ids = [ ids ];
			}

			// Checking if the ID's is correct
			ids = ids.filter( function( id ) {
				// We will leave everything that passes the validation, and delete the rest.
				return self.isValidId( id ) || self.isMainContainer( id );
			} );

			// Convert ID's to selectors
			ids = ids.map(function( id ) {
				return '[data-usbid="'+ id +'"]';
			});

			// The get one node
			if ( $.type( id ) === 'string' && ids.length === 1 ) {
				return _document.querySelector( ids[ 0 ] );

			}
			// The get an array of nodes
			if ( $.isArray( id ) && ids.length ) {
				var nodes =_document.querySelectorAll( ids.join( ',' ) );
				return [].slice.call( nodes );
			}

			// If there is nothing, return `null`
			return null;
		},

		/**
		 * Get all html for a node including styles
		 *
		 * @param {String|[]} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {String}
		 */
		getElmOuterHtml: function( id ) {
			var node = this.getElmNode( id );
			if ( $usbcore.isNode( node ) ) {
				return ( ( _document.querySelector( 'style[data-for="'+ id +'"]' ) || {} ).outerHTML || '' ) + node.outerHTML;
			}
			return '';
		},

		/**
		 * Gets the section button by id
		 *
		 * @private
		 * @param {String} sectionId Shortcode's usbid, e.g. "vc_tta_section:1"
		 * @return {Node|null}.
		 */
		_getSectionButtonById: function( sectionId ) {
			if ( ! this.isValidId( sectionId ) ) {
				return null;
			}
			return _document.querySelector( '[data-related-to="'+ sectionId +'"]' );
		},

		/**
		 * Set the highlights position
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @type debounced
		 */
		__setHighlightsPosition: $usbcore.debounce( function() {
			this.setHighlightsPosition();
		}, 10 ),

		/**
		 * Handlers for private events
		 * @private
		 */
		_$events: {

			/**
			 * Called every time an element is duplicate
			 *
			 * @private
			 * @event handler
			 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
			 */
			duplicateElmId: function( id ) {
				var self = this;
				if ( ! self.isValidId( id ) ) {
					return;
				}
				self.selectedElmId = id;
				self.showEditableHighlight( id );
			},

			/**
			 * The handler is called every time the panel display changes
			 *
			 * @private
			 * @event handler
			 */
			changeSwitchPanel: function() {
				var self = this;
				self.$body.toggleClass( 'usb_preview', ! self.isHidePanel() );
			},

			/**
			 * Show the loading
			 *
			 * @private
			 * @event handler
			 * @param {String} targetId Shortcode's usbid, e.g. "us_btn:1"
			 * @param {String} position The position ( possible values: before, prepend, append, after )
			 * @param {Boolean} isContainer If these values are true, then a container class will be added for customization
			 * @param {String} id The unique id for preloader
			 */
			showPreloader: function( targetId, position, isContainer, id ) {
				var self = this;
				// The replace element
				if ( $usbcore.isUndefined( position ) ) {
					$( self.getElmNode( targetId ) )
						.addClass( self.config( 'className.elmLoading', '' ) );
					return;
				}
				// Creating a new preloader
				var $preloader = $( '<div class="g-preloader type_1 for_usbuilder"></div>' )
					// If a container is added to the tucked place, then we add a class to be able to customize the display
					.toggleClass( 'usb-loading-container', !! isContainer );

				// Add to the list of active preloaders
				self._preloaders[ id || targetId ] = $preloader.get( 0 );

				// The insert element
				self.trigger( 'insertElm', [ targetId, position, $preloader ] );
			},

			/**
			 * Hide the loading
			 *
			 * @private
			 * @event handler
			 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
			 */
			hidePreloader: function( id ) {
				var self = this;
				if ( !! id && self._preloaders[ id ] ) {
					$usbcore
						.$remove( self._preloaders[ id ] );
					delete self._preloaders[ id ];
				}
			},

			/**
			 * Remove an element from a document by its ID
			 *
			 * @event handler
			 * @param {String|[]} id The element that is being removed, e.g. "us_btn:1"
			 */
			removeHtmlById: function ( removeId ) {
				var self = this;
				if ( ! removeId ) {
					return;
				}
				if ( ! $.isArray( removeId ) ) {
					removeId = [ removeId ];
				}
				// Get all nodes to remove
				var nodes = self.getElmNode( removeId ) || [];
				if ( ! nodes.length ) {
					return;
				}

				// Remove all nodes
				nodes.map( function( node ) {
					if ( ! $usbcore.isNode( node ) ) {
						return;
					}
					var $node = $( node ),
						$tabs = $node.closest( '.w-tabs' );

					// Removing a button and opening a free section
					if ( self.isUpdateIncludeParent( node ) ) {
						$( '[aria-controls="content-'+ $node.attr( 'id' ) +'"]:first', $tabs )
							.remove();
						// The opening the first section
						$tabs
							.find( '.w-tabs-list a:first, .w-tabs-section-title:first' )
							.trigger('click')
					}
					// Remove node
					$node
						// Trigger events about the remove of an element
						// to track changes in the elements.
						.trigger( 'usb.removeHtml' )
						// Remove a element
						.remove();
					// Remove highlights ( TODO:Remove after merge # 2313 )
					self.removeHighlights();
					// Removing design styles for elements that do not exist ( TODO:Remove after merge # 2313 )
					self._removeDesignForElmsNotExist();
				} );
			},

			/**
			 * Add new item to document
			 *
			 * @event handler
			 * @param {String|Node} parent Shortcode's usbid, e.g. "us_btn:1" or `container`
			 * @param {String} position The position ( possible values: before, prepend, append, after )
			 * @param {String} html The html
			 * @param {Boolean} scrollIntoView If the True are set, then after adding the scroll   to the new node.
			 */
			insertElm: function( parent, position, html, scrollIntoView ) {
				var self = this,
					// Definition based on `usbid` and position
					$parentElm = ! $usbcore.isNode( parent )
						? self._getTargetElm( parent, position )
						: $( parent ); // If explicitly passed node to `parent`
				// TODO: This code is often called when moving or adding a new item, so you need to implement in VanillaJS
				if ( $parentElm instanceof $ ) {
					var $html = $( html );
					$parentElm[ position ]( $html );
					// Init its JS if needed
					$( '[data-usbid]', $html ).each( function( _, item ) {
						self.trigger( 'maybeInitElmJS', [ $usbcore.$attr( item, 'data-usbid' ) ] );
					} );
					// Scrolls the current container of the parent of the element so that the new element is visible to the user.
					if ( scrollIntoView ) {
						$html[0].scrollIntoView();
						// The animation start control.
						$( ( '[class*="us_animate_"]:not(.start)' ), $html )
							.addClass( 'start' );
					}
				}
			},

			/**
			 * Move element on preview page
			 *
			 * @event handler
			 * @param {String} parent Shortcode's usbid, e.g. "us_btn:1" or `container`
			 * @param {String} position The position ( possible values: before, prepend, append, after )
			 * @param {String} elmId Shortcode's usbid, e.g. "us_btn:1"
			 */
			moveElm: function( parent, position, elmId ) {
				var self = this,
					$parentElm = self._getTargetElm( parent, position ),
					$elm = $( self.getElmNode( elmId ) );
				if ( $parentElm instanceof $ && $elm.length ) {
					$parentElm[ position ]( $elm );
					// Since we always have custom styles after the elements, when we
					// move the element, we will move the styles if any.
					var $style = $( 'style[data-for="' + elmId + '"]:first', self.$body );
					if ( $style.length ) {
						$elm.before( $style );
					}
					// When moving sections of tabs, move the buttons accordingly
					var parentId = self.getElmParentId( elmId );
					if ( parentId && !! self.isElmTab( parentId ) ) {
						var children = ( self.getElmChildren( parentId ) || [] ).reverse();
						children.map( function( sectionId ) {
							var tabButton = self._getSectionButtonById( sectionId );
							$( tabButton.parentNode ).prepend( tabButton );
						} );
					}
				}
			},

			/**
			 * Updates the selected element on the page
			 *
			 * @event handler
			 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
			 * @param {String} html This is the html code of the element and additionally,
			 *						if necessary, the styles in a separate tag after the element.
			 */
			updateSelectedElm: function( id, html ) {
				if ( ! id ) {
					return;
				}
				var self = this,
					node = self.getElmNode( id );
				if ( ! $usbcore.isNode( node ) ) {
					return;
				}

				// Remove style tag by element ID
				self._removeDesignById( id );
				node.outerHTML = '' + html; // Refresh entire node

				// Init its JS if needed
				self.trigger( 'maybeInitElmJS', [ id ] );
				// Update highlight for the element
				self.__setHighlightsPosition();
			},

			/**
			 * Update custom css on the preview page
			 *
			 * @see
			 * @param {String} css The css
			 */
			updatePageCustomCss: function( css ) {
				var self = this,
					// Meta key for post custom css
					keyCustomCss = self.config( 'settings.keyCustomCss', /* Default */'usb_post_custom_css' );

				// Note: Since this is outputed inside the WPBakery Page Builder, we can correct it here.
				var $style = $( 'style[data-type="'+ keyCustomCss +'"]', self.$document );
				if ( ! $style.length )  {
					$style = $( '<style data-type="'+ keyCustomCss +'">' );
					$( 'head', self.$document )
						.append( $style );
				}
				$style.text( css || '' );
			},

			/**
			 * Update element content
			 * Note: This method is only for updating content.
			 *
			 * @param {String|Node} selector The selector to find nodes
			 * @param {String} content Text or HTML content to be installed
			 * @param {String} method  Method to be used
			 */
			updateElmContent: function( selector, content, method ) {
				if ( [ 'text', 'html' ].indexOf( method ) === -1 ) {
					method = 'text';
				}
				$( selector, this.$document )[ method ]( '' + content );
			},

			/**
			 * Init its JS if needed
			 *
			 * @param {String} targetId Shortcode's usbid, e.g. "vc_row:1"
			 */
			maybeInitElmJS: function( targetId ) {
				var self = this,
					initMethods = $.isPlainObject( _window.$usbdata.elmsInitJSMethods )
						? _window.$usbdata.elmsInitJSMethods
						: {},
					elmType = self.getElmType( targetId );
				if (
					! $usbcore.isUndefined( initMethods[ elmType ] )
					&& $.isFunction( initMethods[ elmType ] )
				) {
					initMethods[ elmType ]( $( self.getElmNode( targetId ) ) );
				}
			},

			/**
			 * Apply changes to the element
			 *
			 * instruction: `
			 * {
			 * 		'attr': 'html|text|tag|attribute(style|class|...)',
			 * 		'css': '{selectors}',
			 * 		'elm': '{selectors}',
			 * 		'mod': '{name}',
			 * 		'toggle_atts': {
			 * 			'attribute': '{value}',
			 * 			'attribute2': '{value2}',
			 * 		},
			 * 		'toggle_class': '{class name}',
			 * 		'toggle_class_inverse': '{class name}',
			 * 		'design_options': {
			 * 			//  List of specific classes that will be added if there is a value by key name
			 * 			color: 'has_text_color',
			 * 			width: 'has_width',
			 * 			height: 'has_height',
			 * 			...
			 * 		},
			 * }`
			 * or array instructions: `
			 * [
			 *        {...},
			 *        {...}
			 * ]`
			 *
			 * @event handler
			 * @param {String} targetId Shortcode's usbid, e.g. "us_btn:1"
			 * @param {{}} instructions The are instructions for updating elements
			 * @param {Mixed} value The value
			 * @param {String} fieldType Field type
			 */
			onPreviewParamChange: function( targetId, instructions, value, fieldType ) {
				var self = this,
					$target = $( self.getElmNode( targetId ) );
				if ( ! $target.length ) {
					return;
				}
				if ( $usbcore.isUndefined( instructions[ 0 ] ) ) {
					instructions = [ instructions || {} ];
				}

				// If the field type is color and the value has a key, then we get css color variable
				if ( fieldType === 'color' && ( '' + value ).charAt( 0 ) === '_' ) {
					value = self.getColorValue( value );
				}

				for ( var i in instructions ) {
					var instruction = instructions[ i ],
						// Define the element to change
						$elm = ! $usbcore.isUndefined( instruction[ 'elm' ] )
							? $target.find( instruction[ 'elm' ] )
							: $target;

					if ( ! $elm.length ) {
						continue;
					}

					// Changing the class modifier of an element
					if ( ! $usbcore.isUndefined( instruction[ 'mod' ] ) ) {
						var mod = '' + instruction[ 'mod' ],
							pcre = new RegExp( '((^| )'+ $usbcore.escapePcre( mod ) + '[a-zA-Z0-9\_\-]+)', 'g' );
						// Remove all classes from modifier
						$elm.each( function( _, elm ) {
							elm.className = elm.className.replace( pcre, '' );
						} );
						// Add classes modifiers
						( $.isArray( value ) ? value : value.split( ',' ) )
							.map( function( value ) {
								if ( !! value ) {
									$elm.addClass( mod + '_' + value );
								}
							} );

						// Changing the inline parameter
					} else if ( ! $usbcore.isUndefined( instruction[ 'css' ] ) ) {
						// For the font-family property, check for the presence of global keys `body`, 'h1`, `h2` etc.
						if ( 'font-family' === instruction[ 'css' ]  ) {
							// Get the font family from the design options
							value = self.config( 'designOptions.fontVars.' + value, /* Default */value );
						}
						$elm.css( instruction[ 'css' ], value );

						/*
						 * Ugly hack for Safari compatibility:
						 * since it would not re-render element after changing grid-gap CSS property,
						 * force re-render by changing opacity property
						 */
						if (
							$usbcore.isSafari // safari detection
							&& 'grid-gap' === instruction[ 'css' ]
						) {
							$elm.css( 'opacity', '0.99' );
							setTimeout( function() {
								$elm.css( 'opacity', '' );
							}, 50 );
						}

						// Changing some attribute (or embedded text, html)
					} else if ( ! $usbcore.isUndefined( instruction[ 'attr' ] ) ) {
						var attr_name = '' + instruction[ 'attr' ];

						switch ( attr_name ) {
							case 'html': // Set html to $elm
								$elm.html( value );
								break;
							case 'text': // Set text to $elm
								$elm.text( value );
								break;
							case 'tag': // Replace tag name in $elm
								$elm.replaceWith( function() {
									var that = this,
										$tag = $( '<' + value + '>' ).html( $( that ).html() );
									for ( var i = that.attributes.length - 1; i >= 0; -- i ) {
										var item = that.attributes[ i ];
										$tag.attr( item.name, item.value );
									}
									return $tag;
								} );
								break;
							case 'class': // Adding a custom class
								$elm
									.removeClass( $elm.data( 'last-classname' ) || '' )
									.addClass( value )
									.data( 'last-classname', value );
								break;
							case 'onclick': // Adding error protection for event values.
								// If there are errors in custom JS, an error message will be displayed
								// in the console, and this will not break the work of the site.
								if ( value ) {
									value = 'try{' + value + '}catch(e){console.error(e)}';
								}
								// Note: no break; here, so default: code is executed too
							default: // Update other attributes
								$elm.attr( attr_name, value );
						}

						// Attribute toggles
					} else if ( ! $usbcore.isUndefined( instruction[ 'toggle_atts' ] ) ) {
						for ( var k in instruction[ 'toggle_atts' ] ) {
							if ( value == true ) {
								// Set attribute
								$elm.attr( k, instruction[ 'toggle_atts' ][ k ] );
							} else {
								// Remove attribute
								$elm.removeAttr( k );
							}
						}

						// Turn on/off css class
					} else if ( ! $usbcore.isUndefined( instruction[ 'toggle_class' ] ) ) {
						$elm.toggleClass( instruction[ 'toggle_class' ], !! value );

						// Turn on/off css class (inverse)
					} else if ( ! $usbcore.isUndefined( instruction[ 'toggle_class_inverse' ] ) ) {
						$elm.toggleClass( instruction[ 'toggle_class_inverse' ], ! value );

						// Compiling and updating design styles
					} else if ( ! $usbcore.isUndefined( instruction[ 'design_options' ] ) ) {
						self._addDesignOptions( targetId, /* jsoncss string */value, /* specific classes */instruction[ 'design_options' ] );

						// The error message
					} else {
						console.log( 'Unknown instruction:', { instruction: instruction, value: value } );
					}
				}

				$target // Send event on element change in usbuilder
					.trigger( 'usb.contentChange' );

				// Set the highlight position
				self.setHighlightsPosition();
			},

			/**
			 * Called when a new element is added and gets the coordinates of the mouse
			 *
			 * @event handler
			 * @param {String} method The event name
			 * @param {{}} data The mouse event data
			 */
			onParentEventData: function( method, data ) {
				if ( ! method ) {
					return;
				}
				// Determination of the element that is under the coordinates, and obtaining all additional data
				data = $.extend( /* Default */{ eventX: 0, eventY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0 }, data || {} );
				data.target = _document.elementFromPoint( data.eventX, data.eventY );
				this.trigger( 'doAction', [ method, data ] );
			},

			/**
			 * This method calls another method that is specified in
			 * the parameters and, if necessary, passes arguments
			 *
			 * @event handler
			 * @param {String} name Method name to run
			 * @param {{}} args Arguments to be passed to the method
			 */
			doAction: function( name, args ) {
				var self = this;
				if ( ! name || ! $.isFunction( self[ name ] ) ) {
					return;
				}
				args = args || [];
				self[ name ].apply( self, $.isArray( args ) ? args : [ args ] );
			},

			/**
			 * This handler is called every time the column/column_inner in change
			 * Note: At the moment, the same distribution of space between the columns is implemented
			 *
			 * @event handler
			 * @param {String} rootContainerId Shortcode's usbid, e.g. "vc_row:1", "vc_row_inner:1"
			 */
			vcColumnChange: function( rootContainerId ) {
				var self = this;
				if ( ! rootContainerId || ! self.isValidId( rootContainerId ) ) {
					return;
				}
				var columns = self.getElmChildren( rootContainerId );
				$( columns.map( function( usbid ) { return '[data-usbid="'+ usbid +'"]' } ).join( ',' ), self.$body )
					.each( function( i, column ) {
						// Get width depending on mesh type Grid/Flex
						var width = '' + self.getElmValue( columns[i], 'width' );
						if ( /(\d+)\/(\d+)/.test( width ) ) {
							var isGridColumnsLayout = self.config( 'isGridColumnsLayout', /* default */false );
							if ( ! isGridColumnsLayout && width.indexOf( '/5') != -1 ) { // Specific to classes 1/5, 2/5, N/5
								// do nothing
							} else {
								var parts = width.split( '/' );
								width = Math.ceil( parts[ /* x */0 ] / parts [ /* y */1 ] * 12 );
							}
						}
						if ( ! width ) {
							return;
						}
						for ( var i = 3; i > -1; i-- ) {
							var prefix = [ 'xs', 'sm', 'md', 'lg' ][ i ],
								matches = ( new RegExp( '(vc_col)-('+ prefix +')-[0-9\\/]+' ) ).exec( column.className );
							if ( ! matches ) {
								continue;
							}
							// TODO: Change the algorithm to calculate the width without changing the already existing columns
							column.className = column.className.replace( matches[0], matches[1] + '-' + prefix + '-' + width );
						}
					} );
			}
		}
	} );

	$( function() {
		// After loading the document we initialize the preview object
		_window.$usbp = new USBuilderPreview;
	} );
}( window.jQuery );
