min:
	uglifyjs -o analytics.min.js analytics.js

server:
	python -m SimpleHTTPServer 8000

test:
	open http://localhost:8000/test/analyticsjs.html
	open http://localhost:8000/test/providers.html

docs:
	docco analytics.js
	open docs/analytics.html

.PHONY: min server docs test
