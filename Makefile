
PHANTOM = node_modules/.bin/mocha-phantomjs
PHANTOM_OPTS = --setting web-security=false --setting local-to-remote-url-access=true

release: clean build analytics.js test

analytics.js: install
	component build --standalone analytics --out . --name analytics
	uglifyjs -o analytics.min.js analytics.js

server:
	node test/server.js &

install: component.json
	component install --dev

build: install
	component build --dev

clean:
	rm -rf components build

test: build server
	sleep 1
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/core.html
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/test/providers.html
	make kill

test-browser: build server
	sleep 1
	open http://localhost:8000/test/core.html
	open http://localhost:8000/test/providers.html

kill:
	kill -9 `cat test/pid.txt`
	rm test/pid.txt

.PHONY: analytics.js clean test