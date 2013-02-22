// Storyberg
// -----------
// [Documentation](https://github.com/Storyberg/Docs/wiki/Javascript-Library).

analytics.addProvider('Storyberg', {

    settings : {
        apiKey : null
    },


    // Initialize
    // ----------
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'apiKey');
        analytics.utils.extend(this.settings, settings);

        var self = this;

        var _sbq = window._sbq = window._sbq || [];

        var _sbk = settings.apiKey;

        function _sbs(u){
            setTimeout(function(){
                var d = document, f = d.getElementsByTagName('script')[0],
                s = d.createElement('script');
                s.type = 'text/javascript'; s.async = true; s.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + u;
                f.parentNode.insertBefore(s, f);
            }, 1);
        }

        _sbs('storyberg.com/analytics.js');
    },


    // Identify
    // --------

    identify : function (userId, traits) {
        // Don't do anything if we just have traits, because Vero
        // requires a `userId`.
        if (!userId) return;

        traits || (traits = {});

        // Storyberg takes the `userId` as part of the traits object
        traits.user_id = userId;

        // Storyberg *requires* a user_id
        if (!traits.user_id) return;

        window._sbq.push(['identify', traits]);
    },


    // Track
    // -----

    track : function (event, properties) {
        properties || (properties = {});

        // Storyberg takes the `userId` as part of the properties object
        properties.name = event;

        window._sbq.push(['event', properties]);
    }

});
