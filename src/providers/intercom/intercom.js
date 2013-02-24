// Intercom
// --------
// [Documentation](http://docs.intercom.io/).

analytics.addProvider('Intercom', {

    // Whether Intercom has already been initialized or not. This is because
    // since we initialize Intercom on `identify`, people can make multiple
    // `identify` calls and we don't want that breaking anything.
    initialized : false,

    settings : {
        appId  : null,

        // An optional setting to display the Intercom inbox widget.
        activator : null
    },


    // Initialize
    // ----------

    // Intercom identifies when the script is loaded, so instead of initializing
    // in `initialize`, we store the settings for later and initialize in
    // `identify`.
    initialize: function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'appId');
        analytics.utils.extend(this.settings, settings);
    },


    // Identify
    // --------

    // Changes to the Intercom snippet:
    //
    // * Add `appId` from stored `settings`.
    // * Add `userId`.
    // * Add `userHash` for secure mode
    identify: function (userId, traits) {
        // If we've already been initialized once, don't do it again since we
        // load the script when this happens. Intercom can only handle one
        // identify call.
        if (this.initialized) return;

        // Don't do anything if we just have traits.
        if (!userId) return;

        // Pass traits directly in to Intercom's `custom_data`.
        var settings = window.intercomSettings = {
            app_id      : this.settings.appId,
            user_id     : userId,
            user_hash   : this.settings.userHash,
            custom_data : traits || {}
        };

        // Augment `intercomSettings` with some of the special traits.
        if (traits) {
            settings.email = traits.email;
            settings.name = traits.name;
            settings.created_at = analytics.utils.getSeconds(traits.created);
            settings.company = traits.company;
        }

        // If they didn't pass an email, check to see if the `userId` qualifies.
        if (analytics.utils.isEmail(userId) && (traits && !traits.email)) {
            settings.email = userId;
        }

        // Optionally add the widget.
        if (this.settings.activator) {
            settings.widget = {
                activator : this.settings.activator
            };
        }

        (function() {
            var s = document.createElement('script');
            s.type = 'text/javascript'; s.async = true;
            s.src = 'https://api.intercom.io/api/js/library.js';
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        })();

        // Set the initialized state, so that we don't initialize again.
        this.initialized = true;
    }

});


