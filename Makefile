release:
	cat \
		src/analytics.js \
		src/providers/chartbeat.js \
		src/providers/crazyegg.js \
		src/providers/customerio.js \
		src/providers/ga.js \
		src/providers/hubspot.js \
		src/providers/intercom.js \
		src/providers/kissmetrics.js \
		src/providers/klaviyo.js \
		src/providers/mixpanel.js \
		src/providers/olark.js \
		> analytics.js
	uglifyjs -o analytics.min.js analytics.js

test:
	open test/analyticsjs.html
	open test/providers.html

min-test:
	open test/min-analyticsjs.html
	open test/min-providers.html

docs:
	docco analytics.js
	open docs/analytics.html

.PHONY: min test docs
