
var date = require('load-date')
  , each = require('each')
  , integration = require('../integration')
  , load = require('load-script')
  , onBody = require('on-body');


/**
 * Expose `ClickTale` integration.
 *
 * http://wiki.clicktale.com/Article/JavaScript_API
 */

var ClickTale = module.exports = integration('ClickTale');


/**
 * Required key.
 */

ClickTale.prototype.key = 'projectId';


/**
 * Default options.
 */

ClickTale.prototype.defaults = {
  // the HTTP version of your clicktale CDN url
  httpCdnUrl: 'http://s.clicktale.net/WRe0.js',
  // the HTTPS version of your clicktale CDN url (premium accounts only)
  httpsCdnUrl: '',
  // your clicktale project id (required)
  projectId: '',
  // the ratio of users to record
  recordingRatio: 0.01,
  // your clicktale partition id
  // http://wiki.clicktale.com/Article/JavaScript_API
  partitionId: ''
};

ClickTale.prototype.initialize = function (options, ready) {
  // if we're on HTTPS but don't have a secure library, return early
  if (document.location.protocol === 'https:' && !options.httpsCdnUrl) return;

  window.WRInitTime = date.getTime();

  // add the required clicktale div to the body
  onBody(function (body) {
    var div = document.createElement('div');
    div.setAttribute('id', 'ClickTaleDiv');
    div.setAttribute('style', 'display: none;');
    body.appendChild(div);
  });

  load({
    http: options.httpCdnUrl,
    https: options.httpsCdnUrl
  }, function () {
    window.ClickTale(options.projectId, options.recordingRatio, options.partitionId);
    ready();
  });
};


/**
 * Identify.
 *
 * http://wiki.clicktale.com/Article/ClickTaleTag#ClickTaleSetUID
 * http://wiki.clicktale.com/Article/ClickTaleTag#ClickTaleField
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

ClickTale.prototype.identify = function (id, traits, options) {
  window.ClickTaleSetUID(id);
  each(traits, function (key, value) {
    window.ClickTaleField(key, value);
  });
};


/**
 * Track.
 *
 * http://wiki.clicktale.com/Article/ClickTaleTag#ClickTaleEvent
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

ClickTale.prototype.track = function (event, properties, options) {
  window.ClickTaleEvent(event);
};