
#
# Task args.
#

BROWSER ?= chrome,firefox,safari
TESTS = $(wildcard test/*.js)
SRC = $(wildcard lib/*.js)
MINIFY = $(BINS)/uglifyjs
PID = test/server/pid.txt
BINS = node_modules/.bin
BUILD = build.js
DUO = $(BINS)/duo
DUOT = $(BINS)/duo-test

#
# Default target.
#

default: test

#
# Clean.
#

clean:
	@rm -rf components $(BUILD)
	@rm -f analytics.js analytics.min.js
	@rm -rf node_modules npm-debug.log

#
# update version
#

version: component.json
	@node bin/version

#
# Test with phantomjs.
#

test: $(BUILD)
	@$(DUOT) phantomjs test/server

#
# Test with saucelabs
#

test-sauce: $(BUILD)
	@$(DUOT) saucelabs test/server \
		--browsers $(BROWSER) \
		--title analytics.js

#
# Test in the browser.
#
# On the link press `cmd + doubleclick`.
#

test-browser: $(BUILD)
	@$(DUOT) browser default

#
# Phony targets.
#

.PHONY: clean
.PHONY: test
.PHONY: test-browser
.PHONY: test-coverage
.PHONY: test-sauce

#
# Target for `analytics.js` file.
#

analytics.js: node_modules $(SRC) version
	@$(DUO) --standalone analytics lib/index.js > analytics.js
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
	@$(DUO) --development test/tests.js > $(BUILD)
