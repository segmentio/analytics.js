
var alias = require('alias');
var callback = require('callback');
var clone = require('clone');
var convertDates = require('convert-dates');
var integration = require('../integration');
var load = require('load-script');
var unix = require('to-unix-timestamp');


/**
 * Expose `UserVoice`.
 */

var UserVoice = module.exports = integration('UserVoice')
  .option('apiKey', '')
  .option('classic', false)
  .option('forumId', null)
  .option('showWidget', true)
  .option('mode', 'contact')
  .option('accentColor', '#448dd6')
  .option('trigger', null)
  .option('triggerPosition', 'bottom-right')
  .option('triggerColor', '#ffffff')
  .option('triggerBackgroundColor', 'rgba(46, 49, 51, 0.6)')
  // BACKWARDS COMPATIBILITY: classic options
  .option('classicMode', 'full')
  .option('primaryColor', '#cc6d00')
  .option('linkColor', '#007dbf')
  .option('defaultMode', 'support')
  .option('tabLabel', 'Feedback & Support')
  .option('tabColor', '#cc6d00')
  .option('tabPosition', 'middle-right')
  .option('tabInverted', false);


/**
 * Initialize.
 */

UserVoice.prototype.initialize = function () {
  var options = this.options;

  if (options.classic) {
    this.identify = this.identifyClassic;
    delete this.group;
    return this.initializeClassic();
  }

  window.UserVoice || (window.UserVoice = []);
  var opts = formatOptions(options);
  push('set', opts);
  push('autoprompt', {});
  if (options.showWidget) {
    options.trigger
      ? push('addTrigger', options.trigger, opts)
      : push('addTrigger', opts);
  }

  callback.async(this.ready);
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

UserVoice.prototype.load = function (callback) {
  var key = this.options.apiKey;
  load('//widget.uservoice.com/' + key + '.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

UserVoice.prototype.identify = function (id, traits, options) {
  if (id) traits.id = id;
  convertDates(traits, unix);
  alias(traits, { created: 'created_at' });
  push('identify', traits);
};


/**
 * Group.
 *
 * @param {String} id (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

UserVoice.prototype.group = function (id, properties, options) {
  if (id) properties.id = id;
  convertDates(properties, unix);
  alias(properties, { created: 'created_at' });
  push('identify', { account: properties });
};


/**
 * Initialize (classic).
 *
 * @param {Object} options
 * @param {Function} ready
 */

UserVoice.prototype.initializeClassic = function () {
  var options = this.options;
  window.UserVoice = window.UserVoice || [];
  window.showClassicWidget = showClassicWidget; // part of public api
  if (options.showWidget) showClassicWidget('showTab', formatClassicOptions(options));
  callback.async(this.ready);
  this.load();
};


/**
 * Identify (classic).
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

UserVoice.prototype.identifyClassic = function (id, traits, options) {
  if (id) traits.id = id;
  push('setCustomFields', traits);
};


/**
 * Push a UserVoice call onto their queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window.UserVoice.push(args);
}


/**
 * Format the options for UserVoice.
 *
 * @param {Object} options
 * @return {Object}
 */

function formatOptions (options) {
  var cloned = clone(options);
  alias(cloned, {
    forumId: 'forum_id',
    accentColor: 'accent_color',
    triggerColor: 'trigger_color',
    triggerBackgroundColor: 'trigger_background_color',
    triggerPosition: 'trigger_position'
  });
  return cloned;
}


/**
 * Format the classic options for UserVoice.
 *
 * @param {Object} options
 * @return {Object}
 */

function formatClassicOptions (options) {
  var cloned = clone(options);
  alias(cloned, {
    forumId: 'forum_id',
    classicMode: 'mode',
    primaryColor: 'primary_color',
    tabPosition: 'tab_position',
    tabColor: 'tab_color',
    linkColor: 'link_color',
    defaultMode: 'default_mode',
    tabLabel: 'tab_label',
    tabInverted: 'tab_inverted'
  });
  return cloned;
}


/**
 * Show the classic version of the UserVoice widget. This method is usually part
 * of UserVoice classic's public API.
 *
 * @param {String} type ('showTab' or 'showLightbox')
 * @param {Object} options (optional)
 */

function showClassicWidget (type, options) {
  type || (type = 'showLightbox');
  push(type, 'classic_widget', options);
}