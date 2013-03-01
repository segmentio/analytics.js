// Clicky
// ------
// [Documentation](http://clicky.com/help/customization/manual?new-domain).

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({

  key : 'siteId',

  options : {
    siteId : null
  },


  initialize : function (options, ready) {
    window.clicky_site_ids = window.clicky_site_ids || [];
    window.clicky_site_ids.push(options.siteId);
    load('//static.getclicky.com/js', ready);
  },


  track : function (event, properties) {
    // In case the Clicky library hasn't loaded yet.
    if (!window.clicky) return;

    // We aren't guaranteed `clicky` is available until the script has been
    // requested and run, hence the check.
    window.clicky.log(window.location.href, event);
  }

});