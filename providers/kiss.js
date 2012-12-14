
// KISSmetrics
// -----------
// Last updated: December 12th, 2012
// [Documentation](http://support.kissmetrics.com/apis/javascript).

module.exports = {
    // Changes to the KISSmetrics snippet:
    //
    // * Concatenate the `apiKey` into the URL.
    initialize : function (settings) {
        this.settings = settings;

        var _kmq = _kmq || [];
        function _kms(u){
            setTimeout(function(){
                var d = document, f = d.getElementsByTagName('script')[0],
                s = d.createElement('script');
                s.type = 'text/javascript'; s.async = true; s.src = u;
                f.parentNode.insertBefore(s, f);
            }, 1);
        }
        _kms('//i.kissmetrics.com/i.js');
        _kms('//doug1izaerwt3.cloudfront.net/'+ settings.apiKey +'.1.js');

        window._kmq = _kmq;
    },

    // KISSmetrics uses two separate methods: `identify` for storing the
    // `userId` and `set` for storing `traits`.
    identify : function (userId, traits) {
        if (userId)
          window._kmq.push(['identify', userId]);
        if (traits)
          window._kmq.push(['set', traits]);
    },

    track : function (event, properties) {
        window._kmq.push(['record', event, properties]);
    },

    keyField: 'apiKey'
};


