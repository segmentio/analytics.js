
var MIXPANEL = {

    settings: {

        apiKey: '[YOUR API KEY HERE ex. 2a037cdd1204c4ef35fa4f8b9b38f2e7]'

    },

    setup: function (settings) {

        (function(d,c){var a,b,g,e;a=d.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===d.location.protocol?"https:":"http:")+'//api.mixpanel.com/site_media/js/api/mixpanel.2.js';b=d.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);c._i=[];c.init=function(a,d,f){var b=c;"undefined"!==typeof f?b=c[f]=[]:f="mixpanel";g="disable track track_pageview track_links track_forms register register_once unregister identify name_tag set_config".split(" ");
        for(e=0;e<g.length;e++)(function(a){b[a]=function(){b.push([a].concat(Array.prototype.slice.call(arguments,0)))}})(g[e]);c._i.push([a,d,f])};window.mixpanel=c})(document,[]);

        window.mixpanel.init(settings.apiKey);
    },

    identify: function (visitorId, traits) {

        window.mixpanel.identify(visitorId);

        window.mixpanel.register(traits);

    },

    track: function (event, properties) {

        window.mixpanel.track(event, properties);

    }
};