min:
	uglifyjs -o analytics.min.js analytics.js

test:
	python -m SimpleHTTPServer 8000

docs:
	docco analytics.js
	open docs/analytics.html

.PHONY: min test docs
