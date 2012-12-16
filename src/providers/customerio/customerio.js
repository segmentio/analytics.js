// Customer.io
// ----------
// Last updated: December 6th, 2012
// [Documentation](http://customer.io/docs/api/javascript.html).

analytics.addProvider('Customer.io', {

    settings : {
        siteId : null
    },

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'siteId');
        analytics.utils.extend(this.settings, settings);

        var self = this;

        var _cio = _cio || [];
        (function() {
            var a,b,c;a=function(f){return function(){_cio.push([f].
            concat(Array.prototype.slice.call(arguments,0)))}};b=["identify",
            "track"];for(c=0;c<b.length;c++){_cio[b[c]]=a(b[c])};
            var t = document.createElement('script'),
                s = document.getElementsByTagName('script')[0];
            t.async = true;
            t.id    = 'cio-tracker';
            t.setAttribute('data-site-id', self.settings.siteId);
            t.src = 'https://assets.customer.io/assets/track.js';
            s.parentNode.insertBefore(t, s);
        })();
        window._cio = _cio;
    },

    identify : function (userId, traits) {
        // Don't do anything if we just have traits, because Customer.io
        // requires a `userId`.
        if (!userId) return;

        traits || (traits = {});

        // Customer.io takes the `userId` as part of the traits object.
        traits.id = userId;

        // If there wasn't already an email and the userId is one, use it.
        if (!traits.email && analytics.utils.isEmail(userId)) {
            traits.email = userId;
        }

        // Swap the `createdAt` trait to the `created_at` that Customer.io
        // needs (in seconds).
        if (traits.createdAt) {
            traits.created_at = analytics.utils.getSeconds(traits.createdAt);
            delete traits.createdAt;
        }

        window._cio.identify(traits);
    },

    track : function (event, properties) {
        window._cio.track(event, properties);
    }

});


