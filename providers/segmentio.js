availableProviders['Segment.io'] = {

    initialize : function (settings) {
        var seg=seg||[];seg.load=function(a){var b,c,d,e,f,g=document;b=g.createElement("script"),b.type="text/javascript",b.async=!0,b.src=a,c=g.getElementsByTagName("script")[0],c.parentNode.insertBefore(b,c),d=function(a){return function(){seg.push([a].concat(Array.prototype.slice.call(arguments,0)))}},e=["init","identify","track","callback","verbose"];for(f=0;f<e.length;f+=1)seg[e[f]]=d(e[f])};
        window.seg=seg;
        seg.load(document.location.protocol+'//d47xnnr8b1rki.cloudfront.net/api/js/v2/segmentio.js');
        window.seg.verbose(true);
        window.seg.init(settings.apiKey, settings.environment);
    },

    identify : function (userId, traits) {
        window.seg.identify(userId, traits);
    },

    track : function (event, properties) {
        window.seg.track(event, properties);
    }
};