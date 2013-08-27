
PHANTOM = node_modules/.bin/mocha-phantomjs
PHANTOM_OPTS = --setting web-security=false --setting local-to-remote-url-access=true

install: component.json
	component install --dev

build: install
	component build --dev

analytics.js: install
	component build --standalone analytics --out . --name analytics
	uglifyjs -o analytics.min.js analytics.js

clean:
	rm -rf components build

test: build server
	sleep 1
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/core
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/providers
	make kill

test-browser: build server
	sleep 1
	open http://localhost:8000/core
	open http://localhost:8000/providers

release: clean analytics.js
	sleep 1
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:8000/min
	make kill

server:
	node test/server/index.js &

kill:
	kill -9 `cat test/server/.pid.txt`
	rm test/server/.pid.txt

.PHONY: analytics.js clean test