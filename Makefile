
PHANTOM = node_modules/.bin/mocha-phantomjs
PHANTOM_OPTS = -s web-security=false -s local-to-remote-url-access=true

FILES = src/analytics.js \
				src/providers/bitdeli/bitdeli.js \
				src/providers/chartbeat/chartbeat.js \
				src/providers/clicky/clicky.js \
				src/providers/comscore/comscore.js \
				src/providers/crazyegg/crazyegg.js \
				src/providers/customerio/customerio.js \
				src/providers/errorception/errorception.js \
				src/providers/foxmetrics/foxmetrics.js \
				src/providers/ga/ga.js \
				src/providers/gauges/gauges.js \
				src/providers/gosquared/gosquared.js \
				src/providers/hittail/hittail.js \
				src/providers/hubspot/hubspot.js \
				src/providers/intercom/intercom.js \
				src/providers/keenio/keenio.js \
				src/providers/kissmetrics/kissmetrics.js \
				src/providers/klaviyo/klaviyo.js \
				src/providers/mixpanel/mixpanel.js \
				src/providers/olark/olark.js \
				src/providers/quantcast/quantcast.js \
				src/providers/snapengage/snapengage.js \
				src/providers/usercycle/usercycle.js \
				src/providers/vero/vero.js

# Compiles a one-file copy of analytics.js from all the development files.
analytics.js:
	cat $(FILES) > analytics.js

# Adds a minified copy of analytics.js
min: analytics.js
	uglifyjs -o analytics.min.js analytics.js

# Adds nice annotated-source docs for each file.
docs:
	docco $(FILES)

# Starts the testing server.
server:
	node test/server.js &

# Kills the testing server.
kill:
	kill -9 `cat test/pid.txt`
	rm test/pid.txt

# Runs all the tests on travis.
test: server
	sleep 1
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/core.html
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/providers.html
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/min.html
	make kill

# Runs only the non-minified tests.
test-dev: server
	sleep 1
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/core.html
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/providers.html
	make kill

# Runs only the non-minified core tests.
test-dev-core: server
	sleep 1
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/core.html
	make kill

# Runs only the non-minified provider tests.
test-dev-providers: server
	sleep 1
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/providers.html
	make kill

# Opens all the tests in your browser.
test-browser:
	open http://localhost:8000/test/core.html
	open http://localhost:8000/test/providers.html
	open http://localhost:8000/test/min.html

# Compiles, minfies, doccos, and tests analytics.js - wrapped up and good to go.
release: analytics.js min docs test



.PHONY: analytics.js docs