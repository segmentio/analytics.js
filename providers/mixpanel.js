
// Mixpanel
// --------
// Last updated: September 27th, 2012
// [Documentation](https://mixpanel.com/docs/integration-libraries/javascript),
// [documentation](https://mixpanel.com/docs/people-analytics/javascript),
// [documentation](https://mixpanel.com/docs/integration-libraries/javascript-full-api).

var isEmail = require('../util').isEmail;

module.exports = {

    // Changes to the Mixpanel snippet:
    //
    // * Use window for call to `init`.
    // * Add `apiKey` and `settings` args to call to `init`.
    //
    // Also, we don't need to set the `mixpanel` object on `window` because
    // they already do that.
    initialize : function (settings) {
        this.settings = settings;

        (function(c,a){window.mixpanel=a;var b,d,h,e;b=c.createElement("script");
        b.type="text/javascript";b.async=!0;b.src=("https:"===c.location.protocol?"https:":"http:")+
        '//cdn.mxpnl.com/libs/mixpanel-2.1.min.js';d=c.getElementsByTagName("script")[0];
        d.parentNode.insertBefore(b,d);a._i=[];a.init=function(b,c,f){function d(a,b){
        var c=b.split(".");2==c.length&&(a=a[c[0]],b=c[1]);a[b]=function(){a.push([b].concat(
        Array.prototype.slice.call(arguments,0)))}}var g=a;"undefined"!==typeof f?g=a[f]=[]:
        f="mixpanel";g.people=g.people||[];h=['disable','track','track_pageview','track_links',
        'track_forms','register','register_once','unregister','identify','name_tag',
        'set_config','people.identify','people.set','people.increment'];for(e=0;e<h.length;e++)d(g,h[e]);
        a._i.push([b,c,f])};a.__SV=1.1;})(document,window.mixpanel||[]);
        window.mixpanel.init(settings.token, settings);
    },


    // Only identify with Mixpanel's People feature if you opt-in because
    // otherwise Mixpanel charges you for it.
    // Alias email -> $email
    identify : function (userId, traits) {
        if (userId) {
            window.mixpanel.identify(userId);
            window.mixpanel.name_tag(userId);

            if (isEmail(userId)) {
                traits || (traits = {});
                traits.email = userId;
            }
        }

        if (traits) {
            this.aliasTraits(traits);
            window.mixpanel.register(traits);
        }

        if (this.settings.people === true) {
            if (userId) window.mixpanel.people.identify(userId);
            if (traits) window.mixpanel.people.set(traits);
        }
    },

    aliasTraits : function (traits) {
        if (traits.email) {
            traits['$email'] = traits.email;
            delete traits.email;
        }
        if (traits.name) {
            traits['$name'] = traits.name;
            delete traits.name;
        }
        if (traits.username) {
            traits['$username'] = traits.username;
            delete traits.username;
        }
        if (traits.lastSeen) {
            traits['$last_login'] = traits.lastSeen;
            delete traits.lastSeen;
        }
        if (traits.createdAt) {
            traits['$created'] = traits.createdAt;
            delete traits.createdAt;
        }
    },

    track : function (event, properties) {
        window.mixpanel.track(event, properties);
    },

    keyField: 'token'
};


