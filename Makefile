release:
	sh release.sh

test:
	open spec/index.html

docs:
	docco analytics.js
	docco providers/*.js
	open docs/base.html

.PHONY: release test examples docs
