analytics.js:
	cat \
		src/analytics.js \
		src/providers/chartbeat/chartbeat.js \
		src/providers/crazyegg/crazyegg.js \
		src/providers/customerio/customerio.js \
		src/providers/ga/ga.js \
		src/providers/hubspot/hubspot.js \
		src/providers/intercom/intercom.js \
		src/providers/kissmetrics/kissmetrics.js \
		src/providers/klaviyo/klaviyo.js \
		src/providers/mixpanel/mixpanel.js \
		src/providers/olark/olark.js \
		> analytics.js

min:
	uglifyjs -o analytics.min.js analytics.js

docs:
	docco \
		src/analytics.js \
		src/providers/chartbeat/chartbeat.js \
		src/providers/crazyegg/crazyegg.js \
		src/providers/customerio/customerio.js \
		src/providers/ga/ga.js \
		src/providers/hubspot/hubspot.js \
		src/providers/intercom/intercom.js \
		src/providers/kissmetrics/kissmetrics.js \
		src/providers/klaviyo/klaviyo.js \
		src/providers/mixpanel/mixpanel.js \
		src/providers/olark/olark.js
	open docs/analytics.html

test:
	open test/min.html
	open test/providers.html
	open test/core.html

release:
	make analytics.js
	make min
	make docs
	make test

.PHONY: analytics.js min release test docs
