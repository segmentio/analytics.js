
var date = require('load-date');
var domify = require('domify');
var each = require('each');
var integration = require('integration');
var useHttps = require('use-https');
var load = require('load-script');
var onBody = require('on-body');


/**
 * Expose `ClickTale`.
 */

var ClickTale = module.exports = integration('ClickTale')
  .assumesPageview()
  .readyOnLoad()
  .global('WRInitTime')
  .global('ClickTaleSetUID')
  .global('ClickTaleField')
  .global('ClickTaleEvent')
  .option('httpCdnUrl', 'http://s.clicktale.net/WRe0.js')
  .option('httpsCdnUrl', '')
  .option('projectId', '')
  .option('recordingRatio', 0.01)
  .option('partitionId', '');


/**
 * Initialize.
 *
 * http://wiki.clicktale.com/Article/JavaScript_API
 *
 * @param {Object} page
 */

ClickTale.prototype.initialize = function (page) {
  var options = this.options;
  window.WRInitTime = date.getTime();

  onBody(function (body) {
    body.appendChild(domify('<div id="ClickTaleDiv" style="display: none;">'));
  });

  this.load(function () {
    window.ClickTale(options.projectId, options.recordingRatio, options.partitionId);
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
  if (useHttps() && !https) return this.debug('https option required');
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