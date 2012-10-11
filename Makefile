test:
	open test/analyticsjs.html
	open test/providers.html

docs:
	docco analytics.js
	open docs/analytics.html

.PHONY: test docs
