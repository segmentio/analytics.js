dist: dist/analytics.min.js

dist/analytics.js: analytics.js
	reunion --ns analytics $< > $@

# minification courtesy of googlz
dist/analytics.min.js: dist/analytics.js
	curl --data-urlencode "js_code@$<" \
		-d "output_info=compiled_code&compilation_level=SIMPLE_OPTIMIZATIONS" \
		http://closure-compiler.appspot.com/compile > $@

test:
	open test/analyticsjs.html
	open test/providers.html

docs:
	docco analytics.js
	open docs/analytics.html

.PHONY: min test docs
