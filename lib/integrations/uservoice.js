
var alias = require('alias')
  , callback = require('callback')
  , clone = require('clone')
  , convertDates = require('convert-dates')
  , integration = require('../integration')
  , load = require('load-script')
  , unix = require('to-unix-timestamp');


/**
 * Expose `UserVoice` integration.
 */

var UserVoice = module.exports = integration('UserVoice');


/**
 * Required key.
 */

UserVoice.prototype.key = 'apiKey';


/**
 * Default options.
 */

UserVoice.prototype.defaults = {
  // whether you are using the classic uservoice widget or not
  classic: false,
  // your uservoice api key (or "widget id") (required)
  apiKey: '',
  // your uservoice forum id
  forumId: null,
  // whether to show the uservoice widget on load
  showWidget: true,
  // the mode for the widget
  mode: 'contact',
  // the widget's accent color
  accentColor: '#448dd6',
  // a custom uservoice trigger for the widget
  trigger: null,
  // the widget trigger's position
  triggerPosition: 'bottom-right',
  // the widget trigger's question mark color
  triggerColor: '#ffffff',
  // the widget trigger's background color
  triggerBackgroundColor: 'rgba(46, 49, 51, 0.6)',
  // BACKWARDS COMPATIBILITY: classic options
  primaryColor: '#cc6d00',
  linkColor: '#007dbf',
  defaultMode: 'support',
  tabLabel: 'Feedback & Support',
  tabColor: '#cc6d00',
  tabPosition: 'middle-right',
  tabInverted: false
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

UserVoice.prototype.initialize = function (options, ready) {
  if (options.classic) {
    this.identify = this.identifyClassic;
    delete this.group;
    return this.initializeClassic(options, ready);
  }

  window.UserVoice || (window.UserVoice = []);
  var opts = formatOptions(options);
  push('set', opts);
  if (options.showWidget) push('addTrigger', options.trigger, opts);
  push('autoprompt', {});

  callback.async(ready);
  load('//widget.uservoice.com/' + options.apiKey + '.js');
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

UserVoice.prototype.initializeClassic = function (options, ready) {
  window.UserVoice || (window.UserVoice = []);
  window.showClassicWidget = showClassicWidget; // part of public api
  if (options.showWidget) showClassicWidget('showTab', formatClassicOptions(options));
  callback.async(ready);
  load('//widget.uservoice.com/' + options.apiKey + '.js');
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