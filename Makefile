#
# Binaries.
#

BINS = ./node_modules/.bin
DUO = $(BINS)/duo
DUOT = $(BINS)/duo-test
UGLIFYJS = $(BINS)/uglifyjs

#
# Files.
#

TESTS = $(wildcard test/*.js)
SRC = $(wildcard lib/*.js)
BUILD = build.js

#
# Task arguments.
#

BROWSER ?= ie:9

PORT ?= 0

DUO_ARGS = --stdout

DUOT_ARGS = \
	--pathname test/server \
	--reporter spec \
	--port $(PORT) \
	--commands "make build.js"

#
# Git hooks.
#

HOOKS := $(addprefix .git/hooks/, $(notdir $(wildcard bin/hooks/*)))

#
# Chore tasks.
#

# Install node dependencies.
node_modules: package.json $(wildcard node_modules/*/package.json)
	@npm install

# Remove temporary/built files.
clean:
	@rm -rf $(BUILD) *.log analytics.js analytics.min.js components
.PHONY: clean

# Remove temporary/built files and vendor dependencies.
distclean: clean
	@rm -rf components node_modules
.PHONY: distclean

# Remove git hooks.
clean-hooks:
	@rm $(HOOKS)
.PHONY: clean-hooks

# Install an individual Git hook.
.git/hooks/%: bin/hooks/%
	@ln -s $(abspath $<) $@

# Install all Git hooks.
hooks: $(HOOKS)
.PHONY: hooks

#
# Build tasks.
#

# Build analytics.js.
analytics.js: node_modules $(SRC) package.json
	@$(DUO) $(DUO_ARGS) --standalone analytics lib/index.js > $@

# Build minified analytics.js.
analytics.min.js: analytics.js
	@$(UGLIFYJS) $< > $@

# Target for build files.
# TODO: Document this one better
$(BUILD): analytics.js analytics.min.js $(TESTS)
	@$(DUO) $(DUO_ARGS) --development test/tests.js > $(BUILD)

# $(BUILD) shortcut.
build: $(BUILD)
.PHONY: build

#
# Test tasks.
#

# Test locally in PhantomJS.
test: $(BUILD)
	@$(DUOT) $(DUOT_ARGS) phantomjs
.PHONY: test
.DEFAULT_GOAL = test

# Test locally in the browser.
test-browser: $(BUILD)
	@$(DUOT) browser
.PHONY: test-browser

# Test with Sauce Labs.
test-sauce: $(BUILD)
	@$(DUOT) $(DUOT_ARGS) saucelabs \
		--browsers $(BROWSER) \
		--title analytics.js
.PHONY: test-sauce

#
# Deprecated/legacy tasks.
#

clean-deps: distclean
.PHONY: clean-deps
