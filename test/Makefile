
BINS= ../node_modules/.bin
BROWSERS ?= 'chrome, safari'
TEST= http://localhost:4200
C= $(BINS)/component
GRAVY=$(BINS)/gravy
PHANTOMJS= $(BINS)/mocha-phantomjs \
  --setting local-to-remote-url-access=true \
  --setting-web-security=false

build: components
	@$(C) build --standalone dev

components: component.json
	@$(C) install

server: kill
	@node server &> /dev/null &
	@sleep 1

test: build server
	@$(PHANTOMJS) $(TEST)
	-@make kill

test-browser: build server
	@open $(TEST)

test-coverage: build server
	@open $(TEST)/coverage

test-sauce: build server
	@BROWSERS=$(BROWSERS) $(GRAVY) --url $(TEST)

clean: kill
	rm -rf components build

kill:
	-@test -e server/pid.txt \
		&& kill `cat server/pid.txt` \
		&& rm -f server/pid.txt

.PHONY: test-sauce test-coverage
.PHONY: test-browser test clean
