
// HubSpot
// -------
// Last updated: December 13th, 2012
// [Documentation](http://hubspot.clarify-it.com/d/4m62hl)

module.exports = {
    // Changes to the HubSpot snippet:
    //
    // * Adding HubSpot snippet

    // Use the `portalId` to setup the HubSpot tracking code.
    initialize : function (settings) {
        this.settings = settings;
        (function(d,s,i,r) {
            if (d.getElementById(i)){return;}
            var n=d.createElement(s),e=d.getElementsByTagName(s)[0];
            n.id=i;n.src='https://js.hubspot.com/analytics/'+(Math.ceil(new Date()/r)*r)+'/' + settings.portalId + '.js';
            e.parentNode.insertBefore(n, e);
        })(document,"script","hs-analytics",300000);
    },

    // HubSpot does not use a userId, but the email address is required
    // on the traits object. Other traits fields correspond to Contacts
    // record fields (including custom fields) and will update those
    // fields for the given contact.
    identify : function (userId, traits) {
        if (traits) {
            window._hsq.push(["identify", traits]);
        }
    },

    // Event Tracking is available to HubSpot Enterprise customers only.
    // In addition to adding any unique event name, you can also use the
    // id of an existing custom event as the event variable.
    track : function (event, properties) {
        window._hsq.push(["trackEvent", event, properties]);
    },

    keyField: 'portalId'
};



