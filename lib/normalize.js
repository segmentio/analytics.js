
/**
 * Module Dependencies.
 */

var indexof = require('component/indexof');
var defaults = require('defaults');
var map = require('component/map');
var each = require('each');
var is = require('is');

/**
 * Expose `normalize`
 */

module.exports = normalize;

/**
 * Toplevel properties.
 */

var toplevel = [
  'integrations',
  'anonymousId',
  'properties',
  'previousId',
  'timestamp',
  'category',
  'context',
  'groupId',
  'userId',
  'traits',
  'event',
  'name'
];

/**
 * Normalize `msg` based on integrations `list`.
 *
 * @param {Object} msg
 * @param {Array} list
 * @return {Function}
 */

function normalize(msg, list){
  var lower = map(list, function(s){ return s.toLowerCase(); });
  var opts = msg.options || {};
  var integrations = opts.integrations || {};
  var providers = opts.providers || {};
  var context = opts.context || {};
  var ret = {};

  // integrations.
  each(opts, function(key, value){
    if (!integration(key)) return;
    integrations[key] = value;
    delete opts[key];
  });

  // providers.
  delete opts.providers;
  each(providers, function(key, value){
    if (!integration(key)) return;
    if (is.object(integrations[key])) return;
    integrations[key] = providers[key];
  });

  // move all toplevel options to msg
  // and the rest to context.
  each(opts, function(key){
    if (~indexof(toplevel, key)) {
      ret[key] = opts[key];
    } else {
      context[key] = opts[key];
    }
  });

  // cleanup
  delete msg.options;
  ret.integrations = integrations;
  ret.context = context;

  return defaults(ret, msg);

  function integration(name){
    return !! (~indexof(list, name)
      || 'all' == name.toLowerCase()
      || ~indexof(lower, name.toLowerCase()));
  }
}