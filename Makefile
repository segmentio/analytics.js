
#
# Task args.
#

TESTS = $(wildcard test/*.js)
TEST = http://localhost:4200
SRC = $(wildcard lib/*.js)
MINIFY = $(BINS)/uglifyjs
PID = test/server/pid.txt
BINS = node_modules/.bin
BUILD = build/build.js
DUO = $(BINS)/duo

PHANTOM= $(BINS)/mocha-phantomjs \
	--setting local-to-remote-url-access=true \
	--setting-web-security=false \
	--path $(BINS)/phantomjs

#
# Default target.
#

default: test

#
# Clean.
#

clean: kill
	@-rm -rf components build
	@-rm analytics.js analytics.min.js
	@-rm -rf node_modules npm-debug.log
	@-npm cache clean

#
# Test with phantomjs.
#

test: $(TESTS) server
	@$(PHANTOM) $(TEST)

#
# Test in the browser.
#
# On the link press `cmd + doubleclick`.
#

test-browser: $(TESTS) server
	@echo open $(TEST)

#
# Start the test server.
#

server: $(BUILD) kill
	@node test/server &> /dev/null &
	@sleep 1

#
# Kill the test server.
#

kill:
	@-test -e $(PID) \
		&& kill `cat $(PID)` \
		&& rm -f $(PID) \
		||:

#
# Absolutely make sure the test server is off.
#

kill-all:
	@-kill -9 $(shell pgrep -f "test/server")

#
# Phony targets.
#

.PHONY: clean
.PHONY: kill
.PHONY: kill-all
.PHONY: test
.PHONY: test-browser
.PHONY: test-coverage
.PHONY: test-sauce

#
# Target for `analytics.js` file.
#

analytics.js: node_modules $(SRC)
	@$(DUO) --global analytics lib/index.js > analytics.js
	@$(MINIFY) analytics.js --output analytics.min.js

#
# Target for `node_modules` folder.
#

node_modules: package.json
	@npm install

#
# Target for build files.
#

$(BUILD): $(TESTS) analytics.js
	@$(DUO) --development test/tests.js $(BUILD)
