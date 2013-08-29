// http://api.yandex.com/metrika/

var Provider  = require('../provider')
  , load      = require('load-script')
  , type      = require('type')
  , url       = require('url')
  , canonical = require('canonical');


module.exports = Provider.extend({

  name : 'Yandex Metrica',

  key : 'apiKey',

  defaults : {
    // Your Yandex Metrica counter ID.
    apiKey : null,
    // Is webvisor enabled. (true - enabled).
    // Tracking and analyse user actions on web site. 
    webvisor : true,
    // Click map.
    clickmap : true,
    // Collect stats about external links, file downloads and share button.
    trackLinks : true,
    // Bounce will be a visit, during which the user is on the same page, and devoted to her less than 15 seconds.
    accurateTrackBounce : true,
    // Track hash location for ajax sites.
    trackHash : true
  },

  initialize : function (options, ready) {
    var yandex_callback = "yandex_metrika_callbacks";
    window[yandex_callback] = window[yandex_callback] || []; 
    window[yandex_callback].push(function(){
        var yandexOptions = {
                              id: options.apiKey,
                              webvisor: options.webvisor,
                              clickmap: options.clickmap,
                              trackLinks: options.trackLinks,
                              accurateTrackBounce: options.accurateTrackBounce,
                              trackHash: options.trackHash
                            };

        window.yaCounter = new Ya.Metrika(yandexOptions);
    });

    load('//mc.yandex.ru/metrika/watch.js');

    ready();
  }

});
