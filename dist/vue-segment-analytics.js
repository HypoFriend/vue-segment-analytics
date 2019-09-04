/*!
 * @hypofriend/vue-segment-analytics v0.3.7
 * (c) 2019 Ryan Stuart
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['@hypofriendVueSegmentAnalytics'] = factory());
}(this, (function () { 'use strict';

function init(config, callback) {
  if (!config.id || !config.id.length) {
    console.warn('Please enter a Segment.io tracking ID');
    return;
  }

  (function () {

    // Create a queue, but don't obliterate an existing one!
    var analytics = window.analytics = window.analytics || [];

    // Invoked flag, to make sure the snippet
    // is never invoked twice.

    // A list of the methods in Analytics.js to stub.
    analytics.methods = ['trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview', 'identify', 'reset', 'group', 'track', 'ready', 'alias', 'debug', 'page', 'once', 'off', 'on'];

    // Define a factory to create stubs. These are placeholders
    // for methods in Analytics.js so that you never have to wait
    // for it to load to actually record data. The `method` is
    // stored as the first argument, so we can replay the data.
    analytics.factory = function (method) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(method);
        analytics.push(args);
        return analytics;
      };
    };

    // For each of our methods, generate a queueing stub.
    for (var i = 0; i < analytics.methods.length; i++) {
      var key = analytics.methods[i];
      analytics[key] = analytics.factory(key);
    }
  })();

  return window.analytics;
}

/**
 * Vue installer
 * @param  {Vue instance} Vue
 * @param  {Object} [options={}]
 */
function install(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var config = Object.assign({
    debug: false,
    pageCategory: ''
  }, options);

  var analytics = init(config, function () {});

  // Page tracking
  if (config.router !== undefined) {
    config.router.afterEach(function (to, from) {
      // Make a page call for each navigation event
      analytics.page(config.pageCategory, to.name || '', {
        path: to.fullPath,
        referrer: from.fullPath
      });
    });
  }

  // Setup instance access
  Object.defineProperty(Vue, '$segment', {
    get: function get() {
      return window.analytics;
    }
  });
  Object.defineProperty(Vue.prototype, '$segment', {
    get: function get() {
      return window.analytics;
    }
  });
}

var index = { install: install };

return index;

})));
