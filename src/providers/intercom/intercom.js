// Intercom
// --------
// Last updated: December 12th, 2012
// [Documentation](http://docs.intercom.io/).

analytics.addProvider('Intercom', {

    // Intercom identifies when the script is loaded, so instead of initializing
    // in `initialize`, we have to store the settings for later and initialize
    // in `identify`.
    initialize: function (settings) {
        this.settings = analytics.utils.resolveSettings(settings, 'appId');
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
            custom_data : traits || {},
        };

        if (traits) {
            window.intercomSettings.email = traits.email;
            window.intercomSettings.name = traits.name;
            window.intercomSettings.created_at = analytics.utils.getSeconds(traits.createdAt);
        }
        if (analytics.utils.isEmail(userId) && !traits.email) {
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
    }

});