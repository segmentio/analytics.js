// LiveChat
// --------
// [Documentation](http://www.livechatinc.com/api/javascript-api).

analytics.addProvider('LiveChat', {

    settings : {
        license : null
    },


    // Initialize
    // ----------

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'license');
        analytics.utils.extend(this.settings, settings);

        window.__lc = {};
        window.__lc.license = this.settings.license;

        (function() {
            var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
            lc.src = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
        })();
    },


    // Identify
    // --------

    // LiveChat isn't an analytics service, but we can use the `userId` and
    // `traits` to tag the user with their real name in the chat console.
    identify : function (userId, traits) {
        // We aren't guaranteed the variable exists.
        if (!window.LC_API) return;

        // We need either a `userId` or `traits`.
        if (!userId && !traits) return;

        // LiveChat takes them in an array format.
        var variables = [];

        if (userId) {
            variables.push({ name: 'User ID', value: userId });
        }
        if (traits) {
            for (var key in traits) {
                var trait = {};
                trait.name = key;
                trait.value = traits[key];
                variables.push(trait);
            }
        }

        window.LC_API.set_custom_variables(variables);
    }

});


