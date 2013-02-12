// CrazyEgg
// --------
// [Documentation](www.crazyegg.com).

var extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');


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
  extend(this.settings, settings);

  var accountNumber = this.settings.accountNumber;
  var accountPath = accountNumber.slice(0, 4) + '/' + accountNumber.slice(4);

  load('//dnn506yrbagrg.cloudfront.net/pages/scripts/'+accountPath+'.js?'+Math.floor(new Date().getTime()/3600000));
};