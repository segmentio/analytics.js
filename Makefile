server:
	node test/server.js &

kill:
	kill -9 `cat test/pid.txt`
	rm test/pid.txt

analytics.js:
	cat \
		src/analytics.js \
		src/providers/chartbeat/chartbeat.js \
		src/providers/crazyegg/crazyegg.js \
		src/providers/customerio/customerio.js \
		src/providers/ga/ga.js \
		src/providers/hubspot/hubspot.js \
		src/providers/gosquared/gosquared.js \
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
		src/providers/gosquared/gosquared.js \
		src/providers/intercom/intercom.js \
		src/providers/kissmetrics/kissmetrics.js \
		src/providers/klaviyo/klaviyo.js \
		src/providers/mixpanel/mixpanel.js \
		src/providers/olark/olark.js
	open docs/analytics.html


test:
	open http://localhost:8000/test/min.html
	open http://localhost:8000/test/providers.html
	open http://localhost:8000/test/core.html


travis: server
	sleep 1
	node_modules/.bin/mocha-phantomjs http://localhost:8000/test/min.html
	node_modules/.bin/mocha-phantomjs http://localhost:8000/test/providers.html
	node_modules/.bin/mocha-phantomjs http://localhost:8000/test/core.html
	make kill


release:
	make analytics.js
	make min
	make docs
	make test

.PHONY: server analytics.js min docs release test
