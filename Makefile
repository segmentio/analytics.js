
#
# Task args.
#

PORT ?= 0
BROWSER ?= ie:9
TESTS = $(wildcard test/*.js)
SRC = $(wildcard lib/*.js)
MINIFY = $(BINS)/uglifyjs
PID = test/server/pid.txt
BINS = node_modules/.bin
BUILD = build.js
DUO = $(BINS)/duo
DUOT = $(BINS)/duo-test -p test/server -R spec -P $(PORT) -c "make build.js"

#
# Git hooks.
#

HOOKS := $(addprefix .git/hooks/, $(notdir $(wildcard bin/hooks/*)))

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
	@rm -rf npm-debug.log

clean-deps:
	@rm -rf node_modules

clean-hooks:
	@rm $(HOOKS)

#
# Test with phantomjs.
#

test: $(BUILD)
	@$(DUOT) phantomjs

#
# Test with saucelabs
#

test-sauce: $(BUILD)
	@$(DUOT) saucelabs \
		--browsers $(BROWSER) \
		--title analytics.js

#
# Test in the browser.
#
# On the link press `cmd + doubleclick`.
#

test-browser: $(BUILD)
	@$(DUOT) browser

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

analytics.js: node_modules $(SRC) package.json
	@$(DUO) --standalone analytics lib/index.js > $@

analytics.min.js: analytics.js
	@$(MINIFY) $< --output $@

#
# Target for `node_modules` folder.
#

node_modules: package.json
	@npm install

#
# Target for build files.
#

$(BUILD): $(TESTS) analytics.js analytics.min.js
	@$(DUO) --development test/tests.js > $(BUILD)

#
# Phony build target
#

build: $(BUILD)
.PHONY: build

#
# Git hooks.
#

hooks: $(HOOKS)
.PHONY: hooks

.git/hooks/%: bin/hooks/%
	@ln -s $(abspath $<) $@
