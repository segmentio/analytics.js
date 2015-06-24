This repo should be kept in sync with upstream segment version.  The only thing we change here is component.json.  The dependency for `analytics.js-integrations` should point to our fork on github (astronomer branch).

To Build:
-   Make sure our fork of `analytics.js-integrations` `astronomer` branch is up to date.
-   `make clean && make build`