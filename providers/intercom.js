
// Intercom
// --------
// Last updated: December 12th, 2012
// [Documentation](http://docs.intercom.io/).

var isEmail = require('../util').isEmail;
var getSeconds = require('../util').getSeconds;

module.exports = {

    // Intercom identifies when the script is loaded, so instead of
    // initializing in `initialize`, we have to initialize in `identify`.
    initialize: function (settings) {
        this.settings = settings;
    },

    // Changes to the Intercom snippet:
    //
    // * Add `appId` from stored `settings`.
    // * Add `userId`.
    identify: function (userId, traits) {
        // Don't do anything if we just have traits.
        if (!userId) return;

        window.intercomSettings = {
            app_id      : this.settings.appId,
            user_id     : userId,
            custom_data : traits || {}
        };

        if (traits) {
            if (traits.email)
                window.intercomSettings.email = traits.email;
            if (traits.name)
                window.intercomSettings.name = traits.name;
            if (traits.createdAt)
                window.intercomSettings.created_at = getSeconds(traits.createdAt);
        } else if (isEmail(userId)) {
            window.intercomSettings.email = userId;
        }

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

    keyField: 'appId'
};

