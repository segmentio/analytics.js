// http://clicky.com/help/customization/manual?new-domain
// http://clicky.com/help/customization/manual?new-domain#/help/customization#session

var Provider = require('../provider')
  , user     = require('../user')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Clicky',

  key : 'siteId',

  defaults : {
    siteId : null
  },

  initialize : function (options, ready) {
    window.clicky_site_ids = window.clicky_site_ids || [];
    window.clicky_site_ids.push(options.siteId);

    var userId  = user.id()
      , traits  = user.traits()
      , session = {};

    if (userId) session.id = userId;
    extend(session, traits);

    window.clicky_custom = { session : session };

    load('//static.getclicky.com/js', ready);
  },

  track : function (event, properties) {
    window.clicky.log(window.location.href, event);
  }

});