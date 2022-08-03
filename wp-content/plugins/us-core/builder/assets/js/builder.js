/**
 * Available spaces
 * _window.$usb - USBuilder class instance
 * _window.$usbcore - Mini library of various methods
 * _window.$usbdata - Data for import into the USBuilder
 * _window.$usof - UpSolution CSS Framework
 *
 * Note: Double underscore `__funcname` is introduced for functions that are created through `$usbcore.debounce(...)`.
 */
! function( $, undefined ) {

	// Private variables that are used only in the context of this function, it is necessary to optimize the code.
	var _window = window,
		_document = document,
		_undefined = undefined;

	// Get the current `UserAgent`
	var ua = _window.navigator.userAgent.toLowerCase();

	// Check for is set objects
	_window.$usbdata = _window.$usbdata || {};

	/**
	 * The functionality for expanding objects
	 *
	 * @var {{}}
	 */
	$usbcore = {};

	/**
	 * Generate unique ID with specified length, will not affect uniqueness!
	 *
	 * @param {String} prefix The prefix to be added to the beginning of the result line
	 * @return {String} Returns unique id
	 */
	$usbcore.uniqid = function( prefix ) {
		return ( prefix || '' ) + Math.random().toString( 36 ).substr( 2, 9 );
	};

	/**
	 * Determines whether the specified value is undefined type or string.
	 *
	 * @param {Mixed} value The value to check.
	 * @return {Boolean} True if the specified value is undefined, False otherwise.
	 */
	$usbcore.isUndefined = function( value ) {
		return '' + _undefined === ( '' + value );
	};

	/**
	 * Detect Firefox
	 *
	 * @return {Boolean} True if firefox, False otherwise.
	 */
	$usbcore.isFirefox = ua.indexOf( 'firefox' ) > -1;

	/**
	 * Detect Safari
	 *
	 * @return {Boolean} True if safari, False otherwise.
	 */
	$usbcore.isSafari = /^((?!chrome|android).)*safari/i.test( ua );

	/**
	 * The function parses a string argument and returns an integer of the specified radix.
	 *
	 * @param {String} value The value
	 * @return {Number}
	 */
	$usbcore.parseInt = function( value ) {
		value = parseInt( value );
		return ! isNaN( value )
			? value
			: 0;
	};

	/**
	 * Get a full copy of the object
	 *
	 * @param {{}} _object The object
	 * @param {{}} _default The default object
	 * @return {{}}
	 */
	$usbcore.clone = function( _object, _default ) {
		return $.extend( /* deep copy */true, {}, _default || {}, _object || {} );
	};

	/**
	 * Compares the plain object.
	 *
	 * @param {{}} firstObject The first object.
	 * @param {{}} secondObject The second object.
	 * @return {Boolean} If the objects are equal it will return True, otherwise False.
	 */
	$usbcore.comparePlainObject = function() {
		var args = arguments;
		for ( var i = 1; i > -1; i-- ) {
			if ( ! $.isPlainObject( args[ i ] ) ) {
				return false;
			}
		}
		return JSON.stringify( args[ /* first */0 ] ) === JSON.stringify( args[ /* second */1 ] );
	};

	/**
	 * Removing passed properties from an object.
	 *
	 * @param {{}} data The input data.
	 * @param {String|[]} props The property or properties to remove.
	 * @return {{}} Returns a cleaned up new object.
	 */
	$usbcore.clearPlainObject = function( data, props ) {
		var self = this;
		if ( ! $.isPlainObject( data ) ) {
			data = {};
		}
		if ( self.isUndefined( props ) ) {
			return data;
		}
		// Props to a single type.
		if ( ! $.isArray( props ) ) {
			props = [ '' + props ];
		}
		// Cloning data to get rid of object references.
		data = self.clone( data );
		// Remove all specified properties from an object.
		for ( var k in props ) {
			var prop = props[ k ];
			if ( ! data.hasOwnProperty( prop ) ) {
				continue;
			}
			delete data[ prop ];
		}
		return data;
	}

	/**
	 * Find a value in data.
	 *
	 * @param {String} value The value to be found.
	 * @param {{}|[]|String} data The object to check example: {one:'one',two:'two'}`, `['one','two']`, `one|two`
	 * @return {Boolean} Returns the index of the value on success, otherwise -1.
	 */
	$usbcore.indexOf = function( value, data ) {
		var self = this;
		if ( $.isPlainObject( data ) ) {
			data = Object.values( data );
		} else if ( typeof data === 'string' && data.indexOf( '|' ) > -1 ) {
			data = data.split( '|' );
		}
		if ( $.isArray( data ) ) {
			return data.indexOf( $.isNumeric( value ) ? value : '' + value );
		}
		return -1;
	};

	/**
	 * Deep search for a value along a path in a simple object
	 *
	 * @param {{}} dataObject Simple data object for search
	 * @param {String} path Dot-delimited path to get value from object
	 * @param {Mixed} _default Default value when no result
	 * @return {Mixed}
	 */
	$usbcore.deepFind  = function( dataObject, path, _default ) {
		var self = this;
		// Remove all characters except the specified ones
		path = ( '' + path )
			.replace( /[^A-z\d\_\.]/g, '' )
			.trim();
		if ( ! path ) {
			return _default;
		}
		// Get the path as an array of keys
		if ( path.indexOf( '.' ) > -1 ) {
			// Split string into array of paths
			path = path.split( '.' );
		} else {
			path = [ path ];
		}
		// Get the result based on an array of keys
		var result = $.isPlainObject( dataObject ) ? dataObject : {};
		for ( k in path ) {
			result = result[ path[ k ] ];
			if ( self.isUndefined( result ) ) {
				return _default;
			}
		}
		// Returning the final result
		return result;
	};

	/**
	 * Escape special characters for PCRE (Perl Compatible Regular Expressions)
	 *
	 * @param {String} value The value
	 * @return {String}
	 */
	$usbcore.escapePcre = function( value ) {
		return ( '' + value ).replace( /[.*+?^${}()|\:[\]\\]/g, '\\$&' ); // $& means the whole matched string
	};

	/**
	 * Escape special characters for attributes
	 * Note: The code is not used.
	 *
	 * @param {String} value The value
	 * @return {String} Returns a string replacing html tags with entities
	 */
	$usbcore.escapeHtml = function( value ) {
		return ( '' + value )
			.replace( '&', '&amp;' )
			.replace( '<', '&lt;' )
			.replace( '>', '&gt;' )
			.replace( '"', '&quot;' )
			.replace( "'", '&#039;' );
	};

	// Prototype mixin for all classes working with events
	$usbcore.mixins = {};
	$usbcore.mixins.events = {
		/**
		 * Attach a handler to an event for the class instance
		 *
		 * @param {String} eventType A string containing event type
		 * @param {Function} handler A functionto execute each time the event is triggered
		 * @param {Boolean} one A function that is executed only once when an event is triggered.
		 */
		on: function( eventType, handler, one ) {
			var self = this;
			if ( self.$$events === _undefined ) {
				self.$$events = {};
			}
			if ( self.$$events[ eventType ] === _undefined ) {
				self.$$events[ eventType ] = [];
			}
			self.$$events[ eventType ].push( {
				handler: handler,
				one: !! one,
			} );
			return self;
		},
		/**
		 * Attach a handler to an event for the class instance. The handler is executed at most once
		 *
		 * @param {String} eventType A string containing event type
		 * @param {Function} handler A function to execute each time the event is triggered
		 */
		one: function( eventType, handler ) {
			return this.on( eventType, handler, /* one */true );
		},
		/**
		 * Remove a previously-attached event handler from the class instance
		 *
		 * @param {String} eventType A string containing event type
		 * @param {Function} [handler] The functionthat is to be no longer executed.
		 * @chainable
		 */
		off: function( eventType, handler ) {
			var self = this;
			if (
				self.$$events === _undefined
				|| self.$$events[ eventType ] === _undefined
			) {
				return self;
			}
			if ( handler !== _undefined ) {
				for ( var handlerPos in self.$$events[ eventType ] ) {
					if ( handler === self.$$events[ eventType ][ handlerPos ].handler ) {
						self.$$events[ eventType ].splice( handlerPos, 1 );
					}
				}
			} else {
				self.$$events[ eventType ] = [];
			}
			return self;
		},
		/**
		 * Execute all handlers and behaviours attached to the class instance for the given event type
		 *
		 * @param {String} eventType A string containing event type
		 * @param {[]} extraParams Additional parameters to pass along to the event handler
		 * @chainable
		 */
		trigger: function( eventType, extraParams ) {
			var self = this;
			if (
				self.$$events === _undefined
				|| self.$$events[ eventType ] === _undefined
				|| self.$$events[ eventType ].length === 0
			) {
				return self;
			}
			var args = arguments,
				params = ( args.length > 2 || ! $.isArray( extraParams ) )
					? [].slice.call( args, 1 )
					: extraParams;
			for ( var i = 0; i < self.$$events[ eventType ].length; i++ ) {
				var event = self.$$events[ eventType ][ i ];
				event.handler.apply( event.handler, params );
				if ( !! event.one ) {
					self.off( eventType, event.handler );
				}
			}
			return self;
		}
	};

	/**
	 * Determines whether the specified elm is node type
	 *
	 * @param {Node|Mixed} node The node from document
	 * @return {Boolean} True if the specified elm is node type, False otherwise
	 */
	$usbcore.isNode = function( node ) {
		return !! node && node.nodeType;
	};

	/**
	 * Get the size of the element and its position relative to the viewport
	 *
	 * @param {Node} node The node from document
	 * @return {{}}
	 */
	$usbcore.$rect = function( node ) {
		return this.isNode( node )
			? node.getBoundingClientRect()
			: {};
	};

	/**
	 * Adds the specified class(es) to each element in the set of matched elements
	 *
	 * @param {Node} node The node from document
	 * @param {String} className One or more classes (separated by spaces) to be toggled for each element in the matched set
	 * @return self
	 */
	$usbcore.$addClass = function( node, className ) {
		var self = this;
		if ( self.isNode( node ) && className ) {
			node.classList.add( className );
		}
		return self;
	};

	/**
	 * Remove a single class or multiple classes from each element in the set of matched elements
	 *
	 * @param {Node} node The node from document
	 * @param {String} className One or more classes (separated by spaces) to be toggled for each element in the matched set
	 * @return self
	 */
	$usbcore.$removeClass = function( node, className ) {
		var self = this;
		if ( self.isNode( node ) && className ) {
			( className.split( ' ' ) || [] ).map( function( itemClassName ) {
				if ( ! itemClassName ) {
					return;
				}
				node.classList.remove( itemClassName );
			} );
		}
		return self;
	};

	/**
	 * Add or remove one or more classes from each element in the set of matched elements,
	 * depending on either the class's presence or the value of the state argument
	 *
	 * @param {Node} node The node from document
	 * @param {String} className One or more classes (separated by spaces) to be toggled for each element in the matched set.
	 * @param {Boolean} state A boolean (not just truthy/falsy) value to determine whether the class should be added or removed
	 * @return self
	 */
	$usbcore.$toggleClass = function( node, className, state ) {
		var self = this;
		if ( self.isNode( node ) && className ) {
			self[ !! state ? '$addClass' : '$removeClass' ]( node, className );
		}
		return self;
	};

	/**
	 * Determine whether any of the matched elements are assigned the given class
	 *
	 * @param {Node} node The node from document
	 * @param {String} className The class name one or more separated by a space
	 * @return {Boolean} True, if there is at least one class, False otherwise
	 */
	$usbcore.$hasClass = function( node, className ) {
		var self = this;
		if ( self.isNode( node ) && className ) {
			var classList = ( className.split( ' ' ) || [] );
			for ( var i in classList ) {
				className = '' + classList[ i ];
				if ( ! className ) {
					continue;
				}
				return ( '' + self.$attr( node, 'class' ) ).indexOf( className ) !== -1;
			}
		}
		return false;
	};

	/**
	 * Get or Set the attribute value for the passed node
	 *
	 * @param {Node} node The node from document
	 * @param {String} name The attribute name
	 * @param {String} value The value
	 * @return {Mixed}
	 */
	$usbcore.$attr = function( node, name, value ) {
		var self = this;
		if ( ! self.isNode( node ) || ! name ) {
			return;
		}
		// Set value to attribute.
		if ( ! self.isUndefined( value ) ) {
			node.setAttribute( name, value );
			return self;
		}
		// Get value in attribute.
		else if ( !! node[ 'getAttribute' ] ) {
			return node.getAttribute( name ) || '';
		}
		return;
	};

	/**
	 * Remove element
	 *
	 * @param {Node} node The node from document
	 * @return self
	 */
	$usbcore.$remove = function( node ) {
		var self = this;
		if ( self.isNode( node ) ) {
			node.remove();
		}
		return self;
	};

	/**
	 * Copying the passed text to the clipboard
	 *
	 * @param {String} text The text to copy
	 * @return {Boolean}
	 */
	$usbcore.copyTextToClipboard = function( text ) {
		var self = this;
		try {
			// Add a temporary field for the record
			var textarea = _document.createElement( 'textarea' );
			textarea.value = '' + text;
			self.$attr( textarea, 'readonly', '' );
			self.$attr( textarea, 'css', 'position:absolute;top:-9999px;left:-9999px' );
			_document.body.append( textarea );
			// Copy text to clipboard
			textarea.select();
			_document.execCommand( 'copy' );
			// The unselect data
			if ( _window.getSelection ) {
				_window.getSelection().removeAllRanges();
			} else if ( _document.selection ) {
				_document.selection.empty();
			}
			// Remove temporary field from document
			self.$remove( textarea );
			return true;
		} catch ( e ) {
			return false;
		}
	};

	/**
	 * Function wrapper for use in debounce or throttle
	 *
	 * @param {Function} fn The function to be executed
	 */
	$usbcore.fn = function( fn ) {
		if ( $.isFunction( fn ) ) {
			fn();
		}
	};

	/**
	 * Returns a new function that, when invoked, invokes `fn` at most once per `wait` milliseconds.
	 *
	 * @param {Function} fn Function to wrap
	 * @param {Number} wait Timeout in ms (`100`)
	 * @param {Boolean} no_trailing Optional, defaults to false.
	 *		If no_trailing is true, `fn` will only execute every `wait` milliseconds while the
	 *		throttled-function is being called. If no_trailing is false or unspecified,
	 *		`fn` will be executed one final time after the last throttled-function call.
	 *		(After the throttled-function has not been called for `wait` milliseconds, the internal counter is reset)
	 *
	 * In this visualization, | is a throttled-function call and X is the actual
	 * callback execution:
	 *
	 * > Throttled with `no_trailing` specified as False or unspecified:
	 *	||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
	 *	X    X    X    X    X    X        X    X    X    X    X    X
	 *
	 * > Throttled with `no_trailing` specified as True:
	 *	||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
	 *	X    X    X    X    X             X    X    X    X    X
	 *
	 * @return (Function) A new, throttled, function.
	 */
	$usbcore.throttle = function( fn, wait, no_trailing, debounce_mode ) {
		if ( ! $.isFunction( fn ) ) {
			return $.noop;
		}
		if ( ! $.isNumeric( wait ) ) {
			wait = 100; // Default
		}
		if ( typeof no_trailing !== 'boolean' ) {
			no_trailing = _undefined;
		}

		var last_exec = 0, that = this, timeout, context, args;
		return function () {
			context = this;
			args = arguments;
			var elapsed = +new Date() - last_exec;
			function exec() {
				last_exec = +new Date();
				fn.apply( context, args );
			};
			function clear() {
				timeout = _undefined;
			};
			if ( debounce_mode && ! timeout ) {
				exec();
			}
			timeout && that.clearTimeout( timeout );
			if ( that.isUndefined( debounce_mode ) && elapsed > wait ) {
				exec();
			} else if ( no_trailing !== true ) {
				timeout = that.timeout(
					debounce_mode
						? clear
						: exec,
					that.isUndefined( debounce_mode )
						? wait - elapsed
						: wait
				);
			}
		};
	};

	/**
	 * Returns a function, that, as long as it continues to be invoked, will not
	 * be triggered. The functionwill be called after it stops being called for
	 * N milliseconds. If `immediate` is passed, trigger the functionon the
	 * leading edge, instead of the trailing. The functionalso has a property 'clear'
	 * that is a functionwhich will clear the timer to prevent previously scheduled executions.
	 *
	 * @param {Function} fn Function to wrap
	 * @param {Number} wait Timeout in ms (`100`)
	 * @param {Boolean} at_begin Optional, defaults to false.
	 *		If at_begin is false or unspecified, `fn` will only be executed `wait` milliseconds after
	 *		the last debounced-function call. If at_begin is true, `fn` will be executed only at the
	 *		first debounced-function call. (After the throttled-function has not been called for `wait`
	 *		milliseconds, the internal counter is reset)
	 *
	 * In this visualization, | is a throttled-function call and X is the actual
	 * callback execution:
	 *
	 * > Debounced with `at_begin` specified as False or unspecified:
	 *	||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
	 *	                         X                                 X
	 *
	 * > Debounced with `at_begin` specified as True:
	 *	||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
	 *	X                                 X
	 *
	 *  @return (Function) A new, debounced, function.
	 */
	$usbcore.debounce = function( fn, wait, at_begin ) {
		var self = this;
		return self.isUndefined( at_begin )
			? self.throttle( fn, wait, _undefined, false )
			: self.throttle( fn, wait, at_begin !== false );
	};

	/**
	 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
	 * @param {Function} fn The callback function
	 * @param {Number} delay The delay in milliseconds
	 */
	$usbcore.timeout = function( fn, delay ) {
		var start = new Date().getTime(),
			handle = {};

		function loop() {
			var current = new Date().getTime(),
				delta = current - start;
			delta >= delay
				? fn.call()
				: handle.value = _window.requestAnimationFrame( loop );
		};
		handle.value = _window.requestAnimationFrame( loop );
		return handle;
	};

	/**
	 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
	 * @param {Number|{}} fn The callback function.
	 */
	$usbcore.clearTimeout = function( handle ) {
		if ( handle ) {
			_window.cancelAnimationFrame( handle.value );
		}
	};

	/**
	* Redirecting messages from a frame to an object event
	*
	* @param {Event} e The Event interface represents an event which takes place in the DOM.
	* @param void
	* @private
	*/
	$usbcore._onMessage = function( e ) {
		var data, self = this;
		try {
			data = JSON.parse( e.data );
		} catch ( e ) {
			return;
		}
		if ( data instanceof Array && data[ /* Namespace */ 0 ] === 'usb' && data[ /* Event */ 1 ] !== _undefined ) {
			self.trigger( data[ /* Event */ 1 ], data[ /* Arguments */ 2 ] || [] );
		}
	};

	// Export to window
	_window.$usbcore = $usbcore;

	/**
	 * Default data models
	 *
	 * @private
	 * @type {{}}
	 */
	var _default = {
		// Default page data object.
		pageData: {
			content: '', // Page content
			customCss: '', // Page Custom CSS
			pageMeta: {}, // Page Meta Data
			fields: {} // Page fields post_title, post_status, post_name etc.
		},
		// Default object of change history
		changesHistory: {
			redo: [], // Data redo stack
			tasks: [], // All tasks to recover
			undo: [] // Data undo stack
		},
		// Default config for the builder
		config: {
			shortcode: {
				// List of container shortcodes (with a closing tag)
				containers: [],
				// List of shortcodes whose value is content
				edit_content: {},
				// List of default values for shortcodes
				default_values: {},
				// The a list of strict relations between shortcodes
				relations: {},
			},

			// List of usof field types for which to use throttle
			useThrottleForFields: [],

			// List of usof field types for which the update interval is used
			useLongUpdateForFields: [],

			// Available shortcodes and their titles
			elm_titles: {},

			// Templates shortcodes or html
			template: {},

			// Default parameters for AJAX requests
			ajaxArgs: {},

			// Get screen sizes of responsive states
			breakpoints: {},

			// Default placeholder (Used in importing shortcodes)
			placeholder: '',

			// Post types for selection in Grid element (Used in importing shortcodes)
			grid_post_types: [],

			// Meta key for post custom css
			keyCustomCss: 'usb_post_custom_css', // Default

			// Link to preview page
			previewUrl: '',

			// A single place for the names of classes that are used in different places in the builder
			className: {
				// A class that indicates that the element is in the state of loading from the server
				elmLoading: 'usb-elm-loading'
			}
		}
	};

	/**
	 * @class USBuilder
	 * @param {String} container The main container
	 * TODO: Create a navigator for the panel. This will reduce the amount of code and apply the settings.
	 */
	var USBuilder = function( container ) {
		var self = this;

		// Base elements
		self.$document = $( _document );
		self.$html = $( 'html', self.$document );
		self.$body = $( 'body', self.$html );
		// Main container
		self.$container = $( container );
		self.$notifyPrototype = $( '.us-builder-notification', self.$container );
		// Panel elements
		self.$panel = $( '.us-builder-panel', self.$container );
		self.$panelBody = $( '.us-builder-panel-body', self.$panel );
		self.$panelElms = $( '.us-builder-panel-elms', self.$panel );
		self.$panelFieldsets = $( '.us-builder-panel-fieldsets', self.$panel );
		self.$panelImportContent = $( '.us-builder-panel-import-content', self.$panel );
		self.$panelImportTextarea = $( '.us-builder-panel-import-content textarea:first', self.$panel );
		self.$panelMessages = $( '.us-builder-panel-messages', self.$panel );
		self.$panelPageCustomCss = $( '.us-builder-panel-page-custom-css', self.$panel );
		self.$panelPageSettings = $( '.us-builder-panel-page-settings', self.$panel );
		self.$panelSearchElms = $( '[data-search-text]', self.$panel );
		self.$panelSearchField = $( 'input[name=search]', self.$panel );
		self.$panelSearchNoResult = $( '.us-builder-panel-elms-search-noresult', self.$panel );
		self.$panelTitle = $( '.us-builder-panel-header-title', self.$panel );
		// Panel Actions
		self.$panelActionElmAdd = $( '.usb_action_elm_add', self.$panel );
		self.$panelActionPageCustomCss = $( '.usb_action_show_page_custom_css', self.$panel );
		self.$panelActionPageSettings = $( '.usb_action_show_page_settings', self.$panel );
		self.$panelActionRedo = $( '.usb_action_redo', self.$panel );
		self.$panelActionSaveChanges = $( '.usb_action_save_changes', self.$panel );
		self.$panelActionSavePastedContent = $( '.usb_action_save_pasted_content', self.$panel );
		self.$panelActionShowMenu = $( '.usb_action_show_menu', self.$panel );
		self.$panelActionToggleResponsiveMode = $( '.usb_action_toggle_responsive_mode', self.$panel );
		self.$panelActionUndo = $( '.usb_action_undo', self.$panel );
		// Preview elements
		self.$preview = $( '.us-builder-preview', self.$container );
		self.$iframe = $( 'iframe', self.$preview );
		self.$iframeWrapper = $( '.us-builder-preview-iframe-wrapper', self.$preview );
		// Preview toolbar elements
		self.$previewToolbar = $( '.us-builder-preview-toolbar', self.$preview );
		self.$toolbarResponsiveStates = $( '[data-responsive-state]', self.$previewToolbar );

		// The add information from `UserAgent` to bind styles to specific browsers or browser versions.
		self.$html
			.attr( 'data-useragent', ua );

		// Variables
		self._elmsFieldset = {};
		self._fieldsets = {}; // Other fieldsets
		self._hotkeyStates = {}; // Storing all hotkey states
		self.iframe = self.$iframe[0] || {};
		self.iframe.isLoad = false;
		self.pageData = $usbcore.clone( _default.pageData ); // Empty default data object

		/**
		 * Private temp data
		 * @private
		 */
		self._$temp = {
			// TODO: If possible, try to get rid of the cache.
			_latestShortcodeUpdates: {}, // Latest updated shortcode data (The cache provides correct data when multiple threads `debounce` or `throttle` are running)
			changesHistory: $usbcore.clone( _default.changesHistory ), // Data change history stack
			generatedIds: [], // List of generated IDs
			isActiveRecoveryTask: false, // This is a flag saying data recovery activity
			isFieldsetsLoaded: false, // This param will be True when fieldsets are loaded otherwise it will be False
			isInputCustomCss: false, // Flag for entering custom styles in the editor.
			isProcessSave: false, // The AJAX process of saving data on the backend
			savedPageData: $usbcore.clone( _default.pageData ), // Save the last saved page data.
			transit: null, // Transit data
			xhr: {} // XMLHttpRequests
		};
		/**
		 * Public temp data
		 * @private
		 */
		self._temp = {};

		/**
		 * Default responsive state
		 * @var {String}
		 */
		self.defaultResponsiveState = 'default';

		/**
		 * The main container that is the root of the current page
		 */
		self.mainContainer = 'container';

		/**
		 * The variable store the current mode
		 *
		 * @private
		 * @var {String} Builder mode: 'editor', 'preview', 'drag:add', 'drag:move'
		 */
		self._mode = self.isHidePanel()
			? 'preview'
			: 'editor';

		/**
		 * @var {String} Hovered element's usbid, e.g. 'us_btn:1'
		 */
		self.hoveredElmId;

		/**
		 * @var {String} Selected element (shortcode) usbid, e.g. 'us_btn:1'
		 */
		self.selectedElmId;

		/**
		 * @var {String} Active fieldset for an element
		 */
		self.activeElmFieldset = null;

		/**
		 * @var {Node} Active fieldset DOM element
		 */
		self.$activeElmFieldset = null;

		/**
		 * Load usb config
		 * Note: The object stores all received config from the backend,
		 * this is a single entry point for config
		 */
		self._config = $usbcore.clone( _default.config );
		if ( self.$container.is( '[onclick]' ) ) {
			self._config = $.extend( self._config, self.$container[ 0 ].onclick() || {} );
			self.$container.removeAttr( 'onclick' );
		}

		// This event is needed to get various data from the iframe
		_window.onmessage = $usbcore._onMessage.bind( self );

		/*
		 * When the user is trying to load another page, or reloads current page
		 * show a confirmation dialog when there are unsaved changes.
		 */
		_window.onbeforeunload = function( e ) {
			if ( self.isPageChanged() ) {
				e.preventDefault();
				// The return string is needed for browser compat.
				// See https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event.
				return self.getTextTranslation( 'page_leave_warning' );
			}
		};

		/**
		 * Bondable events.
		 *
		 * @private
		 * @var {{}}
		 */
		self._events = {
			// Event handlers for fieldsets
			toggleTabs: self.$$fieldsets._toggleTabs.bind( self ) // Specific location
		};

		// List of available events
		// TODO: Optimize and get rid of this list of events.
		[
			// Global changes
			'contentChange',
			'modeChange',

			// Event handlers for device toolbar
			'hideResponsiveToolbar',
			'switchStates',

			// Event handlers for panel
			'changePastedContent',
			'resetSearchInPanel',
			'saveChanges',
			'savePastedContent',
			'searchPanelElms',
			'submitPreviewChanges',
			'switchPanel',
			'toggleResponsiveMode',

			// Data history events
			'historyChanged',
			'redoChange',
			'undoChange',

			// Event handlers for panel screens
			'showPanelImportContent',
			'showPanelPageCustomCss',
			'showPanelPageSettings',

			// Track DragAndDrop events when adding a new element
			'dragstart', // Standard `dragstart` browser event handler.
			'endDrag',
			'maybeDrag',
			'maybeStartDrag',
			'showPanelAddElms',

			// Event handlers for fieldsets
			'afterHideField',
			'changeDesignField',
			'changeField',
			'changeFieldResponsiveState',
			'changePageCustomCss',
			'changePageMeta',
			'changePageSettings',

			// Other handlers
			'closeNotification',
			'elmCopy',
			'elmDelete',
			'elmDuplicate',
			'elmLeave',
			'elmMove',
			'elmSelected',
			'iframeLoad',
			'setParamsForPageSettings',
			'keydown' // Standard `keydown` browser event handler.

		].map( function( event ) {
			if ( event && $.isFunction( self[ '_' + event ] ) ) {
				self._events[ event ] = self[ '_' + event ].bind( self );
			}
		} );

		// Subscription to private events
		// TODO: Optimize and get rid of these permissions.
		[
			'contentChange',			// The event is triggered every time the html on the preview page has changed
			'elmCopy',					// The event of copying shortcode to clipboard
			'elmDelete',				// The handler when the delete element
			'elmDuplicate',				// The handler when the duplicate element
			'elmLeave',					// The event when the cursor moves out of the bounds of an element
			'elmMove',					// The event when the cursor enters the bounds of an element
			'elmSelected',				// The event of selecting an element, and getting an id
			'endDrag',					// The completion handler is drag and drop in iframe
			'historyChanged', 			// The handler for changes in the data history
			'modeChange',				// The watches the mode change
			'redoChange',				// The recovery data handler from preview page (ctrl+v)
			'undoChange'				// The recovery data handler from preview page (ctrl+z)
		].map( function( method ) {
			if ( !! self._events[ method ] && $.isFunction( self._events[ method ] ) ) {
				self.on( method, self._events[ method ] );
			}
		} );

		// Events
		self.$document
			// Reset drag start defaults
			.on( 'dragstart', self._events.dragstart )
			// Close notification handler
			.on( 'click', '.usb_action_notification_close', self._events.closeNotification )
			// Hide responsive states toolbar
			.on( 'click', '.usb_action_hide_states_toolbar', self._events.hideResponsiveToolbar )
			// Capturing keyboard shortcuts
			.on( 'keydown', self._events.keydown );

		self.$previewToolbar
			// Handler for switching responsive states on the toolbar
			.on( 'click', '[data-responsive-state]', self._events.switchStates );

		self.$iframe
			// Temporary - add highlight to first row
			.on( 'load', $usbcore.debounce( self._events.iframeLoad, 1 ) );

		self.$panel
			// Toggles the USOF tabs of the settings panel
			.on( 'click', '.usof-tabs-item', self._events.toggleTabs )
			// Show/Hide panel
			.on( 'click', '.us-builder-panel-switcher', self._events.switchPanel )
			// Show a list of elements to add
			.on( 'click', '.usb_action_elm_add', self._events.showPanelAddElms )
			// Show/Hide responsive mode
			.on( 'click', '.usb_action_toggle_responsive_mode', self._events.toggleResponsiveMode )
			// Saving changes to the backend
			.on( 'click', '.usb_action_save_changes', self._events.saveChanges )
			// Search box character input handler
			.on( 'input', 'input[name=search]', $usbcore.debounce( self._events.searchPanelElms, 1 ) )
			// Handler for reset search in Panel
			.on( 'click', '.usb_action_reset_search', self._events.resetSearchInPanel )
			// Show import content `Paste Row/Section`
			.on( 'click', '.usb_action_show_import_content', self._events.showPanelImportContent )
			// Handler for changes in the import content.
			.on( 'change input blur', '.us-builder-panel-import-content textarea', self._events.changePastedContent )
			// Handler for save pasted content button.
			.on( 'click', '.usb_action_save_pasted_content', self._events.savePastedContent )
			// Handler for showing custom css input for the page
			.on( 'click', '.usb_action_show_page_custom_css', self._events.showPanelPageCustomCss )
			// Handler for showing page settings.
			.on( 'click', '.usb_action_show_page_settings', self._events.showPanelPageSettings )
			// Undo/Redo handlers
			.on( 'click', '.usb_action_undo', self._events.undoChange )
			.on( 'click', '.usb_action_redo', self._events.redoChange )
			// Handler for create revision and show a preview page
			.on( 'submit', 'form#wp-preview', self._events.submitPreviewChanges );

		// Show the section "Add elements" (Default)
		self.showPanelAddElms();

		// Initialize loading the iframe
		self.$iframe
			.attr( 'src', self.$iframe.data( 'src' ) || '' )
			.removeAttr( 'data-src' );
	};

	/**
	 * @type {USBuilder}
	 */
	var $usbPrototype = USBuilder.prototype;

	/**
	 * Transports for send messages between windows or objects
	 */
	$.extend( $usbPrototype, $usbcore.mixins.events, {
		/**
		 * Send message to iframe
		 *
		 * @param {String} eventType A string containing event type
		 * @param {[]} extraParams Additional parameters to pass along to the event handler
		 * @chainable
		 */
		postMessage: function( eventType, extraParams ) {
			var self = this;
			if ( ! self.iframe.isLoad ) {
				return;
			}
			self.iframe.contentWindow.postMessage( JSON.stringify( [ /* Namespace */'usb', eventType, extraParams ] ) );
		},

		/**
		 * Forwarding events through document
		 *
		 * @param {String} eventType A string containing event type
		 * @param {[]} extraParams Additional parameters to pass along to the event handler
		 * @chainable
		 */
		triggerDocument: function( eventType, extraParams ) {
			this.$document.trigger( /* Namespace */'usb.' + eventType, extraParams );
		}
	});

	/**
	 * Functionality for implementing notifications
	 */
	$.extend( $usbPrototype, {
		/**
		 * Types of notifications
		 */
		_NOTIFY_TYPE: {
			ERROR: 'error',
			INFO: 'info',
			SUCCESS: 'success'
		},

		/**
		 * Show notify.
		 *
		 * @param {String} message The message
		 * @param {String} type The type
		 *
		 * TODO: Add displaying multiple notifications as a list!
		 */
		notify: function( message, type ) {
			var self = this,
				// Time after which the notification will be remote.
				autoCloseDelay = 4000, // 4 seconds
				// Get prototype
				$notification = self.$notifyPrototype
					.clone()
					.removeClass( 'hidden' );
			// Set notification type
			if ( !! type && $usbcore.indexOf( type, self._NOTIFY_TYPE ) > -1 ) {
				$notification
					.addClass( 'type_' + type );
			}
			// If the notification type is not an error, then add a close timer.
			if ( type !== self._NOTIFY_TYPE.ERROR ) {
				$notification
					.addClass( 'auto_close' )
					.data( 'handle', $usbcore.timeout( function() {
						$notification
							.find( '.usb_action_notification_close' )
							.trigger( 'click' );
					}, autoCloseDelay ) );
			}
			// Add message to notification
			$notification
				.find( 'span' )
				.html( '' + message );
			// Show notification
			self.$panel
				.append( $notification );
		},

		/**
		 * Close notification handler
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_closeNotification: function( e ) {
			var $notification = $( e.target ).closest( '.us-builder-notification' ),
				handle = $notification.data( 'handle' );
			if ( !! handle ) {
				$usbcore
					.clearTimeout( handle );
			}
			$notification
				.fadeOut( 'fast', function() {
					$notification.remove();
				} );
		},

		/**
		 * Closes all notification
		 */
		closeAllNotification: function() {
			var self = this;
			$( '.us-builder-notification', self.$body )
				.fadeOut( 'fast', function() {
					$( this ).remove();
				} );
		}
	} );

	/**
	 * Functional for implementing responsive states
	 */
	$.extend( $usbPrototype, {

		/**
		 * Determines if hide responsive toolbar
		 *
		 * @return {Boolean} True if hide responsive toolbar, False otherwise.
		 */
		isHideResponsiveToolbar: function() {
			return ! this.$preview.hasClass( 'responsive_mode' );
		},

		/**
		 * Hide responsive toolbar
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_hideResponsiveToolbar: function( e ) {
			var self = this;
			if ( self.isHideResponsiveToolbar() ) return;
			// Hide responsive toolbar
			self.toggleResponsiveToolbar( false );
			// Set the preview state
			self.setResponsiveState(/* default */);
			// Forwarding events through document
			self.triggerDocument( 'setResponsiveState' /* default */ );
		},

		/**
		 * Handler for switching responsive states on the toolbar
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_switchStates: function( e ) {
			var self = this,
				responsiveState = $usbcore.$attr( e.target, 'data-responsive-state' );
			self.setResponsiveState( responsiveState );
			// Forwarding events through document
			self.triggerDocument( 'setResponsiveState', responsiveState );
		},

		/**
		 * Show/Hide responsive toolbar
		 *
		 * @param {Boolean} mode The responsive mode
		 */
		toggleResponsiveToolbar: function( mode ) {
			var self = this;
			mode = !! mode;
			self.$preview
				.toggleClass( 'responsive_mode', mode );
			self.$panelActionToggleResponsiveMode
				.toggleClass( 'active', mode );
		},

		/**
		 * Set the preview responsive state
		 *
		 * @param {String} [responsiveState] responsive state (if you do not pass the parameter, the default type will be set)
		 */
		setResponsiveState: function( responsiveState ) {
			var self = this;

			// Check the correctness of the passed parameter
			if ( $.inArray( responsiveState, self.config( 'responsiveStates', [] ) ) === -1 ) {
				responsiveState = self.defaultResponsiveState;
			}

			// Check the changes
			if (
				self.isHideResponsiveToolbar()
				&& self._$temp.currentResponsiveState === responsiveState
			) {
				return;
			}
			self._$temp.currentResponsiveState = responsiveState;

			// Highlight the current state
			self.$toolbarResponsiveStates
				.removeClass( 'active' )
				.filter( '[data-responsive-state="'+ responsiveState +'"]:first' )
				.addClass( 'active' );

			// Set the current mod
			self.$iframeWrapper
				.usMod( 'responsive_state', ( responsiveState === self.defaultResponsiveState ) ? /* Remove mod */false : responsiveState );

			// Apply max-width to the iframe
			self.$iframe
				.css( 'max-width', self.config( 'breakpoints.' + responsiveState + '.breakpoint', '100%' ) );
		},

		/**
		 * Get the current responsive state
		 *
		 * @return {String} responsive state slug
		 */
		getCurrentResponsiveState: function() {
			var self = this;
			return self._$temp.currentResponsiveState || self.defaultResponsiveState;
		}
	} );

	/**
	 * Functionality for handling private events
	 */
	$.extend( $usbPrototype, {

		/**
		 * Keyboard shortcut capture handler
		 * Note: When the developer panel is open, it keydown may not work due to focus outside the document.
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_keydown: function( e ) {
			if ( e.type !== 'keydown' ) {
				return;
			}

			var self = this,
				// Defining hotkey states.
				isUndo = ( ( e.metaKey || e.ctrlKey ) && ! e.shiftKey && e.which === 90 ), // `(command|ctrl)+z` combination
				isRedo = ( ( e.metaKey || e.ctrlKey ) && e.shiftKey && e.which === 90 ); // `(command|ctrl)+shift+z` combination

			/**
			 * Defining and saving hotkey states.
			 * @var {{}}
			 */
			self._hotkeyStates = {
				undo: isUndo,
				redo: isRedo
			};

			if ( isUndo ) {
				self.trigger( 'undoChange' );
			}
			if ( isRedo ) {
				self.trigger( 'redoChange' );
			}

			// Exclude events the context of which form elements
			if (
				( isUndo || isRedo )
				&& $.inArray( ( e.target.tagName || '' ).toLowerCase(), [ 'input', 'textarea' ] ) > -1
			) {
				e.preventDefault();
			}
		},

		/**
		 * The handler that is called every time the mode is changed
		 *
		 * @private
		 * @event handler
		 * @param {String} newMode
		 * @param {String} oldMode
		 */
		_modeChange: function( newMode, oldMode ) {
			// The hide all highlights
			this.postMessage( 'doAction', 'hideHighlight' );
		},

		/**
		 * Handler when the selecting an element, and getting an id
		 *
		 * @private
		 * @event handler
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 */
		_elmSelected: function( id ) {
			var self = this;
			if (
				! self.isMode( 'editor' )
				|| ! self.doesElmExist( id )
				|| self.selectedElmId === id
			) {
				return;
			}
			if ( self.doesElmExist( id ) ) {
				// Show fieldset for element
				self.initElmFieldset( id, function() {
					// Setting initial positions for scrolling
					self.$panelBody
						.get( 0 )
						.scrollTo( /*X*/0, /*Y*/0 );
				} );
			} else {
				// The hide all highlights
				self.postMessage( 'doAction', 'hideHighlight' );
			}
		},

		/**
		 * Handler when the cursor enters the bounds of an element
		 *
		 * @private
		 * @event handler
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 */
		_elmMove: function( id ) {
			var self = this;
			if (
				! self.isMode( 'editor' )
				|| ! self.doesElmExist( id )
				|| self.hoveredElmId == id
			) {
				return;
			}
			self.hoveredElmId = id;
		},

		/**
		 * Handler when the cursor moves out of the bounds of an element
		 *
		 * @private
		 * @event handler
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 */
		_elmLeave: function( id ) {
			var self = this;
			if ( ! self.isMode( 'editor' ) ) {
				return;
			}
			self.hoveredElmId = null;
		},

		/**
		 * Handler when the duplicate element
		 *
		 * @private
		 * @event handler
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 */
		_elmDuplicate: function( id ) {
			var self = this;
			if ( ! self.isValidId( id ) ) {
				return;
			}
			var // Determine the need to update including the parent
				isUpdateIncludeParent = self.isUpdateIncludeParent( id ),
				// Get parent ID
				parentId = self.getElmParentId( id ),
				// Get shortcode string
				strShortcode = self.getElmShortcode( id ) || '',
				newId; // New spare ID

			strShortcode = strShortcode
				// Removing all `el_id` from the design_options
				.replace( /(\s?el_id="([^\"]+)")/gi, '' )
				// Replace all identifiers
				.replace( /usbid="([^\"]+)"/gi, function( _, elmId ) {
					elmId = self.getSpareElmId( self.getElmType( elmId ) );
					if ( ! newId ) {
						newId = elmId;
					}
					return 'usbid="'+ elmId +'"';
				} );

			if ( ! strShortcode || ! newId ) return;

			// Determine index for duplicate
			var index = 0,
				siblingsIds = self.getElmSiblingsId( id ) || [];
			for ( var i in siblingsIds ) {
				if ( siblingsIds[ i ] === id ) {
					index = ++i;
					break;
				}
			}

			// Added shortcode to content
			if ( ! self._addShortcodeToContent( parentId, index, strShortcode ) ) {
				return;
			}

			// Send a signal to add a duplicate
			self.trigger( 'contentChange' );

			var // Position to add on the preview page
				position = 'after',
				isContainer = self.isElmContainer( id );

			// Add temporary loader
			self.postMessage( 'showPreloader', [ id, position, isContainer, /* Preloader id */newId ] );

			// Get a rendered shortcode
			self._renderShortcode( /* request id */newId, {
				data: {
					content: isUpdateIncludeParent
						? self.getElmShortcode( parentId )
						: strShortcode
				},
				success: function( res ) {
					// Remove temporary loader
					self.postMessage( 'hidePreloader', newId );
					if ( ! res.success ) {
						return;
					}
					var html = '' + res.data.html;
					// Show all elements that have animations.
					html = html.replace( 'us_animate_this', 'us_animate_this start' );

					// Add new shortcde to preview page
					if ( isUpdateIncludeParent ) {
						self.postMessage( 'updateSelectedElm', [ parentId, html ] );
					} else {
						self.postMessage( 'insertElm', [ id, position, html ] );
						// Init its JS if needed
						self.postMessage( 'maybeInitElmJS', newId );
						// Initialize editing a duplicate element
						self.trigger( 'elmSelected', newId );
					}
					self.postMessage( 'duplicateElmId', newId );

					// Commit to save changes to history
					self.commitChangeToHistory( newId, self._CHANGED_ACTION.CREATE );
				},
				abort: function( abortId ) {
					self.postMessage( 'hidePreloader', abortId );
				}
			} );
		},

		/**
		 * Handler for copying shortcode to clipboard
		 *
		 * @private
		 * @event handler
		 * @param {String} id Shortcode's usbid, e.g. "vc_row:1"
		 */
		_elmCopy: function( id ) {
			var self = this;
			if ( ! self.isValidId( id ) ) {
				return;
			}
			// Copy row shortcode to clipboard
			$usbcore.copyTextToClipboard( self.getElmShortcode( id ) );
		},
		/**
		 * Handler when the delete element
		 *
		 * @private
		 * @event handler
		 * @param {String} removeId Shortcode's usbid, e.g. "us_btn:1"
		 */
		_elmDelete: function( removeId ) {
			var self = this;
			if ( ! self.isValidId( removeId ) ) {
				return;
			}

			// The check if this is the last column then delete the parent row*
			if (
				self.isSecondElmContainer( removeId )
				&& self.getElmSiblingsId( removeId ).length === 1
			) {
				removeId = self.getElmParentId( removeId );
			}

			// Remove the element
			self.removeElm( removeId );
		},

		/**
		 * Loads a preview
		 *
		 * @private
		 * @event handler
		 */
		_iframeLoad: function() {
			var self = this;
			self.iframe.isLoad = true;
			if ( ! self.iframe.contentDocument ) {
				return;
			}

			// Remove reboot class if installed.
			if ( self.$iframe.hasClass('reboot') ) {
				self.$iframe.removeClass( 'reboot' );
			}

			// Get iframe window.
			var iframeWindow = self.iframe.contentWindow;

			// If meta parameters are set for preview we ignore data saving.
			if ( ( iframeWindow.location.search || '' ).indexOf( '&meta' ) !== -1 ) {
				return;
			}

			// The hide all highlights
			self.postMessage( 'doAction', 'hideHighlight' );

			/**
			 * Import data and save the current and last saved object.
			 * Note: The data is unrelated because the preview can be reloaded to show the changes.
			 *
			 * @type {{}}
			 */
			self.pageData = $usbcore.clone( ( iframeWindow.$usbdata || {} ).pageData || {}, _default.pageData );
			self._$temp.savedPageData = $usbcore.clone( self.pageData );

			// Check if there is a css set the label
			if ( !! self.pageData.customCss ) {
				self.$panelActionPageCustomCss
					.addClass( 'css_not_empty' );
			}

			// Loading all deferred fieldsets
			$usbcore.timeout( self._loadDeferredFieldsets.bind( self ), 100 );

			// Event after loading the frame and all data
			self.trigger( 'iframeLoaded' );
		},

		/**
		 * Reload preview page
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @type debounced
		 */
		__iframeReload: $usbcore.debounce( function() {
			var self = this;
			self.$iframe.addClass( 'reboot' );
			self.iframe.src = self.config( 'previewUrl', '' ) + '&' + $.param( { meta: self.pageData.pageMeta || {} } );
		}, 1 ),

		/**
		 * Handler when content changes on the preview page
		 * Note: All handler calls must be after change `$usb.pageData.content`!
		 *
		 * @private
		 * @event handler
		 */
		_contentChange: function() {
			var self = this,
				// The Disabled/Enable save button
				isPageChanged = self.isPageChanged();
			self.$panelActionSaveChanges
				.toggleClass( 'disabled', ! isPageChanged )
				.prop( 'disabled', ! isPageChanged );
		},

		/**
		 * This handler is called every time the column/column_inner in change
		 *
		 * @private
		 * @param {String} rootContainerId  The root container id
		 */
		_vcColumnChange: function( rootContainerId ) {
			// TODO: Here add an algorithm for calculating the width of the columns and
			// saving the sizes in the shortcode settings and transferring to the
			// render handler.

			// The handler is called every time the column/column_inner in change
			this.postMessage( 'vcColumnChange', /* row/row_inner ID */rootContainerId );
		},

		/**
		 * Deferred execution function after a specified time.
		 *
		 * @private
		 * @type debounced
		 */
		__debounce_2s: $usbcore.debounce( $usbcore.fn, 2000/* 2sec */ ),

		/**
		 * Handler for сhange in custom css.
		 *
		 * @private
		 * @event handler
		 * @param {$usof.field} usofField
		 * @param {String} pageCustomCss This is the actual value for any change.
		 */
		_changePageCustomCss: function( usofField, pageCustomCss ) {
			var self = this;
			// If Undo or Redo is used then we will cancel the execution of the logic,
			// since the built-in history will be used.
			if ( self.hotkeys( 'undo', /* or */ 'redo' ) ) {
				return;
			}

			/**
			 * @var {{}} Reference to a temporary object.
			 */
			var temp = self._$temp,
				/**
				 * Set custom styles to the builder and preview.
				 *
				 * @param {String} customCss Page Custom CSS.
				 * @param {{}} originalTask This is a link to an object in history that can be modified.
				 * @var {Function}
				 */
				setPageCustomCss = function( customCss, originalTask ) {
					if (
						$.type( customCss ) !== 'string'
						|| self.pageData.customCss == customCss
					) {
						return;
					}

					// Style updates to editors and history when restoring data from history.
					if ( self.isActiveRecoveryTask() && $.isPlainObject( originalTask ) ) {
						self._fieldsets.pageCustomCss.setValue( customCss );
						originalTask.data = '' + self.pageData.customCss;
					}

					// Update page custom css.
					self.pageData.customCss = customCss;
					// Update styles on the preview page.
					self.postMessage( 'updatePageCustomCss', customCss );
					// Send a signal to update element field.
					self.__contentChange.call( self );
					// Check if there is a css set the label
					self.$panelActionPageCustomCss
						.toggleClass( 'css_not_empty', !! customCss );
				};

			// Saving the state before the update.
			if ( ! temp.isInputCustomCss ) {
				self.commitDataToHistory( self.pageData.customCss, setPageCustomCss );
				temp.isInputCustomCss = true;
			} else {
				// Reset custom styles input flag after input is complete.
				self.__debounce_2s( function() {
					temp.isInputCustomCss = false;
				} );
			}

			// Set custom styles to the builder and preview.
			setPageCustomCss( pageCustomCss );
		},

		/**
		 * Handler for сhange in custom css
		 *
		 * @private
		 * @event handler
		 * @param {$usof.field} field
		 * @param {Mixed} value
		 */
		_changePageSettings: function( field, value ) {
			if ( ! ( field instanceof $usof.field ) ) {
				return;
			}
			var self = this,
				name = field.name;
			// Update page field
			self.pageData.fields[ name ] = value;
			if ( name === 'post_title' ) {
				// Update the title of the builder page
				_document.title = self.config( 'adminPageTitleMask', value ).replace( '%s', value );
				// Update all title on the preview page
				self.postMessage( 'updateElmContent', [ /* Selectors */'.post_title,head > title', value, /* Method */'text' ] );
			}
			// Send a signal to update element field
			self.__contentChange.call( self );
		},

		/**
		 * Handler for сhange in page meta data
		 * Note: The second parameter in the method is passed a value, but this may differ
		 * from ` arguments[1] !== usofField.getValue()` by data type. Example: `1,2` !== [1,2].
		 *
		 * @private
		 * @event handler
		 * @param {$usof.field} usofField
		 */
		_changePageMeta: function( usofField ) {
			if ( ! ( usofField instanceof $usof.field ) ) {
				return;
			}

			var self = this,
				name = usofField.name, // Get field name
				value = usofField.getValue();

			// Check the parameter changes.
			if ( self.pageData.pageMeta[ name ] === value ) {
				return;
			}

			// Update the value for the name.
			self.pageData.pageMeta[ name ] = value;

			// Reload Preview Page (Data change check happens inside the method)
			if ( !! usofField.$row.data( 'usb-preview' ) ) {
				// Reload the page after saving.
				self._$temp.isReloadPreviewAfterSave = true;
				self.__iframeReload();
			}

			// Send a signal to update element field
			self.__contentChange.call( self );
		}
	});

	/**
	 * Functionality for adding new elements via Drag And Drop
	 */
	$.extend( $usbPrototype, {

		// The number of pixels when dragging after which the movement will be initialized
		_dragStartDistance: 5, // The recommended value of 3, which will be optimal for all browsers, was found out after tests

		/**
		 * Show the section "Add elements"
		 *
		 */
		showPanelAddElms: function() {
			var self = this,
				$actionElmAdd = self.$panelActionElmAdd;
			if ( $actionElmAdd.hasClass( 'active' ) ) {
				return;
			}

			self.clearPanel(); // Hide all sections
			self.postMessage( 'doAction', 'hideHighlight' );

			// Set focus to search field
			// Note: Focus does not work when the developer console is open!
			$usbcore.timeout( function() {
				self.$panelSearchField
					.focus();
			}, 1 );

			// Get add button
			$actionElmAdd // Set active class to add button
				.addClass( 'active' );
			self.$panelElms // Show all list elements
				.removeClass( 'hidden' );
			// Set the panel header title
			self.setPanelTitle( /* Get action title */$actionElmAdd.attr( 'title' ) );
			self.$document
				// Track events for DragAndDrop
				.on( 'mousedown', self._events.maybeStartDrag )
				.on( 'mousemove', self._events.maybeDrag )
				.on( 'mouseup', self._events.endDrag );
			// Reset all data by default for more reliable operation
			self.setTemp( 'drag', {
				startX: 0, // X-axis start position
				startY: 0 // Y-axis start position
			} );
		},

		/**
		 * Alias for `self._events`
		 *
		 * @event handler
		 */
		_showPanelAddElms: function() {
			var self = this;
			self.showPanelAddElms.call( self );
		},

		/**
		 * Hide the section "Add elements"
		 *
		 * @private
		 */
		_hidePanelAddElms: function() {
			var self = this;
			self.$panelActionElmAdd // Remove active class from button
				.removeClass( 'active' );
			self.$panelElms // Hide all elements
				.addClass( 'hidden' );
			self.$document
				// Remove events
				.off( 'mousedown', self._events.maybeStartDrag )
				.off( 'mousemove', self._events.maybeDrag )
				.off( 'mouseup', self._events.endDrag );
			// Flush all data for drag
			self.flushTemp( 'drag' );
		},

		/**
		 * Get a new unique id for an element
		 *
		 * @return {String} The unique id e.g. "us_btn:1"
		 */
		getNewElmId: function() {
			return ( this.getTemp( 'drag' ) || {} )[ 'newElmId' ] || '';
		},

		/**
		 * Get the event data for send iframe
		 *
		 * @private
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 * @return {{}} The event data
		 */
		_getEventData: function( e ) {
			var self = this;
			if ( ! self.iframe.isLoad ) {
				return;
			}
			// Get data on the coordinates of the mouse for iframe and relative to this iframe
			var rect = $usbcore.$rect( self.iframe ),
				iframeWindow = self.iframe.contentWindow,
				data = {
					clientX: e.clientX,
					clientY: e.clientY,
					eventX: e.pageX - rect.x,
					eventY: e.pageY - rect.y,
					pageX: ( e.pageX + iframeWindow.scrollX ) - rect.x,
					pageY: ( e.pageY + iframeWindow.scrollY ) - rect.y,
				};
			// Additional check of values for errors
			for ( var prop in data ) {
				var value = data[ prop ] || NaN;
				if ( isNaN( value ) || value < 0 ) {
					data[ prop ] = 0;
				} else {
					data[ prop ] = Math.ceil( data[ prop ] );
				}
			}
			return data;
		},

		/**
		 * Determines if parent dragging
		 *
		 * @return {Boolean} True if dragging, False otherwise
		 */
		isParentDragging: function() {
			return !! this._$temp.isParentDragging;
		},

		/**
		 * Show the transit
		 *
		 * @param {String} type The type element
		 * @param {Number} pageX The event.pageX
		 * @param {Number} pageY The event.pageY
		 */
		showTransit: function( type, pageX, pageY ) {
			var self = this;
			if (
				! type
				|| $usbcore.isUndefined( pageX )
				|| $usbcore.isUndefined( pageY )
			) {
				return;
			}

			// The destroying an object if it is set
			if ( self.hasTransit() ) {
				self.hideTransit();
			}

			// If type is an `id` then we get from `id` type
			if ( self.isValidId( type ) ) {
				type = self.getElmType( type );
			}

			var // Get a node by attribute type
				target = _document.querySelector( '[data-type="'+ type +'"]' );
			if ( ! $usbcore.isNode( target ) ) {
				return;
			}

			var // Create a transit element to snap into the mouse while moving
				rect = $usbcore.$rect( target ),
				isModeAdd = !! self.isMode( 'drag:add' ),
				// Get start offset
				offset = {
					x: Math.abs( pageX - ( isModeAdd ? rect.left : /*not offset*/0 ) ), // X axis
					y: Math.abs( pageY - ( isModeAdd ? rect.top : /*not offset*/0 ) )	// Y axis
				};

			// Checking the value on NAN
			for ( var prop in offset ) {
				if ( isNaN( offset[ prop ] || NaN ) ) {
					offset[ prop ] = 0;
				}
			}

			// The create an object for transit
			var transit = {
				target: target.cloneNode( true ),
				offset: offset,
			};

			$usbcore // Remove class `hidden` if element is hidden
				.$removeClass( transit.target, 'hidden' );

			// Set the height and width of the transit element
			[ 'width', 'height' ].map( function( prop ) {
				var value = Math.ceil( rect[ prop ] );
				transit.target.style[ prop ] = value
					? value + 'px'
					: 'auto';
			} );

			$usbcore // Add a css class to apply basic styles
				.$addClass( transit.target, 'elm_transit' )
				.$addClass( transit.target, ! isModeAdd ? 'mode_drag_move' : '' );

			// Add transit element to document
			_document.body.append( transit.target );

			// Save transit to _$temp
			self._$temp.transit = transit;
		},

		/**
		 * Determines if transit
		 *
		 * @return {Boolean} True if transit, False otherwise.
		 */
		hasTransit: function() {
			return !! this._$temp.transit;
		},

		/**
		 * Set the transit position
		 *
		 * @param {Number} pageX The event.pageX
		 * @param {Number} pageY The event.pageY
		 */
		setTransitPosition: function( pageX, pageY ) {
			var self = this;
			if (
				! self.hasTransit()
				|| ! self.isMode( 'drag:add', 'drag:move' )
			) {
				return;
			}
			var transit = self._$temp.transit || {};
			if ( $usbcore.isNode( transit.target ) ) {
				transit.target.style.left = ( pageX - transit.offset.x ).toFixed( 3 ) + 'px';
				transit.target.style.top = ( pageY - transit.offset.y ).toFixed( 3 ) + 'px';
			}
		},

		/**
		 * Hide the transit
		 */
		hideTransit: function() {
			var self = this,
				transit = self._$temp.transit || {};
			if (
				! self.hasTransit()
				|| ! $usbcore.isNode( transit.target )
			) {
				return;
			}
			$usbcore.$remove( transit.target );
			delete self._$temp.transit;
		},

		/**
		 * Determines the start of moving elements
		 * This should be a single method to determine if something needs to be moved or not
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_maybeStartDrag: function( e ) {
			var self = this;
			// If there is no target, then terminate the method
			if ( ! self.iframe.isLoad || ! e.target ) {
				return;
			}
			var i = 0,
				found,
				target = e.target,
				maxIteration = 1000; // 1 second
			// The check if the goal is a new element
			while ( ! ( found = !! $usbcore.$attr( target, 'data-type' ) ) && i++ < maxIteration ) {
				if ( ! target.parentNode ) {
					found = false;
					break;
				}
				target = target.parentNode;
			}
			// If it was possible to determine the element, then we will save all the data into a temporary variable
			if ( found ) {
				// Set temp data
				self.setTemp( 'drag', {
					startDrag: true,
					startX: e.pageX || 0,
					startY: e.pageY || 0,
					target: target,
				} );
			}
		},

		/**
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_maybeDrag: function( e ) {
			var self = this,
				temp = self.getTemp( 'drag' );
			if ( ! temp.startDrag || ! temp.target ) {
				return;
			}

			// Get offsets from origin along axis X and Y
			var diffX = Math.abs( temp.startX - e.pageX ),
				diffY = Math.abs( temp.startY - e.pageY );

			// The check the distance of the mouse drag and if it is more than
			// the specified one, then activate all the necessary methods
			if ( diffX > self._dragStartDistance || diffY > self._dragStartDistance ) {
				if ( self.isMode( 'editor' ) ) {
					// Set state parent dragging
					self._$temp.isParentDragging = true;
					// Selecting mode of adding elements
					self.setMode( 'drag:add' );
					// Get target type
					var tempTargetType = $usbcore.$attr( temp.target, 'data-type' );
					// Get new element ID ( Saving to `temp` is required for self.getNewElmId() )
					temp.newElmId = self.getSpareElmId( tempTargetType );
					// Show the transit
					self.showTransit( tempTargetType, e.pageX, e.pageY );
					// Add helpers classes for visual control
					$usbcore
						.$addClass( temp.target, 'elm_add_shadow' )
						.$addClass( _document.body, 'elm_add_draging' );
				}
				// Firefox blocks events between current page and iframe so will use onParentEventData
				// Other browsers in iframe intercepts events
				if ( $usbcore.isFirefox && self.isParentDragging() ) {
					var eventData =  self._getEventData( e );
					if ( eventData.pageX ) {
						self.postMessage( 'onParentEventData', [ '_maybeDrop', eventData ] );
					}
				}

				// Set the transit element position
				self.setTransitPosition( e.pageX, e.pageY );
			}
		},

		/**
		 * End a drag
		 *
		 * @private
		 * @event handler
		 */
		_endDrag: function() {
			var self = this;
			if ( ! self.iframe.isLoad ) {
				return;
			}

			// Get temp data
			var temp = self.getTemp( 'drag' );

			// Remove classes
			if ( $usbcore.isNode( temp.target ) ) {
				$usbcore
					.$removeClass( temp.target, 'elm_add_shadow' )
					.$removeClass( _document.body, 'elm_add_draging' );
			}

			// Check is parent dragging
			if ( ! self.isParentDragging() ) {
				self.flushTemp( 'drag' );
				return;
			}

			// Create the new element
			if ( !! temp.parentId && !! temp.currentId ) {
				self.createElm( self.getElmType( temp.currentId ), temp.parentId, temp.currentIndex || 0 );
			}

			// Firefox blocks events between current page and frame so will use onParentEventData
			// Other browsers in iframe intercepts events
			if ( $usbcore.isFirefox ) {
				self.postMessage( 'onParentEventData', '_endDrag' );
			}

			// Reset all data
			self.hideTransit();
			self._$temp.isParentDragging = false;
			self.flushTemp( 'drag' );
			self.setMode( 'editor' );
			// Clearing all asset and temporary data to move
			self.postMessage( 'doAction', 'clearDragAssets' );
		},

		/**
		 * Standard `dragstart` browser event handler.
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 * @return {Boolean} If the event occurs in context `MediaFrame`, then we will enable it, otherwise we will disable it.
		 */
		_dragstart: function( e ) {
			return !! $( e.target ).closest( '.media-frame' ).length;
		}
	} );

	/**
	 * Functionality for the implementation of the Panel
	 */
	$.extend( $usbPrototype, {

		/**
		 * Hide all sections
		 */
		clearPanel: function() {
			var self = this;
			self._destroyElmFieldset(); // Destroy a set of fields for an element
			self._hidePanelAddElms(); // Hide the section "Add elements".
			self._hidePanelImportContent(); // Hide the import content (Paste Row/Section).
			self._hidePanelMessages(); // Hide the section "Messages".
			self._hidePanelPageCustomCss(); // Hide the panel page custom css.
			self._hidePanelPageSettings(); // Hide the panel page settings.
		},

		/**
		 * Determines if hide panel
		 *
		 * @return {Boolean} True if hide panel, False otherwise
		 */
		isHidePanel: function() {
			return this.$panel.hasClass( 'hide' )
		},

		/**
		 * Set the panel header title
		 *
		 * @param {String} title The title
		 */
		setPanelTitle: function ( title ) {
			this.$panelTitle.html( '' + title );
		},

		/**
		 * Get the current preview iframe offset
		 *
		 * @return {{}} Returns the offset along the X and Y axes
		 */
		getCurrentPreviewOffset: function() {
			var rect = $usbcore.$rect( this.iframe );
			return {
				y: rect.y || 0,
				x: rect.x || 0
			};
		},

		/**
		 * Send setResponsiveState event to main document
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @type debounced
		 */
		__setResponsiveState: $usbcore.debounce( function() {
			var self = this;
			self.triggerDocument.call( self, 'setResponsiveState', self.getCurrentResponsiveState() );
		}, 100 ),


		/**
		 * Load all deferred field sets or specified by name
		 *
		 * @private
		 * @param {String} name The fieldset name
		 */
		_loadDeferredFieldsets: function( name ) {
			var self = this;

			self.$panel
				.addClass( 'data_loading' );

			var // Data to send the request
				data = {},
				// AJAX request ID
				requestId = 'loadDeferredFieldsets';

			// Add a name to the data object for the request and change the name
			// for the request ID to ensure that data is received asynchronously
			if ( ! $usbcore.isUndefined( name ) ) {
				data.name = name;
				requestId += '.name';
				self.$panel
					.addClass( 'waiting_mode' );
			}

			// Load the element and initialize it
			self.ajax( /* request id */requestId, {
				data: $.extend( data, {
					_nonce: self.config( '_nonce' ),
					action: self.config( 'action_get_deferred_fieldsets' ),
				} ),
				success: function( res ) {
					if ( ! res.success ) {
						return;
					}
					var fieldsets = $.isPlainObject( res.data )
						? res.data
						: {};
					for ( var name in fieldsets ) {
						if ( !! self._elmsFieldset[ name ] ) {
							continue;
						}
						// Add an fieldset to the general list
						self._elmsFieldset[ name ] = $( fieldsets[ name ] );
						self.$panelFieldsets
							.append( self._elmsFieldset[ name ] );
						// Send a signal about the loading of fieldsets
						self.trigger( 'fieldsetLoaded', [ name ] );
					}
					/*
					 * `data_loading` - Background data loading
					 * `waiting_mode` - Fieldset load pending
					 */
					var removeClasses = 'data_loading';
					if ( ! data.name ) {
						self._$temp.isFieldsetsLoaded = true; // Loading all fieldsets
						removeClasses += ' waiting_mode';
					} else {
						removeClasses = ' waiting_mode';
					}
					self.$panel
						.removeClass( removeClasses );
				}
			} );
		},

		/**
		 * Initializes the elm fieldset
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @param {Function} callback Callback function that will be called after loading the fieldset
		 */
		initElmFieldset: function( id, callback ) {
			var self = this;
			if ( ! self.doesElmExist( id ) ) {
				return;
			}

			// Get element name
			var name = self.getElmName( id ),
				title = self.config( 'elm_titles.' + name );

			// If there is no title, then the element does not support editing in the USBuilder
			if ( ! title ) {
				// Set shortcode title to header title
				self.setPanelTitle( name );
				// Display message on panel
				self.showPanelMessage( self.getTextTranslation( 'editing_not_supported' ) );
				return;
			}

			// Trying to get a fieldset from a document
			if ( ! self._elmsFieldset[ name ] ) {
				var $fieldset = $( '.us-builder-panel-fieldset[data-name="'+ name +'"]', self.$panelFieldsets );
				if ( $fieldset.length ) {
					self._elmsFieldset[ name ] = $fieldset;
				}
			}

			// If the fieldsets have not been loaded yet, wait for the loading and then show the fieldset
			if ( ! self._elmsFieldset[ name ] && ! self._$temp.isFieldsetsLoaded ) {
				self.setPanelTitle( title );
				self // Watches the loading of fieldsets
					.off( 'fieldsetLoaded' )
					.on( 'fieldsetLoaded', function( loadedName ) {
						if ( name !== loadedName ) return;
						self._showElmFieldset( id );
					} );
				// Loading a set outside the general stream
				self._loadDeferredFieldsets( name );
				return;
			}

			// Show panel edit settings for shortcode
			self._showElmFieldset( id );
		},

		/**
		 * Show panel edit settings for shortcode
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 */
		_showElmFieldset: function( id ) {
			var self = this;
			if ( ! self.doesElmExist( id ) ) {
				return;
			}

			// Get element name and values for it
			var name = self.getElmName( id ),
				values = self.getElmValues( id ) || {};

			if ( ! name ) {
				return;
			}

			// Remove the `waiting_mode` class if any
			if ( self.$panel.hasClass( 'waiting_mode' ) ) {
				self.$panel
					.removeClass( 'waiting_mode' );
			}

			self.clearPanel(); // Hide all sections

			// Loading assets required to initialize the code editor
			if ( self.config( 'dynamicFieldsetAssets.codeEditor', [] ).indexOf( name ) > -1 ) {
				self._loadAssetsForCodeEditor();
			}
			// Set value to variables
			self.selectedElmId = id;
			self.$activeElmFieldset = self._elmsFieldset[ name ].clone();
			self.activeElmFieldset = new $usof.GroupParams( self.$activeElmFieldset );

			// Set shortcode title to header title
			self.setPanelTitle( self.getElmTitle( id ) );

			// Set value to fieldsets
			self.$activeElmFieldset.addClass( 'inited usof-container' );
			self.activeElmFieldset.setValues( values, /* quiet mode */true );

			self.$panelBody
				.prepend( self.$activeElmFieldset );

			// Forwarding events through document on item selection
			if ( ! self.isHideResponsiveToolbar() ) {
				self.__setResponsiveState();
			}

			// Initialization check and watch on field events
			for ( var fieldId in self.activeElmFieldset.fields ) {
				var field = self.activeElmFieldset.fields[ fieldId ];
				field
					.on( 'change', self._events.changeField )
					.on( 'afterHide', self._events.afterHideField )
					// The event only exists in the `design_options`
					.on( 'changeDesignField', self._events.changeDesignField )
					// Watches the choice of responsive state in the fields
					.on( 'changeResponsiveState', self._events.changeFieldResponsiveState )
					// Delegating an event from the TinyMCE to a built-in handler (keydown comes from the TinyMCE iframe)
					.on( 'tinyMCE.Keydown', function( /* usofField */_, /* Event */e ) {
						self._events.keydown( e );
					} );
			}

			// Initialization check and watch on group events
			for ( var groupName in ( self.activeElmFieldset.groups || {} ) ) {
				self.activeElmFieldset.groups[ groupName ]
					.on( 'change', self._events.changeField );
			}

			// Adds tabs data
			if ( self.activeElmFieldset.isGroupParams ) {
				self.activeElmFieldset.$tabsItems = $( '.usof-tabs-item', self.$activeElmFieldset );
				self.activeElmFieldset.$tabsSections = $( '.usof-tabs-section', self.$activeElmFieldset );
				// Run the method to check for visible fields and control the showing of tabs
				self.$$fieldsets.autoShowingTabs.call( self );
			}

			// Show highlight for editable element
			self.postMessage( 'doAction', [ 'showEditableHighlight', id ] );
		},

		/**
		 * Destroy a set of fields for an element
		 *
		 * @private
		 */
		_destroyElmFieldset: function() {
			var self = this;
			if ( ! self.activeElmFieldset ) {
				return;
			}
			// Remove a node
			if ( self.$activeElmFieldset instanceof $ ) {
				self.$activeElmFieldset.remove();
			}
			// Hide highlight for editable element
			self.postMessage( 'doAction', 'hideEditableHighlight' );
			// Destroy all data
			self.selectedElmId = null;
			self.activeElmFieldset = null;
			self.$activeElmFieldset = null;
		},

		/**
		 * Normalization of instructions
		 * Note: `instructions = true` - force an ajax request to get the element code
		 *
		 * @private
		 * @param {Mixed} instructions Instructions for previewing elements
		 * @return {Mixed}
		 */
		_normalizeInstructions: function( instructions ) {
			// The converting to an array of instructions
			if ( !! instructions && ! $.isArray( instructions ) && instructions !== true ) {
				instructions = $.isPlainObject( instructions )
					? [ instructions ]
					: [];
			}
			return instructions;
		},

		/**
		 * Field changes for a design_options
		 * TODO: Update after USOF2 implementation!
		 *
		 * @private
		 * @param {{}} _
		 * @param {$usof.field|$usof.Group} field
		 * @param {$usof.field} designField
		 */
		_changeDesignField: function( field, designField ) {
			if ( field.type !== 'design_options' ) {
				return;
			}
			this._changeField( designField, designField.getValue(), /* Skip save option */true );
		},

		/**
		 * Handler for selecting the responsive state in the $usof.Field
		 * TODO: Update after USOF2 implementation!
		 *
		 * @private
		 * @param {{}} _
		 * @param {$usof.field|$usof.Group} field
		 * @param {String} responsiveState
		 */
		_changeFieldResponsiveState: function( field, responsiveState ) {
			var self = this;
			// Show/Hide responsive toolbar
			self.toggleResponsiveToolbar( !! responsiveState );
			// Set the preview responsive state
			self.setResponsiveState( responsiveState );
		},

		/**
		 * Send a signal to update element field
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @param {[]} args Array of arguments for the trigger
		 * @type debounced
		 */
		__contentChange: $usbcore.debounce( function( args ) {
			this.trigger( 'contentChange', args );
		}, 1 ),

		/**
		 * Controls the number of columns in a row
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @param {Mixed} layout The layout
		 * @type debounced
		 */
		__updateColumnsLayout: $usbcore.debounce( function( id, layout ) {
			this._updateColumnsLayout( id, layout );
		}, 1 ),

		/**
		 * Updating the shortcode with a frequency of 1ms
		 * Note: The code is moved to a separate function since `throttled` must be initialized before calling.
		 *
		 * @private
		 * @param {Function} fn The function to be executed
		 * @type throttled
		 */
		__updateShortcode: $usbcore.throttle( $usbcore.fn, 1, /* no_trailing */true ),

		/**
		 * Updating content after 150ms
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @param {Function} fn The function to be executed
		 * @type debounced
		 */
		__updateShortcode_long: $usbcore.debounce( $usbcore.fn, 150 ),

		/**
		 * Updates of instructions from a delay of 1s
		 * Note: The code is moved to a separate function since `throttled` must be initialized before calling.
		 *
		 * @private
		 * @param {Function} fn The function to be executed
		 * @type throttled
		 */
		__updateOnInstructions_long: $usbcore.throttle( $usbcore.fn, 1000/* 1 second */ ),

		/**
		 * Field changes for a fieldsets
		 * TODO: Update after USOF2 implementation!
		 *
		 * @private For fieldsets
		 * @event handler
		 * @param {$usof.field|$usof.Group} usofField
		 * @param {Mixed} _ The usofField value
		 * @param {Boolean} _skipSave Skip save option
		 */
		_changeField: function( usofField, _, _skipSave ) {
			var self = this;

			// Run the method to check for visible fields and control the showing of tabs
			self.$$fieldsets.autoShowingTabs.call( self );

			// If there is no editable element, then exit the method
			if ( ! self.selectedElmId ) {
				return;
			}

			var isGroup = usofField instanceof $usof.Group,
				isField = usofField instanceof $usof.field;

			// If the object is not a field or a group then exit the method
			if ( ! ( isField || isGroup ) ) {
				return;
			}

			var id = self.selectedElmId,
				name = usofField.name || usofField.groupName,
				elmType = self.getElmType( id ),
				fieldType = isField
					? usofField.type
					: 'group',
				value = usofField.getValue(),
				isChangeDesignOptions = ( fieldType === 'design_options' ),
				instructions = isField
					// Get preview settings for field
					? usofField.$row.data( 'usb-preview' )
					// Get preview settings for group
					: usofField.$field.data( 'usb-preview' );

			// The normalization of instructions
			instructions = self._normalizeInstructions( instructions );

			// Execute callback functions if any
			if ( $.isArray( instructions ) ) {
				// Get a list of callback functions for parameters
				var previewCallbacks = $.isPlainObject( _window.$usbdata.previewCallbacks )
					? _window.$usbdata.previewCallbacks
					: {};
				for ( var i in instructions ) {
					var funcName = ( elmType + '_' + name ).toLowerCase();
					if (
						! instructions[ i ][ 'callback' ]
						|| ! $.isFunction( previewCallbacks[ funcName ] )
					) {
						continue;
					}
					try {
						instructions = previewCallbacks[ funcName ]( value ) || /* Default */true;
					} catch( e ) {
						self._debugLog( 'Error executing callback function in instructions', e );
					}
				}
				// The normalization of instructions
				instructions = self._normalizeInstructions( instructions );
			}

			/**
			 * Determine the progress of the recovery task
			 *
			 * @type {Boolean}
			 */
			var isActiveRecoveryTask = self.isActiveRecoveryTask();

			/**
			 * Update shortcode
			 *
			 * @private
			 * @return {{}} Returns the old and updated shortcode
			 */
			var _updateShortcode = function() {
				var originalId = id,
					oldShortcode = self.getElmShortcode( id );
				if ( ! oldShortcode || _skipSave ) {
					return {};
				}

				var shortcodeObj = self.parseShortcode( oldShortcode ),
					/**
					 * Shortcode which stores the type as content
					 * Note: `content` is a reserved name which implies that the values are the content of the
					 * shortcode for example: [example]content[/example]
					 */
					isShortcodeContent = ( [ 'editor' ].indexOf( fieldType ) !== -1 || name === 'content' );

				// Attribute updates
				var atts = self.parseAtts( shortcodeObj.atts );
				if (
					isShortcodeContent
					|| (
						usofField.getDefaultValue() === value
						// Excluding a group so the value contains all settings
						&& fieldType !== 'group'
					)
				) {
					delete atts[ name ];
				} else {
					atts[ name ] = value;
				}
				shortcodeObj.atts = self.buildAtts( atts );

				// Set value as shortcode content
				if ( isShortcodeContent ) {
					shortcodeObj.content = value;
				}

				// Converts a shortcode object to a string
				var newShortcode = self.buildShortcode( shortcodeObj ),
					hasChanged = ( oldShortcode !== newShortcode && ! isActiveRecoveryTask ),
					oldParentShortcode; // The parent shortcode for the events of the year, children change, but the parent needs to be updated.

				// Get parent shortcode data
				if ( instructions === true && self.isUpdateIncludeParent( id ) ) {
					id = self.getElmParentId( id );
					oldParentShortcode = self.getElmShortcode( id );
				}

				// Saving shortcode to page content
				if ( hasChanged ) {
					self.pageData.content = ( '' + self.pageData.content )
						.replace( oldShortcode, newShortcode );
					// Send a signal to update element field
					self.__contentChange.call( self );
				}

				// Get parent and update it
				if ( oldParentShortcode ) {
					oldShortcode = oldParentShortcode;
					newShortcode = self.getElmShortcode( id );
				}

				// Changing columns layout according to the row setting
				if ( hasChanged && elmType.indexOf( 'vc_row' ) === 0 && name === 'columns' ) {
					self.__updateColumnsLayout( id, value );
				}

				// If the content of the shortcode has changed, commit to the change history
				if ( hasChanged ) {
					/**
					 * Save last changes to cache (It is important to get the data before calling `_updateShortcode`)
					 * Note: The cache provides correct data when multiple threads `debounce` or `throttle` are running.
					 * TODO: Find solution to race problem (get/update, update/get) from using timeout
					 */
					self._$temp._latestShortcodeUpdates = {
						content: oldShortcode,
						preview: self.getElmOuterHtml( id )
					};

					var commitArgs = [ id, self._CHANGED_ACTION.UPDATE ];

					// Determining the field type whether the spacing is needed or not.
					commitArgs.push( self.config( 'useThrottleForFields', [] ).indexOf( usofField.type ) > -1 );

					// Add external end-to-end data
					if ( oldParentShortcode ) {
						commitArgs.push( { originalId: originalId } );
					}

					// Commit to save changes to history
					self.commitChangeToHistory.apply( self, commitArgs );
				}

				// Force changes to apply css
				// TODO:Fix after implementing USOF2
				if ( ! hasChanged && ! isActiveRecoveryTask && isChangeDesignOptions ) {
					hasChanged = true;
				}

				return {
					changed: hasChanged,
					new: newShortcode,
					old: oldShortcode
				};
			};

			// Updating the shortcode with a specified delay and receiving data from the server
			if ( _skipSave !== true && instructions === true && ! isActiveRecoveryTask ) {
				self.__updateShortcode_long( function() {
					var _shortcode = _updateShortcode();
					if ( ! _shortcode.changed ) {
						return;
					}

					// Show the loading
					self.postMessage( 'showPreloader', id );
					// Get a rendered shortcode
					self._renderShortcode( /* request id */'_renderShortcode', {
						data: {
							content: _shortcode.new
						},
						success: function( res ) {
							// At this point, there is no need to post message `hidePreloader`
							// since the element is loader and will be replaced with a new code
							if ( ! res.success ) {
								return;
							}
							var html = ( ''+res.data.html )
								// Enable animation appearance
								.replace( /(class=".*?animate_this)/i, "$1 start" );
							self.postMessage( 'updateSelectedElm', [ id, html ] );
						}
					} );
				} );
			}

			// Updating the shortcode at a specified frequency
			else if ( instructions !== true ) {
				/**
				 * Update on instructions and data
				 *
				 * @private
				 */
				var _updateOnInstructions = function() {
					var _shortcode = _updateShortcode();
					// If the shortcode data has not changed or there are no instructions,
					// then we will complete the execution at this stage
					if ( ! _shortcode.changed || $usbcore.isUndefined( instructions ) ) {
						return;
					}
					// Spot updating styles, classes or other parameters
					self.postMessage( 'onPreviewParamChange', [ id, instructions, value, fieldType ] );
				};

				/**
				 * Selecting a wrapper to apply an interval or delay
				 *
				 * @private
				 */
				var _switchUpdateOnInstructions = function() {
					if ( _skipSave === true ) {
						return;
					}
					// The update occurs at a long interval
					if ( self.config( 'useLongUpdateForFields', [] ).indexOf( usofField.type ) > -1 ) {
						self.__updateOnInstructions_long( _updateOnInstructions );
					} else {
						// Instant data update
						_updateOnInstructions();
					}
				};

				// Checking if we are doing preview changes for design options
				if ( isChangeDesignOptions ) {
					var _value = unescape( '' + value );
					// Get the ID of an attachment to check for loaded
					var attachmentId = $usbcore.parseInt( ( _value.match( /"background-image":"(\d+)"/ ) || [] )[1] );
					if ( attachmentId && ! self.getAttachmentUrl( attachmentId ) ) {
						// In case the design options have background image and it's info wasn't loaded yet ...
						// ... fire preview change event only after trying to load the image info
						( self.getAttachment( attachmentId ) || { fetch: $.noop } ).fetch( {
							success: _switchUpdateOnInstructions
						} );
					} else {
						_switchUpdateOnInstructions();
					}

					// For fields with type other than design options, just fire preview change event
				} else {
					_switchUpdateOnInstructions();
				}
			}
		},

		/**
		 * Field handler after hidden for a fieldsets
		 * TODO: Update after USOF2 implementation!
		 *
		 * @private For fieldsets
		 * @event handler
		 * @param $usof.field usofField The field object
		 */
		_afterHideField: function( usofField ) {
			if ( usofField instanceof $usof.field && usofField.inited ) {
				// Set default value for hidden field
				usofField.setValue( usofField.getDefaultValue(), /* not quiet */false );
			}
		},

		/**
		 * Switch Show/Hide panel
		 *
		 * @private
		 * @event handler
		 */
		_switchPanel: function() {
			var self = this,
				isHide = ! self.isHidePanel();
			self.$panel
				.toggleClass( 'hide', isHide );
			if ( isHide ) {
				self.clearPanel(); // Hide all sections
				self.postMessage( 'doAction', 'hideHighlight' );
			} else {
				self.showPanelAddElms(); // Show the section "Add elements"
			}
			self.setMode( isHide ? 'preview' : 'editor' );
			// Send a message about changing the panel display
			self.postMessage( 'changeSwitchPanel' );
		},

		/**
		 * Search box character input handler
		 *
		 * @private
		 * @event handler
		 */
		_searchPanelElms: function() {
			var self = this,
				$input = self.$panelSearchField,
				isFoundResult = true,
				value = ( $input[0].value || '' ).trim().toLowerCase();
			$input // Reset button displaying control
				.next( '.usb_action_reset_search' )
				.toggleClass( 'hidden', ! value );
			// By default, hide all elements that are included in the search
			self.$panelSearchElms
				.toggleClass( 'hidden', !! value );
			if ( value ) {
				// Show all elements that contain a search string in their title
				isFoundResult = !! self.$panelSearchElms
					.filter( '[data-search-text^="' + value + '"], [data-search-text*="' + value + '"]' )
					.removeClass( 'hidden' )
					.length;
			}
			// Control the output of lists and headers
			$( '.us-builder-panel-elms-list', self.$panelElms )
				.each( function( _, list ) {
					var isEmptyList = ! $( '[data-search-text]:not(.hidden)', list ).length;
					$( list )
						.toggleClass( 'hidden', isEmptyList )
						.prev( '.us-builder-panel-elms-header' )
						.toggleClass( 'hidden', isEmptyList );
				} );
			// The output of an empty result message
			self.$panelSearchNoResult
				.toggleClass( 'hidden', isFoundResult );
		},

		/**
		 * Reset search in Panel
		 *
		 * @private
		 * @event handler
		 */
		_resetSearchInPanel: function() {
			var self = this,
				$input = self.$panelSearchField;
			if ( ! $input.val() ) {
				return;
			}
			$input.val( '' ).trigger( 'input' );
		},

		/**
		 * Show the panel messages
		 *
		 * @param {String} text
		 */
		showPanelMessage: function( text ) {
			var self = this;
			self.clearPanel(); // Hide all sections
			self.$panelMessages
				.removeClass( 'hidden' )
				.html( text );
		},

		/**
		 * Hide the panel messages
		 *
		 * @private
		 */
		_hidePanelMessages: function() {
			this.$panelMessages
				.addClass( 'hidden' )
				.html( '' );
		},

		/**
		 * Toggle Responsive Mode
		 *
		 * @private
		 * @event handler
		 */
		_toggleResponsiveMode: function() {
			var self = this;
			// Show/Hide responsive toolbar
			self.toggleResponsiveToolbar( self.isHideResponsiveToolbar() );
			// Set the default responsive state
			self.setResponsiveState(/* default */);
			// Forwarding events through document
			self.triggerDocument( 'setResponsiveState'/*, 'default' */ );
		},

		/**
		 * Show import content (Paste Row/Section)
		 *
		 * @private
		 * @event handler
		 */
		_showPanelImportContent: function() {
			var self = this;
			self.clearPanel();
			self.$panelImportContent.removeClass( 'hidden' );
			// Clear field and set focus to it
			self.$panelImportTextarea
				.val( '' )
				.focus()
				.removeClass( 'validate_error' );
			// Disable save button
			self.$panelActionSavePastedContent
				.prop( 'disabled', true )
				.addClass( 'disabled' );
			// Update panel title
			self.setPanelTitle( self.getTextTranslation( 'paste_row' ) );
		},

		/**
		 * Hide import content (Paste Row/Section)
		 *
		 * @private
		 */
		_hidePanelImportContent: function() {
			this.$panelImportContent.addClass( 'hidden' );
		},

		/**
		 * Pasted content change handler.
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_changePastedContent: function( e ) {
			var self = this;
			// Close all notifications
			self.closeAllNotification();

			var target = e.target,
				pastedContent = target.value.trim();

			// Remove usbid's from pasted content.
			if ( pastedContent.indexOf( 'usbid=' ) !== -1 ) {
				pastedContent = pastedContent.replace( /(\s?usbid="([^\"]+)?")/g, '' );
			}

			// Save the cleaned content
			if ( target.value !== pastedContent ) {
				target.value = pastedContent;
			}

			// Remove helper classes
			$( target ).removeClass( 'validate_error' );

			// Enable save button
			self.$panelActionSavePastedContent
				.prop( 'disabled', ! pastedContent )
				.toggleClass( 'disabled', ! pastedContent );
		},

		/**
		 * Save pasted content.
		 *
		 * @private
		 * @event handler
		 */
		_savePastedContent: function() {
			var self = this,
				// Elements
				$textarea = self.$panelImportTextarea,
				$saveButton = self.$panelActionSavePastedContent,
				// Get pasted content
				pastedContent = ( $textarea.val() || '' );

			if ( ! pastedContent ) {
				// Disable save button
				$saveButton
					.prop( 'disabled', true )
					.addClass( 'disabled' );
				return;
			}

			// Remove html from start and end pasted сontent
			pastedContent = self.removeHtmlWrap( pastedContent );

			// The check the correctness of the entered shortcode.
			var isValid = ! (
				!/^\[vc_row([\s\S]*)\/vc_row\]$/gim.test( pastedContent )
				|| pastedContent.indexOf( '[vc_column' ) === -1
			);

			// Added helper classes
			$textarea.toggleClass( 'validate_error', ! isValid );

			// If there is an error, we will display a notification and complete the processing.
			if ( ! isValid ) {
				self.notify( self.getTextTranslation( 'invalid_data' ), self._NOTIFY_TYPE.ERROR );
				return;
			}

			// Disable the input field at the time of adding content.
			$textarea
				.prop( 'disabled', true )
				.addClass( 'disabled' );

			// Disable save button
			$saveButton
				.addClass( 'loading disabled' )
				.prop( 'disabled', true );

			// Add a unique usbid for each shortcode.
			var elmId;
			pastedContent = pastedContent.replace( /\[(\w+)/g, function( match, tag, offset ) {
				var id = self.getSpareElmId( tag );
				// Save the ID of the first shortcode, which should be `vc_row`
				if ( 0 === offset ) {
					elmId = id;
				}
				return match + ' usbid="' + id + '"';
			} );

			// Get default image
			var placeholder = self.config( 'placeholder', '' );

			// Search and replace use:placeholder
			pastedContent = pastedContent.replace( /use:placeholder/g, placeholder );

			// Replacing images for new design options
			pastedContent = pastedContent.replace( /css="([^\"]+)"/g, function( matches, match ) {
				if ( match ) {
					var jsoncss = ( decodeURIComponent( match ) || '' )
						.replace( /("background-image":")(.*?)(")/g, function( _, before, id, after ) {
							return before + ( $usbcore.parseInt( id ) || placeholder ) + after;
						} );
					return 'css="%s"'.replace( '%s', encodeURIComponent( jsoncss ) );
				}
				return matches;
			} );

			// Checking the post_type parameter
			pastedContent = pastedContent.replace( /\s?post_type="(.*?)"/g, function( match, post_type ) {
				if ( self.config( 'grid_post_types', [] ).indexOf( post_type ) === - 1 ) {
					return ' post_type="post"'; // Default post_type
				}
				return match;
			} );

			// TODO: Determine the need for this filter.
			// Removing [us_post_content..] if post type is not us_content_template
			// if ( self.data.post_type !== 'us_content_template' ) {
			// 	pastedContent = pastedContent.replace( /(\[us_post_content.*?])/g, '' );
			// }

			// Render pasted content
			self._renderShortcode( /* request id */'_renderPastedContent', {
				data: {
					content: pastedContent,
					isReturnContent: true, // Add content to the result (This can be useful for complex changes)
				},
				// Successful request handler.
				success: function( res ) {
					if ( ! res.success || ! res.data.html ) {
						return;
					}

					// Commit to save changes to history
					self.commitChangeToHistory( elmId, self._CHANGED_ACTION.CREATE );

					// Add pasted content to `self.pageData.content`
					self.pageData.content += (
						res.data.content || pastedContent.replace( /(grid_layout_data="([^"]+)")/g, 'items_layout=""' )
					);

					// Add html to the end of the document.
					self.postMessage( 'insertElm', [ self.mainContainer, 'append', res.data.html, /* scroll into view */true ] );
					// Send a signal to move element
					self.trigger( 'contentChange' );
				},
				// Handler to be called when the request finishes (after success and error callbacks are executed).
				complete: function( _, textStatus ) {
					var isSuccess = textStatus === 'success';

					// Disable the loader and block m or display the button depending on its status.
					$saveButton
						.prop( 'disabled', isSuccess )
						.removeClass( 'loading' )
						.toggleClass( 'disabled', isSuccess );

					// Enable input field
					$textarea
						.prop( 'disabled', false )
						.removeClass( 'disabled' );

					// Clear data on successful request
					if ( isSuccess ) {
						$textarea.val('');
					}
				}
			} );
		},

		/**
		 * Show the panel page custom css.
		 *
		 * @private
		 * @event handler
		 */
		_showPanelPageCustomCss: function() {
			var self = this;

			// Loading the code editor only after initializing the iframe,
			// due to loading assets on demand from the iframe
			if ( ! self.iframe.isLoad ) {
				self
					.off( 'iframeLoaded', self._events.showPanelPageCustomCss )
					.one( 'iframeLoaded', self._events.showPanelPageCustomCss );
				return;
			}

			// Loading assets required to initialize the code editor
			self._loadAssetsForCodeEditor();

			// Fields initialization for page_custom_css
			if ( ! ( self._fieldsets.pageCustomCss instanceof $usof.field ) ) {
				var pageCustomCss = new $usof.field( $( '.type_css', self.$panelPageCustomCss )[0] );
				pageCustomCss.init( pageCustomCss.$row );
				pageCustomCss.setValue( self.pageData.customCss );
				pageCustomCss.on( 'change', $usbcore.debounce( self._events.changePageCustomCss, 1 ) );
				self._fieldsets.pageCustomCss = pageCustomCss;
			}

			self.clearPanel();
			self.$panelPageCustomCss.removeClass( 'hidden' );
			self.$panelActionPageCustomCss.addClass( 'active' );

			// Update panel title
			self.setPanelTitle( self.getTextTranslation( 'page_custom_css' ) );

			// Set the cursor at the end of existing content
			try {
				var cmInstance = self._fieldsets.pageCustomCss.editor.codemirror;
				cmInstance.focus();
				cmInstance.setCursor( cmInstance.lineCount(), 0 );
			} catch( e ) {}
		},

		/**
		 * Loading assets required to initialize the code editor
		 *
		 * @private
		 */
		_loadAssetsForCodeEditor: function() {
			var self = this,
				codeEditorAssets = ( _window.$usbdata.deferredAssets || {} )['codeEditor'] || '';
			if ( codeEditorAssets ) {
				self.$body.append( codeEditorAssets );
				delete _window.$usbdata.deferredAssets['codeEditor'];
			}
		},

		/**
		 * Hide the panel page custom css.
		 *
		 * @private
		 */
		_hidePanelPageCustomCss: function() {
			var self = this;
			self.$panelPageCustomCss.addClass( 'hidden' );
			self.$panelActionPageCustomCss.removeClass( 'active' );
		},

		/**
		 * Show the panel page settings.
		 *
		 * @private
		 * @event handler
		 */
		_showPanelPageSettings: function () {
			var self = this;
			// Fields initialization for page fields
			if ( ! ( self._fieldsets.pageFields instanceof $usof.GroupParams ) ) {
				var pageFields = new $usof.GroupParams( $( '.for_page_fields', self.$panelPageSettings )[0] );
				for ( var k in pageFields.fields ) {
					pageFields.fields[ k ].on( 'change', $usbcore.debounce( self._events.changePageSettings, 1 ) );
				}
				self._fieldsets.pageFields = pageFields;
			}
			// Fields initialization for meta data
			if ( ! ( self._fieldsets.pageMeta instanceof $usof.GroupParams ) ) {
				var pageMeta = new $usof.GroupParams( $( '.us-builder-panel-page-meta', self.$panelPageSettings )[0] );
				for ( var k in pageMeta.fields ) {
					pageMeta.fields[ k ].on( 'change', $usbcore.debounce( self._events.changePageMeta, 1 ) );
				}
				self._fieldsets.pageMeta = pageMeta;
			}

			// Set params for fieldsets in page settings
			self._setParamsForPageSettings();

			self.clearPanel();
			self.$panelPageSettings.removeClass( 'hidden' );
			self.$panelActionPageSettings.addClass( 'active' );
			// Update panel title
			self.setPanelTitle( self.getTextTranslation( 'page_settings' ) );
		},

		/**
		 * Set params for fieldsets in page settings
		 *
		 * @private
		 */
		_setParamsForPageSettings: function() {
			var self = this;
			if ( ! self.iframe.isLoad ) {
				self.one( 'iframeLoaded', self._events.setParamsForPageSettings );
				self.$panelPageSettings // Add a preloader for loading data
					.addClass( 'data_loading' );
				return;
			}
			// Object references for code optimization
			var pageData = self.pageData,
				pageMeta = self._fieldsets.pageMeta,
				pageFields = self._fieldsets.pageFields;
			// Set values for page fields
			if ( pageFields instanceof $usof.GroupParams ) {
				pageFields.setValues( pageData.fields, /* quiet mode */true );
				pageData.fields = pageFields.getValues(); // Note: Force for data type compatibility.
			}
			// Set values for meta data
			if ( pageMeta instanceof $usof.GroupParams ) {
				pageMeta.setValues( pageData.pageMeta, /* quiet mode */true );
				pageData.pageMeta = pageMeta.getValues(); // Note: Force for data type compatibility.
			}
			self.$panelPageSettings
				.removeClass( 'data_loading' );
		},

		/**
		 * Hide the panel page settings.
		 *
		 * @private
		 */
		_hidePanelPageSettings: function() {
			var self = this;
			self.$panelPageSettings.addClass( 'hidden' );
			self.$panelActionPageSettings.removeClass( 'active' );
		},

		/**
		 *
		 * @private
		 * @event handler
		 */
		_saveChanges: function() {
			var self = this;
			if (
				! self.isPageChanged()
				|| self._$temp.isProcessSave
			) {
				return;
			}
			// Set the save execution flag
			self._$temp.isProcessSave = true;
			// Disable button and enable loading
			self.$panelActionSaveChanges
				.prop( 'disabled', true )
				.addClass( 'loading' );
			var // Updated data
				data = {
					// The available key=>value:
					//	post_content: '',
					//	post_status: '' ,
					//	post_title: '',
					//	pageMeta: [ key => value ]
					pageMeta: {},
				};
			// Add updated content
			if ( self.isContentChanged() ) {
				data.post_content = self.pageData.content;
			}
			if ( self.isPageFieldsChanged() ) {
				for ( var prop in self.pageData.fields ) {
					data[ prop ] = self.pageData.fields[ prop ];
 				}
			}
			// Add updated meta data
			if ( self.isPageMetaChanged() ) {
				for ( var prop in self.pageData.pageMeta ) {
					data.pageMeta[ prop ] = self.pageData.pageMeta[ prop ];
				}
			}
			if ( self.isPageCustomCssChanged() ) {
				data.pageMeta[ self.config( 'keyCustomCss', '' ) ] = self.pageData.customCss;
			}
			// Send data to server
			self.ajax( /* request id */'_saveChanges', {
				data: $.extend( data, {
					action: self.config( 'action_save_post' ),
					_nonce: self.config( '_nonce' )
				} ),
				// Handler to be called if the request succeeds
				success: function( res ) {
					if ( ! res.success ) {
						return;
					}
					self.notify( self.getTextTranslation( 'page_updated' ), self._NOTIFY_TYPE.SUCCESS );
					// Reload preview page
					if ( !! self._$temp.isReloadPreviewAfterSave && self.isPageMetaChanged() ) {
						// Reset value after page reload.
						self._$temp.isReloadPreviewAfterSave = false;
						self.iframe.src = self.config( 'previewUrl' );
					}
					// Saving the last page data.
					self._$temp.savedPageData = $usbcore.clone( self.pageData );
				},
				// Handler to be called when the request finishes (after success and error callbacks are executed).
				complete: function() {
					self.$panelActionSaveChanges
						.removeClass( 'loading' )
						.addClass( 'disabled' );
					self._$temp.isProcessSave = false;
				}
			} );
		},

		/**
		 * Handler for create revision and show a preview page
		 * Note: Going to the change preview page creates the revision for which data is needed `post_conent`
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_submitPreviewChanges: function( e ) {
			var self = this;
			// Add data before sending
			$( 'textarea[name="post_content"]', e.target )
				.val( self.pageData.content );
			// Add data for custom page css (Metadata)
			$( 'textarea[name='+ self.config( 'keyCustomCss', '' ) +']', e.target )
				.val( self.pageData.customCss );
		}
	} );

	/**
	 * Functionality for working with data and history of changes
	 */
	$.extend( $usbPrototype, {

		/**
		 * The type of data history used
		 *
		 * @private
		 * @var {{}}
		 */
		_HISTORY_TYPE: {
			REDO: 'redo',
			UNDO: 'undo'
		},

		/**
		 * Actions that are applied when content changes
		 *
		 * @private
		 * @var {{}}
		 */
		_CHANGED_ACTION: {
			CALLBACK: 'callback', // Recovery via callback function.
			CREATE: 'create', // Create new shortcode and add to content.
			MOVE: 'move', // Move shortcode.
			REMOVE: 'remove', // Remove shortcode from content.
			UPDATE: 'update' // Update shortcode in content.
		},

		/**
		 * Undo handler
		 *
		 * @private
		 * @event handler
		 */
		_undoChange: function() {
			var self = this;
			self._createRecoveryTask( self._HISTORY_TYPE.UNDO );
		},

		/**
		 * Redo handler
		 *
		 * @private
		 * @event handler
		 */
		_redoChange: function() {
			var self = this;
			self._createRecoveryTask( self._HISTORY_TYPE.REDO );
		},

		/**
		 * Handler for changes in the data history,
		 * the method will be called every time the data in the history has changed.
		 *
		 * @private
		 * @event handler
		 */
		_historyChanged: function() {
			var self = this;
			[ // Controlling the operation and display of undo/redo buttons
				{ $btn: self.$panelActionUndo, disabled: ! self.getLengthUndo() },
				{ $btn: self.$panelActionRedo, disabled: ! self.getLengthRedo() }
			].map( function( i ) {
				i.$btn
					// Data recovery in process
					.toggleClass( 'recovery_process', !! self.getLengthTasks() )
					// Disable or enable buttons
					.toggleClass( 'disabled', i.disabled )
					.prop( 'disabled', i.disabled )
			} );
		},

		/**
		 *Get the length of `undo`
		 *
		 * @return {Number}
		 */
		getLengthUndo: function() {
			return ( this._$temp.changesHistory.undo || [] ).length;
		},

		/**
		 *Get the length of `redo`
		 *
		 * @return {Number}
		 */
		getLengthRedo: function() {
			return ( this._$temp.changesHistory.redo || [] ).length;
		},

		/**
		 * Get the length of `tasks`
		 *
		 * @return {Number}
		 */
		getLengthTasks: function() {
			return ( this._$temp.changesHistory.tasks || [] ).length;
		},

		/**
		 * Get the last history data by action.
		 *
		 * @param {String} action The action name.
		 * @return {{}} Returns the last data object for the action.
		 */
		getLastHistoryDataByAction: function( action ) {
			var lastData,
				self = this,
				undo = self._$temp.changesHistory.undo;
			if (
				self.getLengthUndo()
				&& $usbcore.indexOf( action, self._CHANGED_ACTION ) > -1
			) {
				for ( var i = self.getLengthUndo() -1; i >= 0; i-- ) {
					if ( ( undo[ i ] || {} ).action === action ) {
						lastData = $usbcore.clone( undo[ i ] );
						break;
					}
				}
			}
			return lastData || {};
		},

		/**
		 * Determines if active recovery task.
		 *
		 * @return {Boolean} True if active recovery task, False otherwise.
		 */
		isActiveRecoveryTask: function() {
			return !! this._$temp.isActiveRecoveryTask;
		},

		/**
		 * Saving data to history by interval
		 * Note: The code is moved to a separate function since `throttle` must be initialized before calling.
		 *
		 * @private
		 * @param {Function} fn The function to be executed
		 * @type throttle
		 */
		__saveDataToHistory: $usbcore.throttle( $usbcore.fn, 3000/* 3 seconds */, /* no_trailing */true ),

		/**
		 * Commit to save changes to history.
		 * Note: This method is designed to work only with builder elements.
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1".
		 * @param {String} action The action that is executed to apply the changes.
		 * @param {Boolean} useThrottle Using the interval when saving data.
		 * @param {{}} extData External end-to-end data.
		 */
		commitChangeToHistory: function( id, action, useThrottle, extData ) {
			var self = this,
				changedAction = self._CHANGED_ACTION;
			if (
				! action
				|| ! self.isValidId( id )
				|| self.isActiveRecoveryTask()
				|| $usbcore.indexOf( action, changedAction ) < 0
			) {
				return;
			}

			/**
			 * Save change data in history
			 *
			 * @private
			 * @var {Function}
			 */
			var saveDataToHistory = function() {
				var changesHistory = self._$temp.changesHistory;
				/**
				 * The current data of the shortcode before applying the action
				 * @type {{}}
				 */
				var data = {
					action: action,
					id: id,
					extData: $.isPlainObject( extData ) ? extData : {},
				};

				// Get and save the position of an element
				if ( $usbcore.indexOf( action, [ changedAction.MOVE, changedAction.REMOVE ] ) > -1 ) {
					data.index = self.getElmIndex( id );
					data.parentId = self.getElmParentId( id );
				}
				// Get and save the preview of an element
				if ( $usbcore.indexOf( action, [ changedAction.UPDATE, changedAction.REMOVE ] ) > -1 ) {
					data.content = self.getElmShortcode( id );
					data.editable = ( id === self.selectedElmId );
					data.preview = self.getElmOuterHtml( id );

					// Сheck the loading of the element, if the preview contains the class for updating the element,
					// then we will skip saving to history
					var pcre = new RegExp( 'class="(.*)?'+ self.config( 'className.elmLoading', '' ) +'(\s|")' );
					if ( data.preview && pcre.test( data.preview ) ) {
						return;
					}
				}
				/**
				 * Get data from shared cache
				 * Note: The cache provides correct data when multiple threads `debounce` or `throttle` are running.
				 */
				if ( changedAction.UPDATE === action && ! $.isEmptyObject( self._$temp._latestShortcodeUpdates ) ) {
					$.extend( data, self._$temp._latestShortcodeUpdates );
					self._$temp._latestShortcodeUpdates = {};
				}

				// Get parameters before deleting, this will help restore the element
				if ( changedAction.REMOVE === action ) {
					data.values = self.getElmValues( id );
				}

				// Checking against the latest data to eliminate duplicates
				if ( changedAction.UPDATE === action ) {

					// Get the last history data by action
					var lastData = self.getLastHistoryDataByAction( changedAction.UPDATE );

					// Check for duplicate objects
					var props = [ 'content', 'index', 'parentId', 'timestamp' ]; // Properties to remove
					if (
						! $.isEmptyObject( lastData )
						&& $usbcore.comparePlainObject(
							$usbcore.clearPlainObject( lastData, props ),
							$usbcore.clearPlainObject( data, props )
						)
					) {
						return;
					}
				}

				// If the maximum limit is exceeded, then we will delete the old data
				if ( self.getLengthUndo() >= $usbcore.parseInt( self.config( 'maxDataHistory', /* Default */100 ) ) ) {
					changesHistory.undo = changesHistory.undo.slice( 1 );
				}

				// Saving data in `undo` and destroying `redo`
				changesHistory.undo.push( $.extend( data, { timestamp: Date.now() } ) );
				changesHistory.redo = [];
				self.trigger( 'historyChanged' );
			};

			// Saving data with and without interval.
			if ( !! useThrottle ) {
				self.__saveDataToHistory( saveDataToHistory );
			} else {
				saveDataToHistory();
			}
		},

		/**
		 * Commit to save data to history.
		 * Note: This method is for storing arbitrary data and restoring via a callback function.
		 *
		 * @param {Mixed} data The commit data.
		 * @param {Function} callback The restore callback function.
		 * @param {Boolean} useThrottle Using the interval when saving data.
		 */
		commitDataToHistory: function( customData, callback, useThrottle ) {
			var self = this,
				changedAction = self._CHANGED_ACTION;
			if (
				$usbcore.isUndefined( customData )
				|| ! $.isFunction( callback )
			) {
				return;
			}

			/**
			 * Save change data in history
			 *
			 * @private
			 * @var {Function}
			 */
			var saveDataToHistory = function() {
				var changesHistory = self._$temp.changesHistory,
					data = {
						action: changedAction.CALLBACK,
						callback: callback,
						data: customData
					};

				// Get the last history data by action
				var lastData = self.getLastHistoryDataByAction( changedAction.CALLBACK );

				// Check for duplicate objects
				if (
					! $.isEmptyObject( lastData )
					&& $usbcore.comparePlainObject(
						$usbcore.clearPlainObject( lastData, [ 'callback', 'timestamp' ] ),
						$usbcore.clearPlainObject( data, 'callback' )
					)
				) {
					return;
				}

				// If the maximum limit is exceeded, then we will delete the old data
				if ( self.getLengthUndo() >= $usbcore.parseInt( self.config( 'maxDataHistory', /* Default */100 ) ) ) {
					changesHistory.undo = changesHistory.undo.slice( 1 );
				}

				// Saving data in `undo` and destroying `redo`
				changesHistory.undo.push( $.extend( data, { timestamp: Date.now() } ) );
				changesHistory.redo = [];
				self.trigger( 'historyChanged' );
			};

			// Saving data with and without interval
			if ( !! useThrottle ) {
				self.__saveDataToHistory( saveDataToHistory );
			} else {
				saveDataToHistory();
			}
		},

		/**
		 * Create a recovery task.
		 *
		 * @private
		 * @param {Number} type Task type, the value can be or greater or less than zero.
		 */
		_createRecoveryTask: function( type ) {
			var self = this;
			// Checking the correctness of the task type
			if ( ! type || $usbcore.indexOf( type, [ self._HISTORY_TYPE.UNDO, self._HISTORY_TYPE.REDO ] ) < 0 ) {
				return;
			}

			var task, // Found recovery task
				lengthUndo = self.getLengthUndo(),
				lengthRedo = self.getLengthRedo(),
				changesHistory = self._$temp.changesHistory; // object link

			// Get data from `undo`
			if ( type === self._HISTORY_TYPE.UNDO && lengthUndo ) {
				task = changesHistory.undo[ --lengthUndo ];
				changesHistory.undo = changesHistory.undo.slice( 0, lengthUndo );
			}
			// Get data from `redo`
			if ( type === self._HISTORY_TYPE.REDO && lengthRedo ) {
				task = changesHistory.redo[ --lengthRedo ];
				changesHistory.redo = changesHistory.redo.slice( 0, lengthRedo );
			}

			// Add a recovery task to the queue
			if ( ! $.isEmptyObject( task ) ) {
				changesHistory.tasks.push( $usbcore.clone( task, { _source: type } ) );
				self.trigger( 'historyChanged' );
				// Apply all recovery tasks
				self.__startRecoveryTasks.call( self );
			}
		},

		/**
		 * Start all recovery tasks
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @param {Function} fn The function to be executed
		 * @type debounced
		 */
		__startRecoveryTasks: $usbcore.debounce( function() {
			var self = this;
			if ( self.isActiveRecoveryTask() ) {
				return;
			}
			// Launch Task Manager
			self._$temp.isActiveRecoveryTask = true;
			self._recoveryTaskManager();
		}, 100/* ms */ ),

		/**
		 * Recovery Task Manager
		 * Note: Manage and apply tasks from a shared queue for data recovery.
		 *
		 * @private
		 */
		_recoveryTaskManager: function() {
			var self = this,
				lengthTasks = self.getLengthTasks(),
				changedAction = self._CHANGED_ACTION,
				changesHistory = self._$temp.changesHistory,
				task = changesHistory.tasks[ --lengthTasks ]; // Get last task

			// Check the availability of the task
			if ( $.isEmptyObject( task ) ) {
				self._$temp.isActiveRecoveryTask = false;
				self.trigger( 'historyChanged' );
				return;
			}

			// Remove the task from the general list
			changesHistory.tasks = changesHistory.tasks.slice( 0, lengthTasks );

			/**
			 * Apply changes from task
			 * Note: Timeout will allow to collect data and update the task before recovery.
			 */
			$usbcore.timeout( self._applyChangesFromTask.bind( self, $usbcore.clone( task ), /* originalTask */task ), 1 );

			// Reversing actions Create/Remove in a task
			switch( task.action ) {
				case changedAction.CREATE:
					task.action = changedAction.REMOVE;
					break;
				case changedAction.REMOVE:
					task.action = changedAction.CREATE;
					break;
			}

			// Get and save the preview of an element
			if ( $usbcore.indexOf( task.action, [ changedAction.UPDATE, changedAction.REMOVE ] ) > -1 ) {
				task.content = self.getElmShortcode( task.id );
				task.preview = self.getElmOuterHtml( task.id );
			}

			// Position updates on movements
			if ( $usbcore.indexOf( task.action, [ changedAction.MOVE, changedAction.REMOVE ] ) > -1 ) {
				task.index = self.getElmIndex( task.id );
				task.parentId = self.getElmParentId( task.id );
			}

			// Move task in the opposite direction
			var _source = task._source;
			delete task._source;
			if ( _source === self._HISTORY_TYPE.UNDO ) {
				changesHistory.redo.push( task );
			} else {
				changesHistory.undo.push( task );
			}
		},

		/**
		 * Apply changes from task.
		 *
		 * @private
		 * @param {{}} task Cloned version of the task.
		 * @param {{}} originalTask Task object from history.
		 */
		_applyChangesFromTask: function( task, originalTask ) {
			var self = this;
			if ( $.isEmptyObject( task ) ) {
				self._$temp.isActiveRecoveryTask = false;
				return;
			}
			// Сheck the validation of the task
			if ( ! task.action ) {
				self._debugLog( 'Error: Invalid change action:', task );
				return;
			}

			// Alias on the action list
			var changedAction = self._CHANGED_ACTION;

			// Data recovery depending on the applied action
			if ( task.action === changedAction.CREATE ) {
				self.removeElm( task.id );

				// Move the element to a new position
			} else if ( task.action === changedAction.MOVE ) {
				self.moveElm( task.id, task.parentId, task.index );

				// Create the element
			} else if ( task.action === changedAction.REMOVE ) {
				// Added shortcode to content
				if ( ! self._addShortcodeToContent( task.parentId, task.index, task.content ) ) {
					return false;
				}
				// Get insert position
				var insert = self.getInsertPosition( task.parentId, task.index );
				// Add new shortcde to preview page
				self.postMessage( 'insertElm', [ insert.parent, insert.position, '' + task.preview ] );
				self.postMessage( 'maybeInitElmJS', [ task.id ] ); // Init its JS if needed
				// Restore editing element
				if ( !! task.editable ) {
					self.trigger( 'elmSelected', task.id );
				}

				// Update element from task
			} else if ( task.action === changedAction.UPDATE ) {
				// Shortcode updates
				self.pageData.content = ( '' + self.pageData.content )
					.replace( self.getElmShortcode( task.id ), task.content );
				// Refresh shortcode preview
				self.postMessage( 'updateSelectedElm', [ task.id, '' + task.preview ] );
				// Restore editing element
				if ( !! task.editable && task.id !== self.selectedElmId ) {
					self.trigger( 'elmSelected', task.id );
				}
				// Refresh data in editing active fieldset
				var id = ( task.extData || {} ).originalId || task.id;
				if ( id === self.selectedElmId && self.activeElmFieldset instanceof $usof.GroupParams ) {
					self.activeElmFieldset.setValues( self.getElmValues( self.selectedElmId ), /* quiet mode */true );
				}

				// Pass the committed data to a custom handle
			} else if ( task.action === changedAction.CALLBACK ) {
				// If there is a handler, then call it and pass the captured data
				if ( $.isFunction( task.callback ) ) {
					task.callback.call( self, $usbcore.clone( task ).data, originalTask );
				}

			} else {
				self._debugLog( 'Error: Unknown recovery action:', action );
				return;
			}

			// Send a signal to create or update element
			if ( $usbcore.indexOf( task.action, [ changedAction.UPDATE, changedAction.REMOVE ] ) > -1 ) {
				self.trigger( 'contentChange' );
			}

			// Trigger the event to work out the controls parts
			self.trigger( 'historyChanged' );

			// Calling the task manager for further processing of the task list
			// Note: Timeout helps to avoid recovery bugs when the browser is loaded.
			$usbcore.timeout( self._recoveryTaskManager.bind( self ), 1 );
		}
	} );

	/**
	 * Functionality for the implementation of Fieldsets
	 */
	$usbPrototype.$$fieldsets = {
		/**
		 * Toggles the USOF tabs of the settings panel
		 *
		 * @private For fieldsets
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_toggleTabs: function( e ) {
			var $target = $( e.currentTarget ),
				$sections = $target
					.parents( '.usof-tabs:first' )
					.find( '> .usof-tabs-sections > *' );

			// This is toggling the tab title
			$target
				.addClass( 'active' )
				.siblings()
				.removeClass( 'active' );

			// This is toggling the tab sections
			$sections
				.removeAttr( 'style' )
				.eq( $target.index() )
				.addClass( 'active' )
				.siblings()
				.removeClass( 'active' );
		},

		/**
		 * Auto showing or hidden of tabs for fieldsets
		 *
		 * @private
		 */
		autoShowingTabs: function() {
			var self = this;
			if ( ! self.activeElmFieldset || ! self.activeElmFieldset.isGroupParams ) {
				return;
			}
			$.each( self.activeElmFieldset.$tabsSections, function( index, section ) {
				var fields = $( '> *', section ).toArray(),
					isHidden = true;
				for ( var k in fields ) {
					var $field = $( fields[ k ] ),
						isShown = $field.data( 'isShown' );
					if ( $usbcore.isUndefined( isShown ) ) {
						isShown = ( $field.css( 'display' ) != 'none' );
					}
					if ( isShown ) {
						isHidden = false;
						break;
					}
				}
				self.activeElmFieldset.$tabsItems
					.eq( index )
					.toggleClass( 'hidden', isHidden );
			} );
		}
	};

	/**
	 * Functionality for the implementation of Main API
	 */
	$.extend( $usbPrototype, {

		/**
		 * Get config value
		 *
		 * @param {String} path Dot-delimited path to get value from config objects
		 * @param {Mixed} _default Default value when not in configs
		 * @return {Mixed}
		 */
		config: function( path, _default ) {
			return $usbcore.deepFind( this._config, path, _default );
		},

		/**
		 * Checks for hotkey combination usage by key.
		 *
		 * @param {String} ...keys The short command keys.
		 * @return {Boolean} Returns true if used, otherwise false.
		 */
		hotkeys: function() {
			var args = [].slice.call( arguments );
			for( var i in args ) {
				if ( this._hotkeyStates[ '' + args[ i ] ] === true ) {
					return true;
				}
			}
			return false;
		},

		/**
		 * Get text translation by key
		 *
		 * @param {String} key The key
		 * @return {String} The text
		 */
		getTextTranslation: function( key ) {
			if ( ! key ) {
				return '';
			}
			return ( _window.$usbdata.textTranslations || {} )[ key ] || key;
		},

		/**
		 * Determines if ontent hanged.
		 *
		 * @return {Boolean} True if ontent hanged, False otherwise.
		 */
		isContentChanged: function() {
			var self = this;
			return ( self._$temp.savedPageData.content || '' ) !== ( self.pageData.content || '' );
		},

		/**
		 * Determines if page custom css hanged.
		 *
		 * @return {Boolean} True if page custom css hanged, False otherwise.
		 */
		isPageCustomCssChanged: function() {
			var self = this;
			return ( self._$temp.savedPageData.customCss || '' ) !== ( self.pageData.customCss || '' );
		},

		/**
		 * Determines if page fields changed.
		 *
		 * @return {Boolean} True if page fields changed, False otherwise.
		 */
		isPageFieldsChanged: function() {
			var self = this;
			return ! $usbcore.comparePlainObject( self._$temp.savedPageData.fields, self.pageData.fields );
		},

		/**
		 * Determines if page meta data changed.
		 *
		 * @return {Boolean} True if page meta data changed, False otherwise.
		 */
		isPageMetaChanged: function() {
			var self = this;
			return ! $usbcore.comparePlainObject( self._$temp.savedPageData.pageMeta, self.pageData.pageMeta );
		},

		/**
		 * Determines if page changed.
		 *
		 * @return {Boolean} True if page changed, False otherwise.
		 */
		isPageChanged: function() {
			var self = this;
			return (
				self.isContentChanged()
				|| self.isPageMetaChanged()
				|| self.isPageFieldsChanged()
				|| self.isPageCustomCssChanged()
			);
		},

		/**
		 * Showing error messages for debugging
		 *
		 * @private
		 * @param {String} text
		 * @param {Mixed} data
		 */
		_debugLog: function() {
			var args = arguments;
			if ( ! args.length ) {
				args = [ '_debugLog: called with no params' ];
			}
			console.log.apply( null, args );
		},

		/**
		 * Get the temporary object
		 *
		 * @param {String} key The key
		 * @return {{}}
		 */
		getTemp: function( key ) {
			var self = this;
			if ( key && ! self._temp[ key ] ) {
				return self._temp[ key ] = {};
			}
			return key ? self._temp[ key ] : self._temp;
		},

		/**
		 * Set data the temporary
		 *
		 * @param {String} key The key name
		 * @param {Mixed} value The value
		 */
		setTemp: function( key, value ) {
			this._temp[ '' + key ] = value || {};
		},

		/**
		 * Flush temporary data
		 *
		 * @param {String} key The key name
		 */
		flushTemp: function( key ) {
			this.setTemp( key );
		},

		/**
		 * Saving content temporarily in a temporary variable, this is necessary
		 * for the move mode where the moved element should not be present in
		 * the content. These method are mainly needed for Drag and Drop in move mode.
		 */
		saveTempContent: function() {
			var self = this;
			self._$temp.tempContent = '' + self.pageData.content;
		},

		/**
		 * Restoring content from a temporary variable, these method are mainly
		 * needed for Drag and Drop in move mode. This method works from `self.saveTempContent()`
		 *
		 * @return {Boolean} True if the content has been restored, False otherwise.
		 */
		restoreTempContent: function() {
			var self = this;
			if ( ! self.isEmptyTempContent() ) {
				self.pageData.content = ( '' + self._$temp.tempContent ) || self.pageData.content;
				delete self._$temp.tempContent;
				return true
			}
			return false;
		},

		/**
		 * This method to determine if temporary content is installed.
		 *
		 * @return {Boolean} True if temporary content, False otherwise.
		 */
		isEmptyTempContent: function() {
			return $usbcore.isUndefined( this._$temp.tempContent )
		},

		/**
		 * This method determines whether the page content is empty or not
		 *
		 * @return {Boolean} True if empty content, False otherwise.
		 */
		isEmptyContent: function() {
			return ( '' + this.pageData.content ).indexOf( '[vc_row' ) === -1;
		},

		/**
		 * Determines whether the specified mode is valid mode.
		 *
		 * @param {String} mode The mode
		 * @return {Boolean} True if the specified mode is valid mode, False otherwise.
		 */
		isValidMode: function( mode ) {
			return !! ( mode && [ 'editor', 'preview', 'drag:add', 'drag:move' ].indexOf( mode ) > -1 );
		},

		/**
		 * Determines if mode
		 * As parameters, you can set both one mode and several to check for matches,
		 * if at least one of the results matches, then it will be true
		 *
		 * @return {Boolean} True if the specified mode is mode, False otherwise
		 */
		isMode: function() {
			// Get set modes, example: 'editor', 'preview', 'drag:add', 'drag:move'
			var args = arguments,
				self = this;
			for ( var i in args ) {
				if ( self.isValidMode( args[ i ] ) && self._mode === args[ i ] ) return true;
			}
			return false;
		},

		/**
		 * Set the mode
		 *
		 * @param {String} mode The mode
		 * @return {Boolean} True if mode changed successfully, False otherwise
		 */
		setMode: function( mode ) {
			var self = this;
			if (
				mode
				&& self.isValidMode( mode )
				&& mode !== self._mode
			) {
				var oldMode = self._mode;
				// The mode change event
				self.trigger( 'modeChange', [ /* newMode */self._mode = mode, oldMode ] );
				return true;
			}
			return false;
		},

		/**
		 * Gets the mode
		 * Note: The code is not used.
		 *
		 * @return {String} The mode
		 */
		getMode: function() {
			return this._mode || '';
		},

		/**
		 * Get the attachment
		 *
		 * @param {Number} id The attachment id
		 * @return {{}}
		 */
		getAttachment: function( id ) {
			if ( ! id || ! wp.media ) {
				return;
			}
			return wp.media.attachment( id );
		},

		/**
		 * Get the attachment url
		 *
		 * @param {Number} id The attachment id
		 * @return {String}
		 */
		getAttachmentUrl: function( id ) {
			if ( ! id  ) {
				return '';
			}
			return ( this.getAttachment( id ) || { get: $.noop } ).get( 'url' ) || '';
		},

		/**
		 * Generate a RegExp to identify a shortcode
		 * Note: RegExp does not know how to work with nesting the shortcode in itself.
		 *
		 * Capture groups:
		 *
		 * 1. An extra `[` to allow for escaping shortcodes with double `[[]]`
 		 * 2. The shortcode name
 		 * 3. The shortcode argument list
 		 * 4. The self closing `/`
 		 * 5. The content of a shortcode when it wraps some content
 		 * 6. The closing tag
 		 * 7. An extra `]` to allow for escaping shortcodes with double `[[]]`
		 *
		 * @param {String} tag The shortcode tag "us_btn" or "vc_row|vc_column|..."
		 * @return {RegExp} The elm shortcode regular expression
		 */
		getShortcodePattern: function( tag ) {
			return new RegExp( '\\[(\\[?)(' + tag + ')(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)', 'g' );
		},

		/**
		 * Remove html from start and end content
		 *
		 * @param {String} content
		 * @return {String}
		 */
		removeHtmlWrap: function( content ) {
			return ( '' + content )
				.replace( /^<[^\[]+|[^\]]+$/gi, '' );
		},

		/**
		 * Parse shortcode text in parts
		 *
		 * @param {String} shortcode The shortcode text
		 * @return {{}}
		 */
		parseShortcode: function( shortcode ) {
			var self = this;
			if ( ! shortcode ) {
				return {};
			}
			// Remove html from start and end of content
			shortcode = self.removeHtmlWrap( shortcode );

			// Get shortcode parts
			var firstTag = ( shortcode.match( /^.*?\[(\w+)\s/ ) || [] )[ /* Tag name */1 ] || '',
				result = ( self.getShortcodePattern( firstTag ) ).exec( shortcode );

			if ( result ) {
				return {
					tag: result[ 2 ], // The shortcode tag of the current object
					atts: self._unescapeAttr( result[ 3 ] || '' ), // The a string representation of the shortcode attributes
					input: result[ 0 ], // The input shortcode text
					content: result[ 5 ] || '', // The content of the shortcode if there is of course
					hasClosingTag: !! result[ 6 ] // The need for an closing tag
				};
			}

			return {};
		},

		/**
		 * Convert attributes from string to object
		 *
		 * @param {String} atts The string atts
		 * @return {{}}
		 */
		parseAtts: function( str ) {
			var result = {};
			if ( ! str ) {
				return result;
			}
			// Map zero-width spaces to actual spaces
			str = str.replace( /[\u00a0\u200b]/g, ' ' );
			// The retrieving attributes from a string
			( str.match( /[\w-_]+="([^\"]+)?"/g ) || [] ).forEach( function( item ) {
				item = item.match( /([\w-_]+)="([^\"]+)?"/ );
				if ( ! item ) {
					return;
				}
				result[ item[ /* Name */1 ] ] = ( '' + ( item[ /* Value */2 ] || '' ) ).trim();
			});
			return result;
		},

		/**
		 * Converts a shortcode object to a string
		 *
		 * @param {{}} object The shortcode object
		 * @param {{}} attsDefaults The default atts
		 * @return {String}
		 */
		buildShortcode: function( shortcode, attsDefaults ) {
			if ( $.isEmptyObject( shortcode ) ) {
				return '';
			}
			var self = this,
				// Create shortcode
				result = '[' + shortcode.tag;
			// The add attributes
			if ( shortcode.atts || attsDefaults ) {
				if ( ! $.isEmptyObject( attsDefaults ) ) {
					shortcode.atts = self.buildAtts( self.parseAtts( shortcode.atts ), attsDefaults );
				}
				// Escaping for shortcode attributes
				shortcode.atts = self._escapeAttr( shortcode.atts );
				result += ' ' + shortcode.atts.trim();
			}
			result += ']';
			// The add content
			if ( shortcode.content ) {
				result += shortcode.content;
			}
			// The add end tag
			if ( shortcode.hasClosingTag ) {
				result += '[/'+ shortcode.tag +']';
			}
			return '' + result;
		},

		/**
		 * Returns a string representation of an attributes
		 *
		 * @param {{}} atts This is an attributes object
		 * @param {{}} defaults The default atts
		 * @return {String} String representation of the attributes
		 */
		buildAtts: function( atts, defaults ) {
			if ( ! atts || $.isEmptyObject( atts ) ) {
				return '';
			}
			if ( $.isEmptyObject( defaults ) ) {
				defaults = {};
			}
			var result = [];
			for ( var k in atts ) {
				var value = atts[ k ];
				// Checking the values for correctness, otherwise we will skip the additions.
				if (
					value === null
					|| $usbcore.isUndefined( value )
					|| (
						! $usbcore.isUndefined( defaults[ k ] )
						&& defaults[ k ] === value
					)
				) {
					continue;
				}
				// Converting parameter list to string (for wp link)
				if ( $.isPlainObject( value ) ) {
					var inlineValue = [];
					for ( var i in value ) {
						if ( value[ i ] ) {
							inlineValue.push( i + ':' + value[ i ] );
						}
					}
					value = inlineValue.join('|');
				}
				result.push( k + '="' + value + '"' );
			}
			return result.join( ' ' );
		},

		/**
		 * Convert pattern to string from result
		 *
		 * @param {String} template The string template
		 * @param {{}} params The parameters { key: 'value'... }
		 * @return {String}
		 */
		buildString: function( template, params ) {
			if ( ! $.isPlainObject( params ) ) {
				params = {};
			}
			var self = this,
				// Create pattern for regular expression. Variable example: `{%var_name%}`
				pattern = $usbcore.escapePcre( self.config( 'startSymbol', '{%' ) );
				pattern += '([A-z\\_\\d]+)';
				pattern += $usbcore.escapePcre( self.config( 'endSymbol', '%}' ) );
			// Replace all variables with values
			return ( '' + template ).replace( new RegExp( pattern, 'gm' ), function( _, varName ) {
				return '' + ( params[ varName ] || '' );
			} );
		},

		/**
		 * Get the shortcode siblings ids
		 *
		 * @private
		 * @param {String} content The content
		 * @return {[]} The shortcode siblings
		 */
		_getShortcodeSiblingsIds: function( content ) {
			content = '' + content || '';

			if ( ! content ) {
				return [];
			}
			var self = this,
				i = 0,
				result = [],
				firstShortcode;

			while ( firstShortcode = self.parseShortcode( content ) ) {
				if ( i++ > /* max number of iterations */9999 || $.isEmptyObject( firstShortcode ) ) {
					break;
				}
				var usbid = self.parseAtts( firstShortcode.atts )['usbid'] || null;
				if ( usbid ) {
					result.push( usbid );
				}
				content = content.replace( firstShortcode.input, '' );
			}

			return result;
		},

		/**
		 * Determines whether the specified id is valid id
		 *
		 * @private
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {Boolean} True if the specified id is valid id, False otherwise
		 */
		isValidId: function( id ) {
			return id && /^([\w\-]+):(\d+)$/.test( id );
		},

		/**
		 * Determines whether the specified identifier is row.
		 *
		 * @param {String} id Shortcode's usbid, e.g. "vc_row:1"
		 * @return {Boolean} True if the specified identifier is row, False otherwise.
		 */
		isRow: function( id ) {
			return this.getElmName( id ) === 'vc_row';
		},

		/**
		 * Determines whether the specified identifier is column.
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_column:1"
		 * @return {Boolean} True if the specified identifier is column, False otherwise.
		 */
		isColumn: function( id ) {
			return [ 'vc_column', 'vc_column_inner' ].indexOf( this.getElmName( id ) ) > -1;
		},

		/**
		 * Determines whether the specified id is main container id,
		 * this is the root whose name is assigned to `self.mainContainer`,
		 * for example name: `container`
		 *
		 * @param {String} id Shortcode's usbid, e.g. "container"
		 * @return {Boolean} True if the specified id is container id, False otherwise
		 */
		isMainContainer: function( id ) {
			return id && id === this.mainContainer;
		},

		/**
		 * Determines whether the specified identifier is container.
		 *
		 * @param {String} name Shortcode's usbid, e.g. "vwrapper:1"
		 * @return {Boolean} True if the specified identifier is container, False otherwise.
		 */
		isElmContainer: function( name ) {
			var self = this,
				name = self.isValidId( name )
					? self.getElmName( name )
					: name;
			return name && self.config( 'shortcode.containers', [] ).indexOf( name ) > -1;
		},

		/**
		 * Determining whether an element needs to be updated from the parent
		 *
		 * @param {String|Node} id Shortcode's usbid, e.g. "vc_tta_section:1"
		 * @return {Boolean} True if the specified identifier is elm parent update, False otherwise.
		 */
		isUpdateIncludeParent: function( id ) {
			var self = this;
			if ( $usbcore.isNode( id ) ) {
				id = self.getElmId( id );
			}
			if ( ! self.isValidId( id ) ) {
				return false;
			}
			var name = self.getElmName( id );
			return name && self.config( 'shortcode.update_parent', [] ).indexOf( name ) > -1;
		},

		/**
		 * Determines whether the specified id is second elm container,
		 * for example: `vc_column`, `vc_column_inner`, `vc_tta_section` etc.
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {Boolean} True if the specified id is elm root container, False otherwise.
		 */
		isSecondElmContainer: function( id ) {
			var self = this;
			if ( self.isValidId( id ) ) {
				id = self.getElmName( id );
			}
			return (
				id
				&& self.isElmContainer( id )
				&& ! self.isRootElmContainer( id )
				&& !! self.config( 'shortcode.relations.as_child.' + id + '.only' )
			);
		},

		/**
		 * Determines whether the specified id is elm root container,
		 * for example: `vc_row`, `vc_row_inner`, `vc_tta_tabs`, `vc_tta_accordion` etc.
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {Boolean} True if the specified id is elm root container, False otherwise.
		 */
		isRootElmContainer: function( id ) {
			var self = this;
			if ( self.isValidId( id ) ) {
				id = self.getElmName( id );
			}
			return (
				self.isElmContainer( id )
				&& !! self.config( 'shortcode.relations.as_parent.' + id + '.only' )
			);
		},

		/**
		 * Determines whether the specified identifier is tab.
		 *
		 * @param {String} name The name e.g. "vc_tta_tabs:1"
		 * @return {Boolean} True if the specified identifier is tab, False otherwise.
		 */
		isElmTab: function( name ) {
			var self = this;
			if ( self.isValidId( name ) ) {
				name = self.getElmType( name );
			}
			return [ 'vc_tta_tabs', 'vc_tta_tour' ].indexOf( name ) > -1;
		},

		/**
		 * Escape for shortcode attributes
		 *
		 * @private
		 * @param {String} value The value
		 * @return {String} Returns a string from escaped with special characters
		 */
		_escapeAttr: function( value ) {
			return ( '' + value )
				.replaceAll( '[', '&#91;' )
				.replaceAll( ']', '&#93;' );
		},

		/**
		 * Unescape for shortcode attributes
		 *
		 * @private
		 * @param {String} value The value
		 * @return {String} Returns a string from the canceled escaped special characters
		 */
		_unescapeAttr: function( value ) {
			return ( '' + value )
				.replaceAll( '&#91;', '[' )
				.replaceAll( '&#93;', ']' );
		},

		/**
		 * Checking the possibility of moving the shortcode to the specified parent
		 * Note: This method has specific exceptions in `move:add` for self.mainContainer
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @param {String} parent Shortcode's usbid, e.g. "vc_column:1"
		 * @param {Boolean} strict The ON/OFF strict mode
		 * @return {Boolean} True if able to be child of, False otherwise.
		 */
		canBeChildOf: function( id, parent, strict ) {
			var self = this,
				isMainContainer = self.isMainContainer( parent );
			if (
				self.isMainContainer( id ) // It is forbidden to move the main container!
				|| ! self.isValidId( id )
				|| ! ( self.isValidId( parent ) || isMainContainer )
			) {
				return false;
			}
			// Get all relations for shortcodes
			var shortcodeRelations = $.extend( {}, self.config( 'shortcode.relations', {} ) );

			// If there are no deps, we will allow everyone to move.
			if ( $.isEmptyObject( shortcodeRelations ) ) {
				self._debugLog( 'Notice: There are no relations and movement is allowed for every one', arguments );
				return true;
			}

			// Get all names without prefixes and indices
			var targetName = self.getElmName( id ),
				parentName = isMainContainer
					? parent
					: self.getElmName( parent ),
				result = true;

			/**
			 * The a checking all shortcodes relations
			 *
			 * Relations name `as_parent` and `as_child` obtained from Visual Composer
			 * @see https://kb.wpbakery.com/docs/developers-how-tos/nested-shortcodes-container/
			 *
			 * Example relations: {
			 *		as_child: {
			 *			vc_row: {
			 *				only: 'container',
			 *			},
			 *			vc_tta_section: { // Separate multiple values with comma
			 *				only: 'vc_tta_tabs,vc_tta_accordion...',
			 *			},
			 *			...
			 *		},
			 *		as_parent: {
			 *			vc_row: {
			 *				only: 'vc_column',
			 *			},
			 *			hwrapper: { // Separate multiple values with comma
			 *				except: 'vc_row,vc_column...',
			 *			},
			 *			...
			 *		}
			 * }
			 */
			for ( var name in shortcodeRelations ) {
				if ( ! result ) {
					break;
				}
				var relations = shortcodeRelations[ name ][ name === 'as_child' ? targetName : parentName ];
				if ( ! $usbcore.isUndefined( relations ) ) {
					for ( var condition in relations ) {
						// If checking occurs in `move:add` then skip the rule for the main container, when adding
						// a new element, it is allowed to add simple elements to the main container
						if (
							self.isMode( 'drag:add' )
							&& parentName === self.mainContainer
							&& ! self.isSecondElmContainer( id )
						) {
							continue;
						}
						// If the rules have already prohibited the specified connection, then we complete the check
						if ( ! result ) {
							break;
						}
						var allowed = ( relations[ condition ] || '' ).split(','),
							isFound = allowed.indexOf( name === 'as_child' ? parentName : targetName ) !== -1;
						if (
							( condition === 'only' && ! isFound )
							|| ( condition === 'except' && isFound )
						) {
							result = false;
						}
					}
				}
			}

			// Strict validation will ensure that secondary elements are allowed to
			// move within the same parent.
			if (
				result
				&& !! strict
				&& self.isSecondElmContainer( id )
			) {
				// The check if  temporary content, then we will restore it to get the correct data,
				// this is only necessary for the `drag:move`
				var isTempContent = ( self.isMode( 'drag:move' ) && ! self.isEmptyTempContent() ),
					tempContent;
				if ( isTempContent ) {
					tempContent = self.pageData.content;
					self.restoreTempContent();
				}

				// Get a parent for the floated `id`
				var elmParentId = self.getElmParentId( id );

				// After receiving the data, we restore the variable,
				// this is only necessary for the `drag:move`
				if ( isTempContent && tempContent ) {
					self.saveTempContent();
					self.pageData.content = '' + tempContent;
				}

				return parent === elmParentId;
			}

			return result;
		},

		/**
		 * Determine has same type parent.
		 *
		 * @param {String} type The tag type "us_btn|us_btn:1"
		 * @param {String} parent Shortcode's usbid, e.g. "vc_column:1"
		 * @return {Boolean} True if able to be parent of, False otherwise.
		 */
		hasSameTypeParent: function( type, parent ) {
			var self = this;
			if (
				self.isMainContainer( type )
				|| self.isMainContainer( parent )
				|| ! self.isValidId( parent )
			) {
				return false;
			}
			// Get type
			type = self.isValidId( type )
				? self.getElmType( type )
				: type;
			// If the type is from the parent of the same type.
			if ( type === self.getElmType( parent ) ) {
				return true;
			}
			// Search all parents
			var index = 0;
			while( parent !== null || self.isMainContainer( parent ) ) {
				// After exceeding the specified number of iterations, the loop will be stopped
				if ( index++ >= /* max number of iterations */9999 ) {
					break;
				}
				parent = self.getElmParentId( parent );
				if ( self.getElmType( parent ) === type ) {
					return true;
				}
			}
			return false;
		},

		/**
		 * Get the elm type
		 *
		 * @param {String|Node} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {String} The elm type
		 */
		getElmType: function( id ) {
			var self = this;
			if ( $usbcore.isNode( id ) ) {
				id = self.getElmId( id );
			}
			return self.isValidId( id )
				? id.split(':')[ /* Type */0 ] || ''
				: '';
		},

		/**
		 * Get the elm name.
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {String}
		 */
		getElmName: function( id ) {
			var type = this.getElmType( id );
			return ( type.match( /us_(.*)/ ) || [] )[ /* Name */1 ] || type;
		},

		/**
		 * Get the elm title
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {String}
		 */
		getElmTitle: function( id ) {
			var self = this;
			if ( ! self.isValidId( id ) ) {
				return 'Unknown';
			}
			var name = self.getElmName( id );
			return self.config( 'elm_titles.' + name, name );
		},

		/**
		 * Check if a shortcode with a given name exists or not
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {Boolean}
		 */
		doesElmExist: function( id ) {
			var self = this;
			if ( ! self.isValidId( id ) || ! self.pageData.content ) {
				return false;
			}
			return ( new RegExp( '\\['+ self.getElmType( id ) +'[^\\]]+usbid=\\"'+ $usbcore.escapePcre( id ) +'\\"' ) )
				.test( '' + self.pageData.content );
		},

		/**
		 * Get the elm id
		 *
		 * @param {Node} target The target element
		 * @return {String} id Shortcode's usbid, e.g. "us_btn:1"
		 */
		getElmId: function( target ) {
			var self = this,
				id = $usbcore.$attr( target, 'data-usbid' );
			return ( self.isValidId( id ) || self.isMainContainer( id ) )
				? id
				: '';
		},

		/**
		 * Get the index of an element by ID.
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {Number|null} The index of the element (Returns `null` in case of an error)
		 */
		getElmIndex: function( id ) {
			var self = this;
			if ( ! self.isValidId( id ) ) {
				return null;
			}
			var index = ( self.getElmSiblingsId( id ) || [] ).indexOf( id );
			return index > -1
				? index
				: null;
		},

		/**
		 * Generate a spare shortcode usbid for a new element
		 *
		 * @param {String} type
		 * @return {String}
		 */
		getSpareElmId: function( type ) {
			var self = this;
			if ( ! type ) {
				return '';
			}
			if ( ! self._$temp.generatedIds ) {
				self._$temp.generatedIds = [];
			}
			for ( var index = 1;; index++ ) {
				var id = type + ':' + index;
				if ( ! self.doesElmExist( id ) && self._$temp.generatedIds.indexOf( id ) === -1 ) {
					self._$temp.generatedIds.push( id );
					return id;
				}
			}
		},

		/**
		 * Get element's direct parent's ID or a 'container' if element is at the root
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {String|null}
		 */
		getElmParentId: function( id ) {
			var self = this,
				parentId = self.mainContainer;

			if ( id === parentId || ! self.doesElmExist( id ) ) {
				return null;
			}

			var content = ( '' + self.pageData.content ),
				// Get the index of the start of the shortcode
				elmRegex = new RegExp( '\\['+ self.getElmType( id ) +'[^\\]]+usbid=\\"'+ $usbcore.escapePcre( id ) +'\\"' ),
				startPosition = content.search( elmRegex ),
				// Get content before and after shortcode
				prevContent = content.slice( 0, startPosition ),
				nextContent = content.slice( startPosition )
					// Remove all shortcodes of the set type
					.replace( self.getShortcodePattern( self.getElmType( id ) ), '' ),
				closingTags = nextContent.match( /\[\/(\w+)/g ) || [],
				parentTagMatch, parentTag, parentTagAtts;

			$.each( closingTags, function( index, closingTag ) {
				closingTag = closingTag.substr( 2 );
				// Trying to find last opening tag in prevContent
				// TODO: make sure that tags without atts work
				parentTagMatch = prevContent.match( new RegExp( '\\[' + closingTag + '\\s([^\\]]+)(?!.*\\[\\/' + closingTag + '(\\s|\\]))', 's' ) );

				if ( parentTagMatch !== null ) {
					// If matching tag found, checking if its content has current element
					parentTagAtts = self.parseAtts( parentTagMatch[ 1 ] );
					parentTag = self.getElmShortcode( parentTagAtts['usbid'] );
					if ( parentTag.search( elmRegex ) !== -1 ) {
						parentId = parentTagAtts['usbid'];
						return false;
					}
				}
			} );

			// Return parent usbid
			return parentId;
		},

		/**
		 * Get the element next id
		 * Note: The code is not used.
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {String|null} The element next id or null
		 */
		getElmNextId: function( id ) {
			var self = this;
			if ( ! self.isValidId( id ) || self.isMainContainer( id ) ) {
				return null;
			}
			var children = self.getElmChildren( self.getElmParentId( id ) ),
				currentIndex = children.indexOf( id );
			if ( currentIndex < 0 || children.length === currentIndex ) {
				return null;
			}
			return children[ ++currentIndex ] || null;
		},

		/**
		 * Get the element previous id
		 * Note: The code is not used.
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {String|null} The element previous id or null
		 */
		getElmPrevId: function( id ) {
			var self = this;
			if ( ! self.isValidId( id ) || self.isMainContainer( id ) ) {
				return null;
			}
			var children = self.getElmChildren( self.getElmParentId( id ) ),
				currentIndex = children.indexOf( id );
			if ( currentIndex < 0 || currentIndex === 0 ) {
				return null;
			}
			return children[ --currentIndex ] || null;
		},

		/**
		 * Get the element siblings id
		 *
		 * @param {String} id The id  e.g. "us_btn:1"
		 * @return {[]} The element siblings id
		 */
		getElmSiblingsId: function( id ) {
			var self = this;
			if ( ! self.isValidId( id ) || self.isMainContainer( id ) ) {
				return [];
			}
			return self.getElmChildren( self.getElmParentId( id ) );
		},

		/**
		 * Get element's direct children IDs (or empty array, if element doesn't have children)
		 *
		 * @param {String} id Shortcode's usbid, e.g. "vc_row:1"
		 * @return {[]}
		 */
		getElmChildren: function( id ) {
			var self = this,
				isMainContainer = self.isMainContainer( id );

			if (
				! id
				|| ! ( self.isValidId( id ) || isMainContainer )
			) {
				return [];
			}

			var content = ! isMainContainer
				? ( self.parseShortcode( self.getElmShortcode( id ) ) || {} ).content || ''
				: '' + self.pageData.content;

			return self._getShortcodeSiblingsIds( content );
		},

		/**
		 * Get all element's direct children IDs (or empty array, if element doesn't have children)
		 *
		 * @param {String} id Shortcode's usbid, e.g. "vc_row:1"
		 * @return {[]}
		 */
		getElmAllChildren: function( id ) {
			var self = this;
			if ( ! self.isValidId( id ) || ! self.isElmContainer( id ) ) {
				return [];
			}
			var results = [],
				childrenIDs = self.getElmChildren( id );
			for ( var i in childrenIDs ) {
				var childrenId = childrenIDs[i];
				if ( ! self.isValidId( childrenId ) ) {
					continue;
				}
				results.push( childrenId );
				if ( self.isElmContainer( childrenId ) ) {
					results = results.concat( self.getElmAllChildren( childrenId ) );
				}
			}
			return results;
		},

		/**
		 * Get element's shortcode (with all the children if they exist)
		 *
		 * @param {String} id Shortcode's usbid (e.g. "us_btn:1")
		 * @return {String}
		 */
		getElmShortcode: function( id ) {
			var self = this,
				content = ( '' + self.pageData.content );
			if ( $usbcore.isUndefined( id ) ) {
				return content;
			}
			if ( ! self.isValidId( id ) ) {
				return '';
			}

			// The getting shortcodes
			var matches = content.match( self.getShortcodePattern( self.getElmType( id ) ) );

			if ( matches ) {
				for ( var i in matches ) {
					if ( matches[ i ].indexOf( 'usbid="' + id + '"' ) !== -1 ) {
						return matches[ i ];
					}
				}
			}
			return '';
		},

		/**
		 * Get an node or nodes by ID
		 *
		 * @param {String|[]} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {null|Node|[Node..]}
		 */
		getElmNode: function( id ) {
			var self = this;
			if ( ! self.iframe.isLoad ) {
				return null;
			}
			return ( self.iframe.contentWindow.$usbp || {} ).getElmNode( id );
		},

		/**
		 * Get all html for a node including styles
		 *
		 * @param {String|[]} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {String}
		 */
		getElmOuterHtml: function( id ) {
			var self = this;
			if ( ! self.iframe.isLoad ) {
				return '';
			}
			return ( self.iframe.contentWindow.$usbp || {} ).getElmOuterHtml( id ) || '';
		},

		/**
		 * Get shortcode's params values
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {{}}
		 */
		getElmValues: function( id ) {
			var self = this;
			if ( ! self.doesElmExist( id ) ) {
				return {};
			}
			// The convert attributes from string to object
			var shortcode = self.parseShortcode( self.getElmShortcode( id ) );
			if ( ! $.isEmptyObject( shortcode ) ) {
				var result = self.parseAtts( shortcode.atts ),
					elmName = self.getElmName( id );
				// Add content value to the result
				var editContent = self.config( 'shortcode.edit_content', {} );
				if ( !! editContent[ elmName ] ) {
					result[ editContent[ elmName ] ] = '' + shortcode.content;
				}
				return result;
			}
			return {};
		},

		/**
		 * Get shortcode param value by key name
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @param {String} key This is the name of the parameter
		 * @param {Mixed} defaultValue The default value
		 * @return {Mixed}
		 */
		getElmValue: function( id, key, defaultValue ) {
			return this.getElmValues( id )[ key ] || defaultValue;
		},

		/**
		 * Set shortcode's params values
		 *
		 * @param {String} id Shortcode's usbid, e.g. "us_btn:1"
		 * @param {{}} values
		 */
		setElmValues: function( id, values ) {
			var self = this;
			if ( ! self.doesElmExist( id ) || $.isEmptyObject( values ) ) {
				return;
			}

			// Get the shortcode object
			var shortcodeText = self.getElmShortcode( id ),
				shortcode = self.parseShortcode( shortcodeText );
			if ( $.isEmptyObject( shortcode ) ) {
				return;
			}

			// Set new attributes for the shortcode
			shortcode.atts = ' ' + self.buildAtts( $.extend( self.getElmValues( id ), values ) );

			// Apply content changes
			var newContent = ( self.pageData.content || '' )
				.replace(
					// The original shortcode text
					shortcodeText,
					// The converts a shortcode object to a shortcode string
					self.buildShortcode( shortcode )
				);
			self.pageData.content = newContent;
			// Send a signal to update element attributes
			self.trigger( 'contentChange' );
		},

		/**
		 * Send data to the server using a HTTP POST request
		 *
		 * @param {String} requestId This is a unique identifier for the request
		 * @param {{}} settings A set of key/value pairs that configure the Ajax request.
		 */
		ajax: function( requestId, settings ) {
			var self = this;
			if ( ! requestId || $.isEmptyObject( settings ) ) {
				return;
			}
			settings = $.extend(
				// Default settings
				{
					data: {}, // Data to be sent to the server
					abort: $.noop, // A function to be called if the request abort
					complete: $.noop, // A function to be called when the request finishes (after success and error callbacks are executed).
					error: $.noop, // A function that will be called if an error occurs in the request
					success: $.noop // A function to be called if the request succeeds
				},
				// Get settings
				settings || {}
			);
			// Abort prev request
			if ( ! $usbcore.isUndefined( self._$temp.xhr[ requestId ] ) ) {
				self._$temp.xhr[ requestId ].abort();
				if ( $.isFunction( settings.abort ) ) {
					settings.abort.call( self, requestId );
				}
			}
			/**
			 * @see https://api.jquery.com/jquery.ajax/
			 */
			self._$temp.xhr[ requestId ] = $.ajax({
				data: $.extend( {}, self.config( 'ajaxArgs', {} ), settings.data ),
				dataType: 'json',
				type: 'post',
				url: _window.ajaxurl,
				cache: false,
				/**
				 * Handler to be called if the request succeeds
				 * @see https://api.jquery.com/jquery.ajax/#jQuery-ajax-settings
				 *
				 * @param {{}} res
				 */
				success: function( res ) {
					delete self._$temp.xhr[ requestId ];
					// In case of an error on the backend, we will show notifications with the error text
					if ( ! res.success ) {
						self.notify( res.data.message, self._NOTIFY_TYPE.ERROR );
					}
					if ( $.isFunction( settings.success ) ) {
						settings.success.call( self, res );
					}
				},
				/**
				 * Handler to be called if the request fails.
				 * @see https://api.jquery.com/jquery.ajax/#jQuery-ajax-settings
				 */
				error: function( _, textStatus, errorThrown ) {
					if ( textStatus === 'abort' ) {
						return;
					}
					if ( $.isFunction( settings.error ) ) {
						settings.error.call( self, requestId );
					}
					// The showing request jqXHR errors
					self.notify( 'Ajax: ' + textStatus + ' ' + errorThrown, self._NOTIFY_TYPE.ERROR );
				},
				/**
				 * Handler to be called when the request finishes (after success and error callbacks are executed).
				 * @see https://api.jquery.com/jquery.ajax/#jQuery-ajax-settings
				 */
				complete: function( _, textStatus ) {
					if ( textStatus === 'abort' ) {
						return;
					}
					if ( $.isFunction( settings.complete ) ) {
						settings.complete.call( self, requestId, textStatus );
					}
				}
			});
		},

		/**
		 * Rendered shortcode
		 *
		 * @private
		 * @param {String} requestId The request id
		 * @param {{}} settings A set of key/value pairs that configure the Ajax request.
		 */
		_renderShortcode: function( requestId, settings ) {
			var self = this;
			if ( ! requestId || $.isEmptyObject( settings ) ) {
				return;
			}
			if ( ! $.isPlainObject( settings.data ) ) {
				settings.data = {};
			}
			// Add required settings
			$.extend( settings.data, {
				_nonce: self.config( '_nonce' ),
				action: self.config( 'action_render_shortcode' )
			} );
			// Content preparation
			if ( $usbcore.isUndefined( settings.data.content ) ) {
				settings.data.content = '';
			}
			settings.data.content += '';
			// Send a request to the server
			self.ajax( requestId, settings );
		},

		/**
		 * Controls the number of columns in a row
		 *
		 * @param {String} id Shortcode's usbid, e.g. "vc_row:1"
		 * @param {String} layout The layout
		 */
		_updateColumnsLayout: function( rowId, layout ) {
			// Exclusion of custom settings, since we do not change the rows, but only apply `--custom-columns`
			if ( 'custom' === layout ) {
				return;
			}
			var self = this,
				columns = self.getElmChildren( rowId ),
				columnsCount = columns.length,
				renderNeeded = false,
				columnType = self.isRow( rowId ) ? 'vc_column' : 'vc_column_inner',
				newColumnsWidths = [],
				newColumnsWidthsBase = 0,
				newColumnsWidthsTmp,
				newColumnsCount;

			// Making sure layout has the string type, so our checks will be performed right way
			layout = '' + layout;

			// Parsing layout value into columns array
			// Complex layout with all column widths specified
			if ( layout.indexOf( '-' ) > - 1 ) {
				newColumnsWidthsTmp = layout.split( '-' );
				newColumnsCount = newColumnsWidthsTmp.length;
				// Calculate columns width base
				for ( var i = 0; i < newColumnsCount; i ++ ) {
					newColumnsWidthsBase += $usbcore.parseInt( newColumnsWidthsTmp[ i ] );
				}
				// Calculate and assign columns widths
				for ( var i = 0; i < newColumnsCount; i ++ ) {
					var columnWidthBaseTmp = newColumnsWidthsBase / newColumnsWidthsTmp[ i ];
					// Try to transform width to a simple value (for example 2/4 will be transformed to 1/2)
					if ( columnWidthBaseTmp % 1 === 0 ) {
						newColumnsWidths.push( '1/' + columnWidthBaseTmp );
					} else {
						newColumnsWidths.push( newColumnsWidthsTmp[ i ] + '/' + newColumnsWidthsBase );
					}
				}
				// Simple layout with column number only
			} else {
				newColumnsCount = $usbcore.parseInt( layout );
				for ( var i = 0; i < newColumnsCount; i ++ ) {
					newColumnsWidths.push( '1/' + layout );
				}
			}

			// Adding new columns if needed
			if ( columnsCount < newColumnsCount ) {
				for ( var i = columnsCount; i < newColumnsCount; i ++ ) {
					var newColumnId = self.getSpareElmId( columnType );
					self._addShortcodeToContent( rowId, i, '[' + columnType + ' usbid="' + newColumnId + '"][/' + columnType + ']' );
				}
				columnsCount = newColumnsCount;
				// Wee need to render newly added columns
				renderNeeded = true;
				// Trying to remove extra columns if needed (only empty columns may be removed)
			} else if ( columnsCount > newColumnsCount ) {
				var columnsCountDifference = columnsCount - newColumnsCount;
				for ( var i = columnsCount - 1; ( i >= 0 ) && ( columnsCountDifference > 0 ); i -- ) {
					var columnChildren = self.getElmChildren( columns[ i ] );
					if ( columnChildren.length === 0 ) {
						self.removeElm( columns[ i ] );
						columnsCountDifference--;
					}
				}
				columnsCount = newColumnsCount + columnsCountDifference;
			}

			// Refreshing columns list
			columns = self.getElmChildren( rowId );

			// Send a signal to add new columns
			self.trigger( 'contentChange' );

			// Set new widths for columns
			for ( var i = 0; i < columnsCount; i ++ ) {
				self.setElmValues( columns[ i ], { width: newColumnsWidths[ i % newColumnsWidths.length ] } );
			}

			if ( renderNeeded ) {
				// Add temporary loader
				self.postMessage( 'showPreloader', rowId );

				// Render updated shortcode
				self._renderShortcode( /* request id */'_renderShortcode', {
					data: {
						content: self.getElmShortcode( rowId )
					},
					success: function( res ) {
						if ( res.success ) {
							self.postMessage( 'updateSelectedElm', [ rowId, '' + res.data.html ] );
						}
					}
				} );
			}
		},

		/**
		 * Get the insert position
		 *
		 * @private
		 * @param {String} parent Shortcode's usbid, e.g. "us_btn:1" or "container"
		 * @param {Number} index Position of the element inside the parent
		 * @return {{}} Object with new data
		 */
		getInsertPosition: function( parent, index ) {
			var position,
				self = this,
				isParentElmContainer = self.isElmContainer( parent );
			// Index check and position determination
			index = $usbcore.parseInt( index );
			// Positioning definitions within any containers
			if ( self.isMainContainer( parent ) || isParentElmContainer ) {
				var children = self.getElmChildren( parent );
				if ( index === 0 || children.length === 0 ) {
					position = 'prepend'
				} else if ( index > children.length || children.length === 1 ) {
					index = children.length;
					position = 'append';
				} else {
					parent = children[ index - 1 ] || parent;
					position = 'after';
				}
			} else {
				position = ( index < 1 ? 'before' : 'after' );
			}
			return {
				position: position,
				parent: parent
			}
		},

		/**
		 * Add shortcode to a given position
		 *
		 * @private
		 * @param {String} parent Shortcode's usbid, e.g. "us_btn:1"
		 * @param {Number} index Position of the element inside the parent
		 * @param {String} newShortcode The new shortcode
		 * @return {Boolean} True if successful, False otherwise
		 */
		_addShortcodeToContent: function( parent, index, newShortcode ) {
			var self = this;
			// Check the correctness of the data in the variables
			if (
				! newShortcode
				|| ! ( self.isValidId( parent ) || self.isMainContainer( parent ) )
			) {
				return false;
			}

			// Get the insert position
			var insertPosition = self.getInsertPosition( parent, index );
				parent = insertPosition.parent;
			// Get old data
			var insertShortcode = '',
				isMainContainer = self.isMainContainer( parent ),
				oldShortcode = ! isMainContainer
					? self.getElmShortcode( parent )
					: self.pageData.content || '',
				elmType = ! isMainContainer
					? self.getElmType( parent )
					: '';

			// Remove html from start and end
			oldShortcode = self.removeHtmlWrap( oldShortcode );

			// Check the position for the root element, if the position is before or after then add the element to the `prepend`
			var position = insertPosition.position;
			if ( isMainContainer ) {
				position = 'container:' + position;
				if ( [ 'before', 'after' ].indexOf( position ) !== -1 ) {
					position = 'container:prepend';
				}
			}

			// Create new shortcode
			switch ( position ) {
				case 'before':
				case 'container:prepend':
					insertShortcode = newShortcode + oldShortcode;
					break;
				case 'prepend':
					insertShortcode = oldShortcode
						.replace( new RegExp( '^(\\['+ elmType +'.*?[\\^\\]]+)' ), "$1" + newShortcode.replace( '$1', '&dollar;1' ) );
					break;
				case 'append':
					if ( self.parseShortcode( oldShortcode ).hasClosingTag ) {
						insertShortcode = oldShortcode
							.replace( new RegExp( '(\\[\\/'+ elmType +'\])$' ), newShortcode.replace( '$1', '&dollar;1' ) + "$1" )

					} else {
						insertShortcode = oldShortcode + newShortcode;
					}
					break;
				case 'after':
				case 'container:append':
				default:
					insertShortcode = oldShortcode + newShortcode;
			}

			// Update content variable
			self.pageData.content = ( '' + self.pageData.content ).replace( oldShortcode, insertShortcode );
			return true;
		},

		/**
		 * Add row wrapper for passed content
		 *
		 * @private
		 * @param {String} content The content
		 * @return {String}
		 */
		_addRowWrapper: function( content ) {
			var self = this;
			// Convert pattern to string from result
			return self.buildString(
				self.config( 'template.vc_row', '' ),
				// The values for variables `{%var_name%}`
				{
					vc_row: self.getSpareElmId( 'vc_row' ),
					vc_column: self.getSpareElmId( 'vc_column' ),
					content: ''+content
				}
			);
		},

		/**
		 * Get the default content
		 * Note: Getting content by default has been moved to a separate method to unload and simplify methods
		 *
		 * @private
		 * @param {String} elmType The elm type
		 * @return {String} The default content
		 */
		_getDefaultContent: function( elmType ) {
			var self = this,
				// Child type, if any for the current `elmType`
				child,
				// Get settings for shortcodes
				shortcodeSettings = self.config( 'shortcode', {} ),
				/**
				 * Get the default content
				 *
				 * @private
				 * @param {String} type The type
				 * @return {String} The default content
				 */
				_getDefaultContent = function( type ) {
					var defaultValues = ( shortcodeSettings.default_values || {} )[ type ] || false,
						editContent = ( shortcodeSettings.edit_content || {} )[ type ] || false;
					if ( editContent && defaultValues && defaultValues[ editContent ] ) {
						return defaultValues[ editContent ];
					}
					return '';
				};
			// Determine the descendant if any
			var asChild = $.extend( {}, shortcodeSettings.relations.as_child || {} );
			for ( var k in asChild ) {
				if ( ( ( asChild[ k ][ 'only' ] || '' ).split( ',' ) ).indexOf( elmType ) > -1 ) {
					child = k;
					break;
				}
			}
			if ( ! child ) {
				return _getDefaultContent( elmType );
			}

			// Adding elements for tab structures
			if ( child === 'vc_tta_section' ) {

				// Get a title template for a section
				var titleTemplate = self.getTextTranslation( 'section' ),

				// Get parameters for a template
				params = {
					title_1: ( titleTemplate + ' 1' ),
					title_2: ( titleTemplate + ' 2' ),
					vc_column_text: self.getSpareElmId( 'vc_column_text' ),
					vc_column_text_content: _getDefaultContent( 'vc_column_text' ),
					vc_tta_section_1: self.getSpareElmId( /* vc_tta_section */child ),
					vc_tta_section_2: self.getSpareElmId( /* vc_tta_section */child )
				};
				// Build shortcode
				return self.buildString( self.config( 'template.' + /* vc_tta_section */child, '' ), params );

				// Adding an empty element with no content
			} else {
				return '['+ child +' usbid="'+ self.getSpareElmId( child ) +'"][/'+ child +']';
			}
		},

		/**
		 * Create the element
		 *
		 * @param {String} type The element type
		 * @param {String} parent The parent id
		 * @param {Number} index Position of the element inside the parent
		 * @param {{}} values The element values
		 * @param {Function} callback The callback
		 * @return {Mixed}
		 */
		createElm: function( type, parent, index, values, callback ) {
			var self = this,
				args = arguments,
				isMainContainer = self.isMainContainer( parent );
			if (
				! type
				|| ! parent
				|| ! ( self.isValidId( parent ) || isMainContainer )
			) {
				self._debugLog( 'Error: Invalid params', args );
				return;
			}

			// Check parents and prohibit investing in yourself
			if ( self.hasSameTypeParent( type, parent ) ) {
				self._debugLog( 'Error: It is forbidden to add descendants of itself', args );
				return;
			}

			// The hide all highlights
			self.postMessage( 'doAction', 'hideHighlight' );

			// Index check and position determination
			index = $usbcore.parseInt( index );

			// If there is no parent element, add the element to the `container`
			if ( ! isMainContainer && ! self.doesElmExist( parent ) ) {
				parent = self.mainContainer;
				index = 0;
			}

			var elmId = self.getSpareElmId( type ),
				// Get name from ID
				elmName = self.getElmName( elmId ),
				// Get insert position
				insert = self.getInsertPosition( parent, index );

			// Validating Values
			if ( ! values || $.isEmptyObject( values ) ) {
				values = {};
				// Fix for group default values
				var defaultValues = self.config( 'shortcode.default_values.' + elmName, false );
				if ( defaultValues ) {
					for ( var _attr in defaultValues ) {
						if ( defaultValues.hasOwnProperty( _attr ) && _attr !== 'content' ) {
							values[ _attr ] = defaultValues[ _attr ];
						}
					}
				}
			}

			var // Create shortcode string
				buildShortcode = self.buildShortcode({
					tag: type,
					atts: self.buildAtts( $.extend( { usbid: elmId }, values ) ),
					content: self._getDefaultContent( elmName ),
					hasClosingTag: ( self.isElmContainer( elmName ) || !! self.config( 'shortcode.edit_content.' + elmName ) )
				} );

			// The check if the element is not the root container and is added to the main container,
			// then adding a wrapper `vc_row`. It is forbidden to add elements without a line to the root container!
			if (
				self.isMainContainer( parent )
				&& ! self.isRow( elmId )
			) {
				buildShortcode = self._addRowWrapper( buildShortcode );
			}

			// Added shortcode to content
			if ( ! self._addShortcodeToContent( parent, index, buildShortcode ) ) {
				return false;
			}

			// Get html shortcode code and set on preview page
			self.postMessage( 'showPreloader', [
				insert.parent,
				insert.position,
				// If these values are true, then a container class will be added for customization
				/* isContainer */self.isElmContainer( type )
			] );
			// Get a rendered shortcode
			self._renderShortcode( /* request id */'_renderShortcode', {
				data: {
					content: buildShortcode
				},
				success: function( res ) {
					self.postMessage( 'hidePreloader', insert.parent );
					if ( res.success ) {
						// Add new shortcde to preview page
						self.postMessage( 'insertElm', [ insert.parent, insert.position, ''+res.data.html ] );
						// Init its JS if needed
						self.postMessage( 'maybeInitElmJS', [ elmId ] );
						// Initialize editing a new element
						self.trigger( 'elmSelected', elmId );
						// Send a signal to create a new element
						self.trigger( 'contentChange' );

						// Commit to save changes to history
						self.commitChangeToHistory( elmId, self._CHANGED_ACTION.CREATE );
					}
					if ( $.isFunction( callback ) ) {
						// This callback function from method arguments which will be called
						// after adding the new element
						callback.call( self, elmId );
					}
				}
			} );

			return elmId;
		},

		/**
		 * Move the element to a new position
		 *
		 * @param {String} moveId ID of the element that is being moved, e.g. "us_btn:1"
		 * @param {String} newParent ID of the element's new parent element
		 * @param {Number} newIndex Position of the element inside the new parent
		 * @return {Boolean}
		 */
		moveElm: function( moveId, newParent, newIndex ) {
			var self = this,
				args = arguments;
			if ( self.isMainContainer( moveId ) ) {
				self._debugLog( 'Error: Cannot move container', args );
				return false;
			}
			var isMainContainer = self.isMainContainer( newParent );

			// Check parents and prohibit investing in yourself
			if ( self.hasSameTypeParent( moveId, newParent ) ) {
				self._debugLog( 'Error: It is forbidden to add descendants of itself', args );
				return;
			}

			// Checking the correctness of ids
			if (
				! self.isValidId( moveId )
				|| ! ( self.isValidId( newParent ) || isMainContainer )
			) {
				self._debugLog( 'Error: Invalid id specified', args );
				return false;
			}
			if (
				! self.doesElmExist( moveId )
				|| ! ( self.doesElmExist( newParent ) || isMainContainer )
			) {
				self._debugLog( 'Error: Element doesn\'t exist', args );
				return false;
			}

			// Index check and position determination
			newIndex = $usbcore.parseInt( newIndex );

			// The hide all highlights
			self.postMessage( 'doAction', 'hideHighlight' );

			// If there is no newParent element, add the element to the `container`
			if ( ! isMainContainer && ! self.doesElmExist( newParent ) ) {
				newParent = self.mainContainer;
				newIndex = 0;
			}

			// Commit to save changes to history
			self.commitChangeToHistory( moveId, self._CHANGED_ACTION.MOVE );

			// Get old shortcode and remove in content
			var oldShortcode = self.getElmShortcode( moveId );
			self.pageData.content = ( '' + self.pageData.content )
				.replace( oldShortcode, '' );

			// Get parent position
			var insert = self.getInsertPosition( newParent, newIndex );

			// Added shortcode to content
			if ( ! self._addShortcodeToContent( newParent, newIndex, oldShortcode ) ) {
				return false;
			}

			// Move element on preview page
			self.postMessage( 'moveElm', [ insert.parent, insert.position, moveId ] );

			// Send a signal to move element
			self.trigger( 'contentChange' );

			return true;
		},

		/**
		 * Remove the element
		 *
		 * @param {String} removeId ID of the element that is being removed, e.g. "us_btn:1"
		 * @return {Boolean}
		 */
		removeElm: function( removeId ) {
			var self = this;
			if ( ! self.isValidId( removeId ) ) {
				return false;
			}
			// Remove element from preview
			self.postMessage( 'removeHtmlById', removeId );
			var selectedElmId = self.selectedElmId,
				allChildren = self.getElmAllChildren( removeId ),
				rootContainerId;
			// Get the root container to send the change event
			if ( self.isColumn( removeId ) ) {
				rootContainerId = self.getElmParentId( removeId );
			}

			// Commit to save changes to history
			self.commitChangeToHistory( removeId, self._CHANGED_ACTION.REMOVE );

			// Removing shortcode from content
			self.pageData.content = ( '' + self.pageData.content )
				.replace( self.getElmShortcode( removeId ), '' );
			// Send a signal to remove element
			self.trigger( 'contentChange' );
			if ( rootContainerId ) {
				// The private handler is called every time the column/column_inner in change
				self._vcColumnChange( rootContainerId );
			}

			if (
				selectedElmId
				&& (
					removeId == selectedElmId
					|| allChildren.indexOf( selectedElmId ) > -1
				)
			) {
				self.showPanelAddElms(); // Show the section "Add elements"
			}

			return true;
		}
	} );

	$( function() {
		_window.$usb = new USBuilder( /* main container */'#us-builder-wrapper' );
	} );
}( window.jQuery );
