// HubSpot
// -------
// [Documentation](http://hubspot.clarify-it.com/d/4m62hl)

analytics.addProvider('HubSpot', {

    settings : {
        portalId : null
    },


    // Initialize
    // ----------

    // Changes to the HubSpot snippet:
    //
    // * Concatenate `portalId` into the URL.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'portalId');
        analytics.utils.extend(this.settings, settings);

        var self = this;

        (function(d,s,i,r) {
            if (d.getElementById(i)){return;}
            window._hsq = window._hsq || []; // for calls pre-load
            var n=d.createElement(s),e=d.getElementsByTagName(s)[0];
            n.id=i;n.src='https://js.hubspot.com/analytics/'+(Math.ceil(new Date()/r)*r)+'/' + self.settings.portalId + '.js';
            e.parentNode.insertBefore(n, e);
        })(document,"script","hs-analytics",300000);
    },


    // Identify
    // --------

    identify : function (userId, traits) {
        // HubSpot does not use a userId, but the email address is required on
        // the traits object.
        if (!traits) return;

        window._hsq.push(["identify", traits]);
    },


    // Track
    // -----

    // Event Tracking is available to HubSpot Enterprise customers only. In
    // addition to adding any unique event name, you can also use the id of an
    // existing custom event as the event variable.
    track : function (event, properties) {
        window._hsq.push(["trackEvent", event, properties]);
    },


    // Pageview
    // --------

    pageview : function () {
        // TODO http://performabledoc.hubspot.com/display/DOC/JavaScript+API
    }

});


