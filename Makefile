
BROWSERS ?= 'chrome, safari, firefox'
BINS= node_modules/.bin
C= $(BINS)/component
MINIFY = $(BINS)/uglifyjs

analytics.js: node_modules components $(SRC)
	@$(C) build --standalone analytics --out . --name analytics
	@$(MINIFY) analytics.js --output analytics.min.js

components: component.json
	@$(C) install

node_modules: package.json
	@npm install

test: analytics.js
	cd test && make $@

test-browser: analytics.js
	cd test && make $@

test-coverage: analytics.js
	cd test && make $@

test-sauce: analytics.js
	cd test && make $@

clean:
	rm -rf components analytics.js analytics.min.js
	cd test && make $@

.PHONY: clean test test-browser
.PHONY: test-sauce test-coverage
