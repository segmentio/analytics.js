
var callback = require('callback');
var integration = require('integration');
var load = require('load-script');


/**
 * Expose `Metrica`.
 */

var Metrica = module.exports = integration('Yandex Metrica')
  .global('yandex_metrika_callbacks')
  .global('Ya')
  .assumesPageview()
  .readyOnInitialize()
  .option('counterId', null);


/**
 * Initialize.
 *
 * http://api.yandex.com/metrika/
 * https://metrica.yandex.com/22522351?step=2#tab=code
 */

Metrica.prototype.initialize = function () {
  var id = this.options.counterId;

  push(function () {
    window['yaCounter' + id] = new window.Ya.Metrika({ id: id });
  });

  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Metrica.prototype.load = function (callback) {
  load('//mc.yandex.ru/metrika/watch.js', callback);
};


/**
 * Push a new callback on the global Metrica queue.
 *
 * @param {Function} callback
 */

function push (callback) {
  window.yandex_metrika_callbacks = window.yandex_metrika_callbacks || [];
  window.yandex_metrika_callbacks.push(callback);
}