
var Provider = require('../provider')
  , load     = require('load-script')
  , each     = require('each');


module.exports = Provider.extend({

  name : 'Evergage',

  defaults : {
    account: null,
    dataset: null,
    minified: true,
    localTestServer: false,
    loggingLevel: 'NONE'
  },

  initialize : function (options, ready) {
    window._aaq = window._aaq || [];
    window._aaq.push(['setEvergageAccount', options.account], ['setDataset', options.dataset], ['setUseSiteConfig', true]);
    if (options.loggingLevel != null) {
        window._aaq.push(['setLoggingLevel', options.loggingLevel]);
    }

    var evergageBeaconFileName = options.minified ? 'evergage.min.js' : 'evergage.js';

    if (options.localTestServer) {
      var localtestBaseUrl = 'http://localtest.evergage.com:8080';
      window._aaq.push(['setTrackerUrl', localtestBaseUrl]);
      load(localtestBaseUrl + '/beacon/' + options.account + '/' + options.dataset + '/scripts/' + evergageBeaconFileName);
    } else {
      load('//cdn.evergage.com/beacon/' + options.account + '/' + options.dataset + '/scripts/' + evergageBeaconFileName);
    }

    // Evergage uses a queue array, so it is ready immediatelly
    ready();
  },

  identify : function (userId, traits) {
    if (!userId || typeof userId !== 'string') {
      return;
    }
    window._aaq.push(['setUser', userId]);
    each(traits, function(name, value) {
      if (name == 'name') {
        window._aaq.push(['setUserField', 'userName', value, 'page']);
      } else if (name == 'email') {
        window._aaq.push(['setUserField', 'userEmail', value, 'page']);
      } else {
        window._aaq.push(['setUserField', name, value, 'page']);
      }
    });
  },

  group : function (groupId, properties, options) {
    if (!groupId || typeof groupId !== 'string') {
      return;
    }
    window._aaq.push(['setCompany', groupId]);
    each(properties, function(name, value) {
      window._aaq.push(['setAccountField', name, value, 'page']);
    });
  },

  track : function (event, properties) {
    window._aaq.push(['trackAction', event, properties]);
  },

  pageview : function (url) {
    window.Evergage.init(true);
  }

});
