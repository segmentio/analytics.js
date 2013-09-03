
PORT = 4200
PHANTOM = node_modules/.bin/mocha-phantomjs
PHANTOM_OPTS = --setting web-security=false --setting local-to-remote-url-access=true

install: component.json
	./node_modules/component/bin/component install --dev

build: install
	./node_modules/component/bin/component build --dev

analytics.js: install
	./node_modules/component/bin/component build --standalone analytics --out . --name analytics
	uglifyjs -o analytics.min.js analytics.js

clean:
	rm -rf components build

test: build server
	sleep 1
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:$(PORT)/core
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:$(PORT)/providers
	make kill

test-browser: build server
	sleep 1
	open http://localhost:$(PORT)/core
	open http://localhost:$(PORT)/providers

release: clean build analytics.js server
	sleep 1
	$(PHANTOM) $(PHANTOM_OPTS) http://localhost:$(PORT)/min
	make kill

server: kill
	node test/server/index.js &

kill:
	kill -9 `cat test/server/.pid.txt`
	rm test/server/.pid.txt

.PHONY: analytics.js clean test