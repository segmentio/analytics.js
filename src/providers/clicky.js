// Clicky
// ------
// [Documentation](http://clicky.com/help/customization/manual?new-domain).
// [Session info](http://clicky.com/help/customization/manual?new-domain#/help/customization#session)

var Provider = require('../provider')
  , user     = require('../user')
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

    var userId  = user.id()
      , traits  = user.traits()
      , session = {};

    if (userId) session.username = userId;
    extend(session, traits);

    window.clicky_custom = { session : session };

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