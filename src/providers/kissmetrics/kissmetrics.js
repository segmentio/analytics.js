// KISSmetrics
// -----------
// [Documentation](http://support.kissmetrics.com/apis/javascript).

analytics.addProvider('KISSmetrics', {

    settings : {
        apiKey : null
    },


    // Initialize
    // ----------

    // Changes to the KISSmetrics snippet:
    //
    // * Concatenate the `apiKey` into the URL.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'apiKey');
        analytics.utils.extend(this.settings, settings);

        var _kmq = window._kmq = window._kmq || [];
        function _kms(u){
            setTimeout(function(){
                var d = document,
                    f = d.getElementsByTagName('script')[0],
                    s = d.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                var protocol = ('https:' == document.location.protocol) ? 'https:' : 'http:';
                s.src = protocol + u;
                f.parentNode.insertBefore(s, f);
            }, 1);
        }
        _kms('//i.kissmetrics.com/i.js');
        _kms('//doug1izaerwt3.cloudfront.net/'+this.settings.apiKey+'.1.js');
    },


    // Identify
    // --------

    // KISSmetrics uses two separate methods: `identify` for storing the
    // `userId`, and `set` for storing `traits`.
    identify : function (userId, traits) {
        if (userId) window._kmq.push(['identify', userId]);
        if (traits) window._kmq.push(['set', traits]);
    },


    // Track
    // -----

    track : function (event, properties) {
        // KISSmetrics handles revenue with the `'Billing Amount'` property by
        // default, although it's changeable in the interface.
        analytics.utils.alias(properties, {
            'revenue' : 'Billing Amount'
        });

        window._kmq.push(['record', event, properties]);
    },


    // Alias
    // -----

    // Although undocumented, KISSmetrics actually supports not passing a second
    // ID, in which case it uses the currenty identified user's ID.
    alias : function (newId, originalId) {
        window._kmq.push(['alias', newId, originalId]);
    }

});


