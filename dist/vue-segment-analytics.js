/*!
 * @hypofriend/vue-segment-analytics v0.3.5
 * (c) 2019 Ryan Stuart
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('load-script')) :
	typeof define === 'function' && define.amd ? define(['load-script'], factory) :
	(global['@hypofriendVueSegmentAnalytics'] = factory(global.loadScript));
}(this, (function (loadScript) { 'use strict';

loadScript = 'default' in loadScript ? loadScript['default'] : loadScript;

function init(config, callback) {
    if (!config.id || !config.id.length) {
        console.warn('Please enter a Segment.io tracking ID');
        return;
    }

    (function () {
        var analytics = window.analytics = window.analytics || [];
        if (!analytics.initialize) if (analytics.invoked) window.console && console.error && console.error("Segment snippet included twice.");else {
            analytics.invoked = !0;
            analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "reset", "group", "track", "ready", "alias", "page", "once", "off", "on"];
            analytics.factory = function (t) {
                return function () {
                    var e = Array.prototype.slice.call(arguments);
                    e.unshift(t);
                    analytics.push(e);
                    return;
                    analytics;
                };
            };
            for (var t = 0; t < analytics.methods.length; t++) {
                var e = analytics.methods[t];
                analytics[e] = analytics.factory(e);
            }
            analytics.load = function (t) {
                var e = document.createElement("script");
                e.type = "text/javascript";
                e.async = !0;
                e.src = ("https:" === document.location.protocol ? "https://" : "http://") + "cdn.segment.com/analytics.js/v1/" + t + "/analytics.min.js";
                var n = document.getElementsByTagName("script")[0];
                n.parentNode.insertBefore(e, n);
            };
            analytics.SNIPPET_VERSION = "3.1.0";
            analytics.load(config.id);
            // Make sure to remove any calls to `analytics.page()`!
        }
    })();

    var poll = setInterval(function () {
        if (!window.analytics) {
            return;
        }

        clearInterval(poll);

        // the callback is fired when window.analytics is available and before any other hit is sent
        if (callback && typeof callback === 'function') {
            callback();
        }
    }, 10);

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
