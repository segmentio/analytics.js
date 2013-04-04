
PHANTOM = node_modules/.bin/mocha-phantomjs
PHANTOM_OPTS = --setting web-security=false --setting local-to-remote-url-access=true

# Compiles a one-file copy of analytics.js from all the development files.
analytics.js: install
	component build --standalone analytics --out . --name analytics

# Adds a minified copy of analytics.js
min: analytics.js
	uglifyjs -o analytics.min.js analytics.js

# Starts the testing server.
server:
	node test/server.js &

# Kills the testing server.
kill:
	kill -9 `cat test/pid.txt`
	rm test/pid.txt

install:
	component install

component:
	component build --out . --name analytics.component --dev

# Runs all the tests on travis.
test: server
	sleep 1
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/core.html
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/providers.html
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/min.html
	make kill

# Runs only the non-minified core tests.
test-core: server
	sleep 1
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/core.html
	make kill

# Runs only the non-minified provider tests.
test-providers: server
	sleep 1
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/providers.html
	make kill

# Opens all the tests in your browser.
test-browser: server
	sleep 1
	open http://localhost:8000/test/core.html
	open http://localhost:8000/test/providers.html
	open http://localhost:8000/test/min.html

# Compiles, minfies, component, and tests analytics.js - wrapped up and good to go.
release: analytics.js min component test



.PHONY: analytics.js