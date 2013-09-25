
var callback = require('callback')
  , integration = require('../integration');


/**
 * Expose `Olark` integration.
 *
 * http://www.olark.com/documentation
 */

var Olark = module.exports = integration('Olark');


/**
 * Required key.
 */

Olark.prototype.key = 'siteId';


/**
 * Default options.
 */

Olark.prototype.defaults = {
  // whether to set the user's name or email in the chat
  identify : true,
  // whether to log pageviews in the chat
  pageview: true,
  // your olark site id (required)
  siteId: '',
  // whether to log events the user triggers in the chat
  track : false,
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Olark.prototype.initialize = function (options, ready) {
  window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){f[z]=function(){(a.s=a.s||[]).push(arguments)};var a=f[z]._={},q=c.methods.length;while(q--){(function(n){f[z][n]=function(){f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={0:+new Date};a.P=function(u){a.p[u]=new Date-a.p[0]};function s(){a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{b.contentWindow[g].open()}catch(w){c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{var t=b.contentWindow[g];t.write(p());t.close()}catch(x){b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
  window.olark.identify(options.siteId);
  callback.async(ready);

  // keep track of the widget's open state
  var self = this;
  box('onExpand', function () { self._open = true; });
  box('onShrink', function () { self._open = false; });
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Olark.prototype.identify = function (id, traits, options) {
  if (!this.options.identify) return;
  if (id) traits.id = id;

  visitor('updateCustomFields', traits);
  if (traits.email) visitor('updateEmailAddress', { emailAddress: traits.email });
  if (traits.phone) visitor('updatePhoneNumber', { phoneNumber: traits.phone });

  // figure out best name
  var name = traits.firstName;
  if (traits.lastName) name += ' ' + traits.lastName;
  if (traits.name) name = traits.name;
  if (name) visitor('updateFullName', { fullName: name });

  // figure out best nickname
  var nickname = name || traits.email || traits.username || id;
  if (name && traits.email) nickname += ' (' + traits.email + ')';
  if (nickname) chat('updateVisitorNickname', { snippet: nickname });
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Olark.prototype.track = function (event, properties, options) {
  if (!this.options.track || !this._open) return;
  chat('sendNotificationToOperator', {
    body: 'visitor triggered "' + event + '"' // lowercase since olark does
  });
};


/**
 * Pageview.
 *
 * @param {String} url (optional)
 */

Olark.prototype.pageview = function (url) {
  if (!this.options.pageview || !this._open) return;
  url || (url = window.location.href);
  chat('sendNotificationToOperator', {
    body: 'looking at ' + url // lowercase since olark does
  });
};


/**
 * Helper method for Olark box API calls.
 *
 * @param {String} action
 * @param {Object} value
 */

function box (action, value) {
  window.olark('api.box.' + action, value);
}


/**
 * Helper method for Olark visitor API calls.
 *
 * @param {String} action
 * @param {Object} value
 */

function visitor (action, value) {
  window.olark('api.visitor.' + action, value);
}


/**
 * Helper method for Olark chat API calls.
 *
 * @param {String} action
 * @param {Object} value
 */

function chat (action, value) {
  window.olark('api.chat.' + action, value);
}