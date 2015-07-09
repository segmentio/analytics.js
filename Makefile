#
# Binaries.
#

DUO = node_modules/.bin/duo
ESLINT = node_modules/.bin/eslint
UGLIFYJS = node_modules/.bin/uglifyjs

#
# Files.
#

SRC = $(wildcard lib/*.js)

#
# Chore tasks.
#

# Install node dependencies.
node_modules: package.json $(wildcard node_modules/*/package.json)
	@npm install
	@touch node_modules

# Remove temporary/built files.
clean:
	rm -rf *.log analytics.js analytics.min.js
.PHONY: clean

# Remove temporary/built files and vendor dependencies.
distclean: clean
	rm -rf components node_modules
.PHONY: distclean

#
# Build tasks.
#

# Build analytics.js.
analytics.js: node_modules $(SRC) package.json
	@$(DUO) --stdout --standalone analytics lib/index.js > $@

# Build minified analytics.js.
analytics.min.js: analytics.js
	@$(UGLIFYJS) $< --output $@

# Build shortcut.
build: analytics.min.js
.PHONY: build

#
# Test tasks.
#

# Lint JavaScript source.
lint: node_modules
	@$(ESLINT) $(SRC)
.PHONY: lint
