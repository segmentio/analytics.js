availableProviders['Intercom'] = {

    _settings : {},

    initialize: function (settings) {
        this._settings = settings;
    },

    identify: function (visitorId, traits) {
        window.intercomSettings = {
            app_id     : this._settings.appId,
            email      : visitorId,
            created_at : (new Date()).getTime()
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
    }
};
