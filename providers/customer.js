
// Customer.io
// ----------
// Last updated: December 6th, 2012
// [Documentation](http://customer.io/docs/api/javascript.html).

var clone = require('../util').clone;
var isEmail = require('../util').isEmail;
var getSeconds = require('../util').getSeconds;

module.exports = {

    initialize : function (settings) {
        this.settings = settings;

        var _cio = _cio || [];

        (function() {
            var a,b,c;a=function(f){return function(){_cio.push([f].
            concat(Array.prototype.slice.call(arguments,0)))}};b=["identify",
            "track"];for(c=0;c<b.length;c++){_cio[b[c]]=a(b[c])};
            var t = document.createElement('script'),
                s = document.getElementsByTagName('script')[0];
            t.async = true;
            t.id    = 'cio-tracker';
            t.setAttribute('data-site-id', settings.siteId);
            t.src = 'https://assets.customer.io/assets/track.js';
            s.parentNode.insertBefore(t, s);
        })();

        window._cio = _cio;
    },

    identify : function (userId, traits) {
        // Don't do anything if we just have traits.
        if (!userId) return;

        traits || (traits = {});
        var properties = clone(traits);
        properties.id = userId;
        if (properties.email === undefined && isEmail(userId))
            properties.email = userId;

        if (properties.createdAt) {
            properties.created_at = getSeconds(properties.createdAt);
            delete properties.createdAt;
        }
        window._cio.identify(properties);
    },

    track : function (event, properties) {
        window._cio.track(event, properties);
    },

    keyField: 'siteId'
};

