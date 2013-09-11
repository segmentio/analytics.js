
TEST = http://localhost:4200
COMPONENT = node_modules/component/bin/component
UGLIFY = node_modules/uglify-js/bin/uglifyjs
PHANTOM = node_modules/.bin/mocha-phantomjs --setting web-security=false --setting local-to-remote-url-access=true

install: component.json
	$(COMPONENT) install --dev

build: install
	$(COMPONENT) build --dev

analytics.js: install
	$(COMPONENT) build --standalone analytics --out . --name analytics
	$(UGLIFY) analytics.js --output analytics.min.js

clean:
	rm -rf components build analytics.js analytics.min.js

test: build server
	sleep 1
	$(PHANTOM) $(TEST)/core
	$(PHANTOM) $(TEST)/integrations
	make kill

test-browser: build server
	sleep 1
	open $(TEST)/core
	open $(TEST)/integrations

release: clean build analytics.js server
	sleep 1
	$(PHANTOM) $(TEST)/all
	make kill

server:
	node test/server/index.js &

kill:
	kill -9 `cat test/server/.pid.txt`
	rm test/server/.pid.txt

.PHONY: analytics.js build test