analytics.js:
	cat \
		src/analytics.js \
		src/providers/chartbeat/chartbeat.js \
		src/providers/clicky/clicky.js \
		src/providers/comscore/comscore.js \
		src/providers/crazyegg/crazyegg.js \
		src/providers/customerio/customerio.js \
		src/providers/errorception/errorception.js \
		src/providers/ga/ga.js \
		src/providers/gauges/gauges.js \
		src/providers/gosquared/gosquared.js \
		src/providers/hittail/hittail.js \
		src/providers/hubspot/hubspot.js \
		src/providers/intercom/intercom.js \
		src/providers/kissmetrics/kissmetrics.js \
		src/providers/klaviyo/klaviyo.js \
		src/providers/mixpanel/mixpanel.js \
		src/providers/olark/olark.js \
		src/providers/quantcast/quantcast.js \
		src/providers/snapengage/snapengage.js \
		src/providers/vero/vero.js \
		> analytics.js

min: analytics.js
	uglifyjs -o analytics.min.js analytics.js

docs:
	docco \
		src/analytics.js \
		src/providers/chartbeat/chartbeat.js \
		src/providers/clicky/clicky.js \
		src/providers/comscore/comscore.js \
		src/providers/crazyegg/crazyegg.js \
		src/providers/customerio/customerio.js \
		src/providers/errorception/errorception.js \
		src/providers/ga/ga.js \
		src/providers/gauges/gauges.js \
		src/providers/gosquared/gosquared.js \
		src/providers/hittail/hittail.js \
		src/providers/hubspot/hubspot.js \
		src/providers/intercom/intercom.js \
		src/providers/kissmetrics/kissmetrics.js \
		src/providers/klaviyo/klaviyo.js \
		src/providers/mixpanel/mixpanel.js \
		src/providers/olark/olark.js \
		src/providers/quantcast/quantcast.js \
		src/providers/snapengage/snapengage.js \
		src/providers/vero/vero.js

server:
	node test/server.js &

# Kills the travis server
kill:
	kill -9 `cat test/pid.txt`
	rm test/pid.txt


# Runs travis tests
test: server
	sleep 1
	node_modules/.bin/mocha-phantomjs http://localhost:8000/test/min.html
	node_modules/.bin/mocha-phantomjs http://localhost:8000/test/providers.html
	node_modules/.bin/mocha-phantomjs http://localhost:8000/test/core.html
	make kill

browser-test:
	open http://localhost:8000/test/min.html
	open http://localhost:8000/test/providers.html
	open http://localhost:8000/test/core.html

release:
	make analytics.js
	make min
	make docs
	make test

.PHONY: analytics.js docs test browser-test
