
var alias = require('alias')
  , clone = require('clone')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose a `Lytics` integration.
 *
 * http://admin.lytics.io/doc#jstag
 */

var Lytics = module.exports = integration('Lytics');


/**
 * Required key.
 */

Lytics.prototype.key = 'cid';


/**
 * Default options.
 */

Lytics.prototype.defaults = {
  // accound identified (required)
  cid: '',
  // what to name the lytics cookie
  cookie: 'seerid',
  // how long to wait for collector requests
  delay: 200,
  // whether to track an initial page view on load
  initialPageview: true,
  // duration in milliseconds after a session should be considered inactive
  sessionTimeout: 1800,
  // collector url
  url: '//c.lytics.io'
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Lytics.prototype.initialize = function (options, ready) {
  var cloned = clone(options);
  alias(cloned, {
    sessionTimeout: 'sessecs'
  });

  window.jstag = (function () {
    var t = {
      _q: [],
      _c: cloned,
      ts: (new Date()).getTime()
    };
    t.send = function() {
      this._q.push([ 'ready', 'send', Array.prototype.slice.call(arguments) ]);
      return this;
    };
    return t;
  })();

  load('//c.lytics.io/static/io.min.js');
  if (options.initialPageview)  this.pageview();
  ready();
};


/**
 * Idenfity.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Lytics.prototype.identify = function (id, traits, options) {
  if (id) traits._uid = id;
  window.jstag.send(traits);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Lytics.prototype.track = function (event, properties) {
  properties._e = event;
  window.jstag.send(properties);
};


/**
 * Pageview.
 *
 * @param {String} url (optional)
 */

Lytics.prototype.pageview = function (url) {
  window.jstag.send();
};