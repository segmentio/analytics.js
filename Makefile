
BROWSERS ?= 'chrome, safari, firefox'
BINS= node_modules/.bin
C= $(BINS)/component
MINIFY = $(BINS)/uglifyjs
DELEGATE= test \
	test-coverage \
	test-browser \
	test-sauce

analytics.js: node_modules components $(shell find lib)
	@$(C) build --standalone analytics --out . --name analytics
	@$(MINIFY) analytics.js --output analytics.min.js

components: component.json
	@$(C) install

node_modules: package.json
	@npm install

$(DELEGATE): analytics.js
	cd test && make $@

clean:
	rm -rf components analytics.js analytics.min.js
	cd test && make $@

.PHONY: clean test test-browser
.PHONY: test-sauce test-coverage
