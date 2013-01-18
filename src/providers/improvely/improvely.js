// Improvely
// --------
// [Documentation](www.improvely.com).

analytics.addProvider('Improvely', {

    settings : {
        domain      : null,
        project_id  : null
    },


    // Initialize
    // ----------

    initialize : function (settings) {
        var domain = settings.domain;
        var project_id = settings.project_id;

        analytics.utils.extend(this.settings, settings);

        (function(e,t,n){window._improvely=[];setTimeout(function(){var n=t,r=n.getElementsByTagName("script")[0],i=n.createElement("script");i.type="text/javascript";i.async=true;i.src=("https:"===t.location.protocol?"https:":"http:")+"//"+e+".iljmp.com/improvely.js";r.parentNode.insertBefore(i,r)},1);if(typeof n.init=="undefined"){n.init=function(e,t){window._improvely.push(["init",e,t])};n.goal=function(e){window._improvely.push(["goal",e])};n.label=function(e){window._improvely.push(["label",e])}}window.improvely=n;window.improvely.init(e,project_id)})(domain,document,window.improvely||[]);
    },


    // Identify
    // --------

    identify : function (userId, traits) {
        if (userId) window.improvely.label(userId);
    },


    // Track
    // -----

    track : function (event, properties) {
        if (typeof properties.type === 'undefined')
            properties.type = event;
        window.improvely.goal(properties);
    }

});
