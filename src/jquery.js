/*global Motio */
(function ($) {
	'use strict';

	// Names
	var pluginName = 'motio';
	var namespace  = pluginName;

	// jQuery plugin
	$.fn[pluginName] = function (options, callbackMap) {
		var method, methodArgs;

		// Attributes logic
		if (!$.isPlainObject(options)) {
			if (typeof options === 'string' || options === false) {
				method = options === false ? 'destroy' : options;
				methodArgs = Array.prototype.slice.call(arguments, 1);
			}
			options = {};
		}

		// Apply plugin to all elements
		return this.each(function (i, element) {
			// Plugin call with prevention against multiple instantiations
			var plugin = $.data(element, namespace);

			if (!plugin && !method) {
				// Create a new plugin object if it doesn't exist yet
				plugin = $.data(element, namespace, new Motio(element, options));
				// Bind callbacks
				plugin.on(callbackMap);
				// Start playing when requested
				if (!options.startPaused) {
					plugin.play();
				}
			} else if (plugin && method) {
				// Call plugin method
				if (plugin[method]) {
					plugin[method].apply(plugin, methodArgs);
				}
				// Remove plugin from element data on destroy
				if (method === 'destroy') {
					$.removeData(element, namespace);
				}
			}
		});
	};
}(jQuery));