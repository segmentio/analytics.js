//http://www.mousestats.com
//http://blog.mousestats.com

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

    name: 'MouseStats',

    key: 'accountNumber', //Account Number: 19Digits 

    defaults: {
        accountNumber: null
    },

    initialize: function (options, ready) {
        var preURL = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www2') + '.mousestats.com';
        var accountPath = options.accountNumber.slice(0, 1) + '/' + options.accountNumber.slice(1, 2) + '/' + options.accountNumber;
        load(preURL + '/' + accountPath + '.js?' + Math.floor(new Date().getTime() / 60000), ready);
    }

});