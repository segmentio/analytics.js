
var integration = require('../integration')
  , alias = require('alias')
  , clone = require('clone')
  , load = require('load-script');


/**
 * Expose a `trak.io` provider.
 *
 * https://docs.trak.io
 */

var Trakio = module.exports = integration('trak.io');


/**
 * Required key.
 */

Trakio.prototype.key = 'token';


/**
 * Default options.
 */

Trakio.prototype.defaults = {
  // whether to track an initial pageview
  initialPageview : true,
  // whether to track pageviews
  pageview : true,
  // the token for your trak.io account (required)
  token : ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Trakio.prototype.initialize = function (options, ready) {
  window.trak = window.trak || [];
  window.trak.io = window.trak.io || {};
  window.trak.io.load = function(e) {
    load('//d29p64779x43zo.cloudfront.net/v1/trak.io.min.js');
    var r = function(e) {
      return function() {
        window.trak.push([e].concat(Array.prototype.slice.call(arguments,0)));
      };
    }
    ,i=["initialize","identify","track","alias","channel","source","host","protocol","page_view"];
    for (var s=0;s<i.length;s++) window.trak.io[i[s]]=r(i[s]);
    window.trak.io.initialize.apply(window.trak.io,arguments);
  };

  var cloned = clone(options);
  alias(cloned, {
    initialPageview: 'auto_track_page_view'
  });

  window.trak.io.load(options.token, cloned);
  ready();
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Trakio.prototype.identify = function (id, traits, options) {
  // trak.io names keys differently: http://docs.trak.io/properties.html#special
  alias(traits, {
    avatar: 'avatar_url',
    firstName: 'first_name',
    lastName: 'last_name'
  });

  if (id) {
    window.trak.io.identify(id, traits);
  } else {
    window.trak.io.identify(traits);
  }
};


/**
 * Group.
 *
 * @param {String} id (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 *
 * TODO: add group
 * TODO: add `trait.company/organization` from trak.io docs http://docs.trak.io/properties.html#special
 */


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Trakio.prototype.track = function (event, properties, options) {
  window.trak.io.track(event, properties);
};


/**
 * Pageview.
 *
 * @param {String} url (optional)
 */

Trakio.prototype.pageview = function (url) {
  if (!this.options.pageview) return;
  window.trak.io.page_view(url);
};


/**
 * Alias.
 *
 * @param {String} newId
 * @param {String} originalId (optional)
 */

Trakio.prototype.alias = function (newId, originalId) {
  var id = window.trak.io.distinct_id();
  if (id === newId) return;
  if (originalId) {
    window.trak.io.alias(originalId, newId);
  } else {
    window.trak.io.alias(newId);
  }
};