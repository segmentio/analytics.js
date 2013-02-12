// CrazyEgg
// --------
// [Documentation](www.crazyegg.com).

var utils = require('../../utils');


module.exports = CrazyEgg;

function CrazyEgg () {
  this.settings = {
    accountNumber : null
  };
}


// Changes to the CrazyEgg snippet:
//
// * Concatenate `accountNumber` into the URL.
CrazyEgg.prototype.initialize = function (settings) {

  settings = utils.resolveSettings(settings, 'accountNumber');
  utils.extend(this.settings, settings);

  var accountNumber = this.settings.accountNumber;
  var accountPath = accountNumber.slice(0, 4) + '/' + accountNumber.slice(4);

  (function(){
    var a = document.createElement('script');
    var b = document.getElementsByTagName('script')[0];
    var protocol = ('https:' === document.location.protocol) ? 'https:' : 'http:';
    a.src = protocol+'//dnn506yrbagrg.cloudfront.net/pages/scripts/'+accountPath+'.js?'+Math.floor(new Date().getTime()/3600000);
    a.async = true;
    a.type = 'text/javascript';
    b.parentNode.insertBefore(a,b);
  })();
};