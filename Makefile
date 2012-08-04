release:
	sh release.sh

test:
	open test/index.html

docs:
	docco analytics.js
	docco providers/*.js
	open docs/analytics.html

.PHONY: release test examples docs
