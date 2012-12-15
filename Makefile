release:
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
	uglifyjs -o analytics.min.js analytics.js
	make docs

test:
	open test/min.html
	open test/providers.html
	open test/analytics.html

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

.PHONY: release test docs
