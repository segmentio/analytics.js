
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Metrica` integration.
 *
 * http://api.yandex.com/metrika/
 * https://metrica.yandex.com/22522351?step=2#tab=code
 */

var Metrica = module.exports = integration('Yandex Metrica');


/**
 * Required key.
 */

Metrica.prototype.key = 'counterId';


/**
 * Default options.
 */

Metrica.prototype.defaults = {
  // your yandex metrica counter id (required)
  counterId: null
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Metrica.prototype.initialize = function (options, ready) {
  push(function () {
    var id = options.counterId;
    window['yaCounter' + id] = new window.Ya.Metrika({ id: id });
  });

  ready();
  load('//mc.yandex.ru/metrika/watch.js');
};


/**
 * Push a new callback on the global Metrica queue.
 *
 * @param {Function} callback
 */

function push (callback) {
  window.yandex_metrika_callbacks || (window.yandex_metrika_callbacks = []);
  window.yandex_metrika_callbacks.push(callback);
}