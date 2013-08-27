
var inherit = require('inherit')
  , Provider = require('./provider');


/**
 * Expose `createIntegration`.
 */

module.exports = createIntegration;


/**
 * Create a new Integration constructor.
 *
 * TODO: make this not inherit but actually create
 */

function createIntegration (name) {

  function Integration () {
    Provider.apply(this, arguments);
  }

  inherit(Integration, Provider);
  Integration.prototype.name = name;
  return Integration;
}