// Lytics
// --------
// [Documentation](http://developer.lytics.io/doc#jstag),

var Provider = require('../provider')
  , user     = require('../user')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({


    key : 'cid',

    options : {
        cid: null
    },


    initialize : function (options, ready) {
        window.jstag = (function () {
          var t={_q:[],_c:{cid:options.cid,url:'//c.lytics.io'},ts:(new Date()).getTime()};
          t.send=function(){
            this._q.push(["ready","send",Array.prototype.slice.call(arguments)]);
            return this;
          }
          return t
        })();

        load('//c.lytics.io/static/io.js');

        // ready immediately 
        ready()
    },


    // Identify
    // --------

    identify: function (userId, traits) {
        if (analytics.utils.isObject(traits)){
            traits._uid = userId
        }
        window.jstag.send(traits)
    },


    // Track
    // -----

    track: function (event, properties) {
        if (!window.jstag) return;
        window.jstag.send(properties)
    },

    // Pageview
    // ----------
    pageview: function (url) {
        if (!window.jstag) return;
        window.jstag.send()
    }


});



