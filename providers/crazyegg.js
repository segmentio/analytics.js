
// CrazyEgg.com
// ----------
// Last updated: December 6th, 2012
// [Documentation](www.crazyegg.com).

module.exports = {
    // Changes to the CrazyEgg snippet:
    //
    // * API Key is the xxxx/xxxx in the url.
    initialize : function (settings) {
        this.settings = settings;

        (function(){
            var a=document.createElement("script");
            var b=document.getElementsByTagName("script")[0];
            a.src=document.location.protocol+"//dnn506yrbagrg.cloudfront.net/pages/scripts/"+settings.apiKey+".js?"+Math.floor(new Date().getTime()/3600000);
            a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b);
        })();
    },

    keyField: 'apiKey'
};

