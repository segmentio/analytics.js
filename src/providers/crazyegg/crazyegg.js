// CrazyEgg
// --------
// [Documentation](www.crazyegg.com).

analytics.addProvider('CrazyEgg', {

    settings : {
        apiKey : null
    },


    // Initialize
    // ----------

    // Changes to the CrazyEgg snippet:
    //
    // * Concatenate `apiKey` into the URL.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'apiKey');
        analytics.utils.extend(this.settings, settings);

        var apiKey = this.settings.apiKey;
        (function(){
            var a=document.createElement("script");
            var b=document.getElementsByTagName("script")[0];
            a.src=document.location.protocol+"//dnn506yrbagrg.cloudfront.net/pages/scripts/"+apiKey+".js?"+Math.floor(new Date().getTime()/3600000);
            a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b);
        })();
    }

});


