min:
	uglifyjs -o analytics.min.js analytics.js

test:
	open test/analyticsjs.html
	open test/providers.html

docs:
	docco analytics.js
	open docs/analytics.html

.PHONY: min test docs
