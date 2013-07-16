var Provider = require('../provider')
  , load     = require('load-script');

module.exports = Provider.extend({

	name : 'spinnakr',

	key : '_spinnakr_site_id',


	defaults : {

		_spinnakr_site_id : null
 	
 	},

	initialize : function(options, ready) {

		var _spinnakr_site_id = options._spinnakr_site_id;

		load({http  : 'http://d3ojzyhbolvoi5.cloudfront.net/js/so.js'}, ready); 
	}

});

