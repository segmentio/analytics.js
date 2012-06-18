
var INTERCOM_IO = {

    settings: {
        appId: '[YOUR API KEY HERE ex. hf20f6qu]'
    },

    setup: function (settings) {
        // no setup here
    },

    identify: function (visitorId, traits) {
        window.intercomSettings = {
            app_id: this.settings.appId,
            email: visitorId,
            created_at: (new Date()).getTime()
        };

        function async_load() {
            var s = document.createElement('script');
            s.type = 'text/javascript'; s.async = true;
            s.src = 'https://api.intercom.io/api/js/library.js';
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        }

        if (window.attachEvent) {
            window.attachEvent('onload', async_load);
        } else {
            window.addEventListener('load', async_load, false);
        }
    },

    track: function (event, properties) {
        // not supported
    }

};
