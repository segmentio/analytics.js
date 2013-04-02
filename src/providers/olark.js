// http://www.olark.com/documentation

var Provider = require('../provider');


module.exports = Provider.extend({

  name : 'Olark',

  key : 'siteId',

  chatInProgress : false,

  options : {
    siteId : null,
    // Whether to use the user's name or email in the Olark chat console.
    identify : true,
    // Whether to log pageviews to the Olark chat console.
    track : false,
    // Whether to log pageviews to the Olark chat console.
    pageview : true
  },

  initialize : function (options, ready) {
    window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){f[z]=function(){(a.s=a.s||[]).push(arguments)};var a=f[z]._={},q=c.methods.length;while(q--){(function(n){f[z][n]=function(){f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={0:+new Date};a.P=function(u){a.p[u]=new Date-a.p[0]};function s(){a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{b.contentWindow[g].open()}catch(w){c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{var t=b.contentWindow[g];t.write(p());t.close()}catch(x){b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
    window.olark.identify(options.siteId);

    // set up event handlers for chat box open and close
    var self = this;
    window.olark('api.box.onExpand', function () {
      self.chatInProgress = true;
    });
    window.olark('api.box.onShrink', function () {
      self.chatInProgress = false;
    });

    // Olark creates all of it's method in the snippet, so it's ready
    // immediately.
    ready();
  },

  // Olark isn't an analytics service, but we can use the `userId` and
  // `traits` to tag the user with their real name in the chat console.
  identify : function (userId, traits) {
    if (!this.options.identify) return;

    // Choose the best name for the user that we can get.
    var name = userId;
    if (traits && traits.email) name = traits.email;
    if (traits && traits.name) name = traits.name;
    if (traits && traits.name && traits.email) name += ' ('+traits.email+')';

    // If we ended up with no name after all that, get out of there.
    if (!name) return;

    window.olark('api.chat.updateVisitorNickname', {
      snippet : name
    });
  },

  // Again, all we're doing is logging events the user triggers to the chat
  // console, if you so desire it.
  track : function (event, properties) {
    if (!this.options.track || !this.chatInProgress) return;

    // To stay consistent with olark's default messages, it's all lowercase.
    window.olark('api.chat.sendNotificationToOperator', {
      body : 'visitor triggered "'+event+'"'
    });
  },

  // Again, not analytics, but we can mimic the functionality Olark has for
  // normal pageviews with pseudo-pageviews, telling the operator when a
  // visitor changes pages.
  pageview : function (url) {
    if (!this.options.pageview || !this.chatInProgress) return;

    // To stay consistent with olark's default messages, it's all lowercase.
    window.olark('api.chat.sendNotificationToOperator', {
      body : 'looking at ' + window.location.href
    });
  }

});