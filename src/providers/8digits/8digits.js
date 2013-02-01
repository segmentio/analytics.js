

// 8digits.com - Web Monitoring Platform
analytics.addProvider('8digits', {
	settings: {
		trackingCode: null
	},

	initialize: function (settings) {
		settings = analytics.utils.resolveSettings(settings, 'trackingCode');
		analytics.utils.extend(this.settings, settings);

		window._trackingCode = this.settings.trackingCode;
		(function() {
			var wa = document.createElement('script'); wa.type = 'text/javascript'; wa.async = true;
			wa.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'tr2-static.8digits.com/js/wm.js?' + Math.random();
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(wa, s);
		})();
	},

	identify : function (userId, traits) {
		if (typeof userId === 'undefined' && typeof traits === 'undefined') {
			return;
		}

		if (userId && analytics.utils.isEmail(userId) && (traits && !traits.email)) {
			traits = traits || {};
			traits.email = userId;
		}

		if (typeof userId === 'object' && typeof traits === 'undefined') {
			traits = userId;
			userId = null;
		}

		// Alias the traits' keys with dollar signs for Mixpanel's API.
		if (traits) {
			analytics.utils.alias(traits, {
				'name'      : 'fullName'
			});

			if (traits.firstName && traits.lastName) {
				traits.fullName = traits.firstName + ' ' + traits.lastName;
			}

			delete traits['firstName'];
			delete traits['lastName'];
		}

		if (traits) {
			for (var key in traits) {
				if (traits.hasOwnProperty(key) && key !== 'avatarPath') {
					if (key === 'avatar' && (
						traits[key].indexOf('.jpg') >= 0 || 
						traits[key].indexOf('.png') >= 0)
					) {
						window.WebMon.setVisitorAvatar(traits[key]);
					} else {
						window.WebMon.setVisitorAttribute(key, traits[key]);
					}
				}
			}
		}
	},

	track: function(key, properties, callback) {
		var value = '';

		if (typeof key !== 'string') {
			return;
		}

		if (typeof properties === 'object') {
			value = properties.value || (properties.count || '');
		} else if (typeof properties === 'number' ||
				   typeof properties === 'string') {
			value = properties;
		}

		window.WebMon.sendEvent(key, value);
	},

	pageview: function (path) {
		window.WebMon.newPage(path, true);
	}
});
