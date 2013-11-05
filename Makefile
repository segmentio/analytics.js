
test = http://localhost:4200
component = node_modules/component/bin/component
uglifyjs = node_modules/uglify-js/bin/uglifyjs
phantomjs = node_modules/.bin/mocha-phantomjs --setting web-security=false --setting local-to-remote-url-access=true

default build: build/build.js


# Reals
analytics.js: node_modules components $(shell find lib)
	@$(component) build --standalone analytics --out . --name analytics
	@$(uglifyjs) analytics.js --output analytics.min.js

build/build.js: node_modules components $(shell find lib)
	@$(component) build --dev

components: component.json
	@$(component) install --dev

node_modules: package.json
	@npm install


# Phonies
clean:
	@rm -rf components build node_modules

kill:
	@test ! -s test/server/.pid.txt || kill -9 `cat test/server/.pid.txt`
	@rm -f test/server/.pid.txt

server: node_modules kill
	@node test/server/index.js &

release: test-release

test: node_modules build/build.js server
	@sleep 1
	-@$(phantomjs) $(test)/core
	-@$(phantomjs) $(test)/integrations
	@make kill

test-browser: node_modules build/build.js server
	@sleep 1
	@open $(test)/core
	@open $(test)/integrations

test-release: node_modules analytics.js build/build.js server
	@sleep 1
	-@$(phantomjs) $(test)/all
	@make kill

.PHONY: clean kill install release server test test-browser
