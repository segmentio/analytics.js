// Sentry
// ------
// http://raven-js.readthedocs.org/en/latest/config/index.html

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  key : 'config',

  options : {
    config : null
  },


  initialize : function (options, ready) {
    load('//d3nslu0hdya83q.cloudfront.net/dist/1.0/raven.min.js', function () {
      // For now, Raven basically requires `install` to be called.
      // https://github.com/getsentry/raven-js/blob/master/src/raven.js#L87
      window.Raven.config(options.config).install();
      ready();
    });
  },


  identify : function (userId, traits) {
    traits || (traits = {});
    if (userId) traits.id = userId;
    window.Raven.setUser(traits);
  }

});