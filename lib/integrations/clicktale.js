
var date = require('load-date');
var domify = require('domify');
var each = require('each');
var integration = require('../integration');
var load = require('load-script');
var onBody = require('on-body');


/**
 * Expose `ClickTale` integration.
 *
 * http://wiki.clicktale.com/Article/JavaScript_API
 */

var ClickTale = module.exports = integration('ClickTale')
  .option('httpCdnUrl', 'http,//s.clicktale.net/WRe0.js')
  .option('httpsCdnUrl', '')
  .option('projectId', '')
  .option('recordingRatio', 0.01)
  .option('partitionId', '');


/**
 * Initialize.
 */

ClickTale.prototype.initialize = function () {
  var options = this.options;
  window.WRInitTime = date.getTime();

  // if we're on HTTPS but don't have a secure library, return early
  if (document.location.protocol === 'https:' && !options.httpsCdnUrl) {
    return this.debug('https option required');
  }

  // add the required div to the body
  onBody(function (body) {
    body.appendChild(domify('<div id="ClickTaleDiv" style="display: none;">'));
  });

  var self = this;
  this.load(function () {
    window.ClickTale(options.projectId, options.recordingRatio, options.partitionId);
    self.ready();
  });
};


/**
 * Load the ClickTale library.
 *
 * @param {Function} callback
 */

ClickTale.prototype.load = function (callback) {
  var http = this.options.httpCdnUrl;
  var https = this.options.httpsCdnUrl;
  load({ http: http, https: https }, callback);
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