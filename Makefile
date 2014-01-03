
BROWSERS ?= 'ie6..11, chrome, iphone, safari, opera, firefox'
test = http://localhost:4200
component = node_modules/component/bin/component
uglifyjs = node_modules/uglify-js/bin/uglifyjs
phantomjs = node_modules/.bin/mocha-phantomjs --setting web-security=false --setting local-to-remote-url-access=true

default build: build/build.js analytics.js

analytics.js: node_modules components $(shell find lib)
	@$(component) build --standalone analytics --out . --name analytics
	@$(uglifyjs) analytics.js --output analytics.min.js

build/build.js: node_modules components $(shell find lib)
	@$(component) build --dev

clean:
	@rm -rf components build node_modules analytics.js analytics.min.js

components: component.json
	@$(component) install --dev

kill:
	-@test ! -s test/server/pid.txt || kill `cat test/server/pid.txt`
	@rm -f test/server/pid.txt

node_modules: package.json
	@npm install

release: analytics.js test

server: node_modules kill
	@node test/server/index.js &> /dev/null &

test: node_modules build/build.js server
	@sleep 1
	-@$(phantomjs) $(test)
	@make kill

test-browser: node_modules build/build.js server
	@sleep 1
	@open $(test)

coverage: node_modules build/build.js server
	@sleep 1
	@open $(test)/coverage

test-sauce: node_modules build/build.js server
	@sleep 1
	@BROWSERS=$(BROWSERS) node_modules/.bin/gravy --url $(test)

.PHONY: clean kill release server test test-browser test-sauce
