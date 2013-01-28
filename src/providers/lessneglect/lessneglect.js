// Less Neglect
// ------------
// [Documentation](http://beta.lessneglect.com/api/clients#javascript).

analytics.addProvider('Less Neglect', {

    settings : {
        projectCode : null
    },


    // Initialize
    // ----------

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'projectCode');
        analytics.utils.extend(this.settings, settings);

        var _lnq = window._lnq = window._lnq || [];
        _lnq.push(["_setCode", this.settings.projectCode]);

        (function() {
            var s = document.createElement('script');
            var el = document.getElementsByTagName('script')[0];
            s.async = true;
            s.src = (document.location.protocol == 'https:' ? 'https://' : 'http://') + 'api.lessneglect.com/cdn/ln-2.1.min.js';
            el.parentNode.insertBefore(s, el);
        })();
    },


    // Identify
    // --------

    identify : function (userId, traits) {
        
        // Less Neglect requires an external_identifier as userId
        if (!userId || !traits) return;

        // If there wasn't already an email and the userId is one, use it.
        if (!traits.email && analytics.utils.isEmail(userId)) {
            traits.email = userId;
        }

        // Swap the `created` trait to the `created_at` that Less Neglect needs
        // (in seconds).
        if (traits.created) {
            traits.created_at = analytics.utils.getSeconds(traits.created);
            delete traits.created;
        }

        window._lnq.push(["_setPersonData", {
          name : traits.name,
          email : traits.email,
          external_identifier : userId,
          properties : traits
        }]);
        
    },


    // Track
    // -----

    track : function (event, properties) {
        var personEvent = {
            name : event,
            external_identifier : null,
            note : null
        }
        if(properties.external_identifier) {
            personEvent.external_identifier = properties.external_identifier;
        }
        if(properties.note) {
            personEvent.note = properties.note;
        }

        window._lnq.push(['_logEvent', personEvent, properties]);}

});


