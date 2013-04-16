// http://www.olark.com/documentation

var Provider = require('../provider')
  , isEmail  = require('is-email');


module.exports = Provider.extend({

  name : 'Olark',

  key : 'siteId',

  chatInProgress : false,

  defaults : {
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

    // Set up event handlers for chat box open and close so that
    // we know whether a conversation is active. If it is active,
    // then we'll send track and pageview information.
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

    // Make an empty default traits object if it doesn't exist yet.
    traits || (traits = {});

    // If there wasn't already an email and the userId is one, use it.
    if (!traits.email && isEmail(userId)) traits.email = userId;

    // Set the email address for the user.
    if (traits.email)
      window.olark('api.visitor.updateEmailAddress', { emailAddress : traits.email });

    // Set the full name for the user.
    if (traits.name)
      window.olark('api.visitor.updateFullName', { fullName : traits.name });
    else if (traits.firstName && traits.lastName)
      window.olark('api.visitor.updateFullName', { fullName : traits.firstName + ' ' + traits.lastName });

    // Set the phone number for the user.
    if (traits.phone)
      window.olark('api.visitor.updatePhoneNumber', { phoneNumber : traits.phone });

    // Set any additional custom fields from the traits.
    window.olark('api.visitor.updateCustomFields', traits);

    // Choose the best possible nickname for the user.
    var nickname = userId;
    if (traits.email) nickname = traits.email;
    if (traits.name) nickname = traits.name;
    if (traits.name && traits.email) nickname += ' ('+traits.email+')';

    // If we ended up with no nickname after all that, get out of here.
    if (!nickname) return;

    window.olark('api.chat.updateVisitorNickname', {
      snippet : nickname
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