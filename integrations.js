
/**
 * Module dependencies.
 */

var each = require('each');
var plugins = require('./plugins.js');

/**
 * Expose the integrations, using their own `name` from their `prototype`.
 */

each(plugins, function(plugin){
    var name = (plugin.Integration || plugin).prototype.name;
    exports[name] = plugin;
});
