
2.10.0 / 2015-06-30
===================

 * Move core library out to segmentio/analytics.js-core
   
   This repository is now purely a build repository for Analytics.js. For analytics.js's core library, see [segmentio/analytics.js-core](https://github.com/segmentio/analytics.js-core); for integrations, see the [segment-integrations](https://github.com/segment-integrations) organization.

2.9.1 / 2015-06-11
==================

 * Remove deprecated analytics.js-integrations dependency
 * Update build

2.9.0 / 2015-06-11
==================

 * Pull integrations from individual repositories, located in the [segment-integrations GitHub organization](https://github.com/segment-integrations/). This change should be unnoticeable from a user perspective, but has huge benefits in that excluding integrations from custom builds is now much, much easier, and one integration's test failures will no longer prevent another integration's tests from running.
  
  A noteworthy part of this change: All integrations are now pulled into Analytics.js in `component.json`, using an explicit version number.
In the future this part of the build process is very likely to change to be more of an automatic process, but for now--baby steps.

2.8.25 / 2015-06-03
===================

 * Update build (for real this time)

2.8.24 / 2015-06-03
===================

 * Update build

2.8.23 / 2015-05-27
===================

 * Update component/url dependency to 0.2.0

2.8.22 / 2015-05-22
===================

 * Update build

2.8.21 / 2015-05-22
===================

 * Update build

2.8.20 / 2015-05-22
===================

 * Update build
 * Clean up Makefile

2.8.19 / 2015-05-16
===================

 * Pin all dependencies
 * Bump Node.js engine dependency to 0.12

2.8.18 / 2015-05-14
===================

 * Bump duo-test dependency

2.8.17 / 2015-05-02
===================

 * Build updated

2.8.16 / 2015-05-01
===================

  * Build updated

2.8.15 / 2015-04-29
===================

  * Build updated

2.8.14 / 2015-04-29
===================

  * Build updated

2.8.13 / 2015-04-28
===================

  * Build updated

2.8.12 / 2015-04-23
===================

  * deps: bump top-domain for test cookie deletion fix
  * cookie: bump top-domain to v2 to catch all top domains


2.8.10 / 2015-04-20
===================

  * Build updated

2.8.9 / 2015-04-16
==================
  * Fix conflicts

2.8.8 / 2015-04-16
==================

  * Updating analytics.js-integrations
  * Updating analytics.js-integrations

2.8.7 / 2015-04-09
==================

  * Build updated
  * adding pre-release hook (and make targets for hooks)

2.8.6 / 2015-04-09
==================

  * Build updated

2.8.5 / 2015-04-09
==================

  * Build updated

2.8.4 / 2015-04-02
==================

  * Build updated

2.8.3 / 2015-03-31
==================

  * Build updated

2.8.2 / 2015-03-24
==================

  * Build updated

2.8.1 / 2015-03-20
==================

  * Build updated
  * adding a build phony target

2.8.0 / 2015-03-07
==================

  * group: fix typo
  * entity: add debug warning for memory store
  * test: add fallback to memory tests
  * entity: fallback to memory
  * add memory store
  * entity: fallback to localstorage when cookies are disabled
  * tests: add localstorage fallback tests
  * dist: rebuild
  
2.7.1 / 2015-03-05
==================

  * Updating analytics.js-integrations

2.7.0 / 2015-03-05
==================

  * Attach page metadata to all calls as `context.page`

2.6.13 / 2015-03-04
===================

  * normalize: remove trailing comma
  * dist: rebuild to make tests pass
  * normalize: remove redundant keys from toplevel

2.6.12 / 2015-03-03
===================

  * Release 2.6.11
  * normalize: keep traits in options

2.6.11 / 2015-02-28
==================

  * normalize: keep traits in options

2.6.10 / 2015-02-25
===================

  * Updating analytics.js-integrations

2.6.9 / 2015-02-25
==================

  * Updating analytics.js-integrations

2.6.8 / 2015-02-25
==================

  * Updating analytics.js-integrations

2.6.7 / 2015-02-24
==================

  * Updating analytics.js-integrations
  * removed duplicate .on('initialize') from analytics constructor

2.6.6 / 2015-02-23
==================

  * update integrations


2.6.5 / 2015-02-19
==================

  * analytics: less verbose logging
  * analytics.js: cleanup plan
  * analytics.js: add debugs
  * normalize: dont clobber and add tests
  * analytics: use normalize removing message()
  * add normalize.js


2.6.4 / 2015-02-19
==================

  * Updating analytics.js-integrations

2.6.3 / 2015-02-17
==================

  * plan: .archived -> .enabled

2.6.1 / 2015-02-12
==================

  * user: fix old anonymous id


2.6.0 / 2015-02-09
==================

  * .track(): ignore archived events
  * ._options(): preserve options

2.5.17 / 2015-02-04
===================

  * Updating analytics.js-integrations

2.5.16 / 2015-02-04
===================

  * Updating analytics.js-integrations

2.5.15 / 2015-02-03
===================

  * Updating analytics.js-integrations

2.5.14 / 2015-02-03
===================

  * Updating analytics.js-integrations

2.5.13 / 2015-01-29
===================

  * Updating analytics.js-integrations

2.5.12 / 2015-01-23
===================

  * Updating analytics.js-integrations

2.5.10 / 2015-01-22
===================

  * Updating analytics.js-integrations

2.5.9 / 2015-01-22
==================

  * Updating analytics.js-integrations

2.5.8 / 2015-01-21
==================

  * Updating analytics.js-integrations

2.5.7 / 2015-01-15
==================

  * Updating analytics.js-integrations

2.5.6 / 2015-01-15
==================

  * Updating analytics.js-integrations

2.5.5 / 2015-01-14
==================

  * Updating analytics.js-integrations

2.5.4 / 2015-01-14
==================

  * Updating analytics.js-integrations

2.5.3 / 2015-01-08
==================

  * Fix release

2.5.2 / 2015-01-08
==================

  * Updating analytics.js-integrations

2.5.0 / 2015-01-01
==================

  * update integrations
  * analytics: add setAnonymousId

2.4.21 / 2014-12-11
===================

  * Updating analytics.js-integrations
  * tests: skip svg tests on legacy browsers
  * travis: node 0.11.13
  * trackLink: support svg anchor tags
  * add cross browser tests

2.4.18 / 2014-11-22
===================

  * Updating analytics.js-integrations

2.4.16 / 2014-11-13
===================

  * Updating analytics.js-integrations

2.4.15 / 2014-11-11
==================

  * clean: --force to ignore errs
  * Updating analytics.js-integrations

2.4.14 / 2014-11-06
===================

  * Updating analytics.js-integrations

2.4.10 / 2014-10-27
==================

 * support umd

2.4.9 / 2014-10-25
==================

  * Updating analytics.js-integrations

2.4.7 / 2014-10-21
==================

  * Updating analytics.js integrations to 1.3.2

2.4.6 / 2014-10-17
==================

 * upgrade integrations to 2.3.1

2.4.5 / 2014-10-17
==================

 * upgrade integrations to 2.3

2.4.4 / 2014-10-16
==================

 * upgrade integrations.

2.4.3 / 2014-10-15
==================

  * Merge pull request #407 from segmentio/prevent/duplicates
  * fix: prevent duplicates when cookie cannot be set

2.4.2 / 2014-10-15
==================

  * Merge pull request #406 from segmentio/fix/user-id-reset
  * fix: prevent anonymousId from changing when user id is reset

2.4.1 / 2014-10-14
==================

  * Merge pull request #405 from segmentio/fix/old-anonymous-id
  * fix: old anonymousId is not stringified, use raw cookie
  * Release 2.4.0

2.4.0 / 2014-10-14
==================

  * anonymousId: re-generate when user id changes
  * Merge pull request #401 from segmentio/anonymous-id
  * analytics.reset(): use .logout() to preserve options
  * logout: remove anonymous id
  * parseQuery: add ajs_aid
  * analytics add anonymousId support
  * add User#anonymousId
  * Release 2.3.33

2.3.33 / 2014-10-14
===================

  * upgrade integrations

2.3.33 / 2014-10-10
==================

  * upgrade integrations

2.3.32 / 2014-10-09
===================

  * upgrade integrations

2.3.31 / 2014-10-08
===================

  * history.md: ocd

2.3.30 / 2014-10-07
===================

  * upgrade integrations

2.3.29 / 2014-10-06
===================

  * add reset(), closes #378

2.3.28 / 2014-10-01
===================

  * upgrade integrations


2.3.27 / 2014-09-26
===================

  * upgrade integrations


2.3.26 / 2014-09-26
===================

  * upgrade integrations


2.3.25 / 2014-09-22
===================

  * add node 0.11 notice for now

2.3.24 / 2014-09-17
===================

  * upgrade integrations


2.3.23 / 2014-09-08
===================

  * upgrade integrations


2.3.22 / 2014-09-05
===================

  * upgrade integrations


2.3.21 / 2014-09-04
===================

  * ocd

2.3.20 / 2014-09-04
===================

  * upgrade integrations


2.3.19 / 2014-09-02
===================

  * upgrade integrations


2.3.18 / 2014-09-02
===================

  * upgrade integrations


2.3.17 / 2014-08-28
===================

  * deps: duo 0.7
  * deps: duo 0.7
  * Merge pull request #397 from segmentio/add/anonymous-id
  * add checking for anonymous id in options

2.3.15 / 2014-08-22
==================

 * google adwords: directly pass remarketing option

2.3.14 / 2014-08-22
==================

 * deps: upgrade to duo-test@0.3.x
 * google adwords: switch to async api

2.3.13 / 2014-08-20
==================

 * localstorage fallback: add implementation
 * localstorage fallback: add tests
 * rebuild
 * deps: upgrade to duo 0.7
 * make: dont clean my npm cache :P

2.3.12 / 2014-08-07
==================

 * remove userfox

2.3.11 / 2014-08-07
==================

 * merge a few more fixes (keen.io)

2.3.10 / 2014-07-25
==================

 * Make lots of analytics.js-integrations fixes

2.3.7 / 2014-07-21
==================

 * Merge pull request #390 from segmentio/test/element-error
 * throw helpful error when passing string to `trackLink`, closes #389
 * Merge pull request #386 from segmentio/context
 * add integrations select test
 * add backwards compat options object support

2.3.6 / 2014-07-16
==================

  * upgrade integrations


2.3.5 / 2014-07-16
==================

  * upgrade integrations


2.3.4 / 2014-07-16
==================

  * upgrade integrations


2.3.3 / 2014-07-16
==================

 * fix: History.md

2.3.2 / 2014-07-13
==================

* rebuild

2.3.1 / 2014-07-13
==================

 * deps: remove duo-package
 * make: test-saucelabs -> test-sauce

2.3.0 / 2014-07-11
==================

 * use analytics.js-integrations 1.2.0 which removes plugin.Integration
 * set .analytics on integration instance

2.2.5 / 2014-07-08
==================

 * loosen deps

2.2.4 / 2014-07-08
===================

  * rebuild

2.2.3 / 2014-07-07
===================

  * rebuild

2.2.2 / 2014-06-24
==================

* fix fxn

2.2.1 / 2014-06-24
==================

* fix typo

2.2.0 / 2014-06-24
==================

* bump analytics.js-integrations with bing/bronto fixes

2.1.0 / 2014-06-23
==================

 * add `.add` for test-friendliness
 * make-test: kill the server when done testing
 * tests: add reporter option
 * update readme
 * make-test: make sure we use the correct phantomjs(1)

2.0.1 / 2014-06-13
==================

 * bumping store.js dep to 2.0.0
 * update readme

2.0.0 / 2014-06-12
==================

 * converting to use duo

1.5.12 / 2014-06-11
==================

* bump analytics.js-integrations to 0.9.9

1.5.11 / 2014-06-05
==================

* bump analytics.js-integrations to 0.9.8

1.5.10 / 2014-06-04
==================

 * bump analytics.js-integrations to 0.9.7

1.5.9 / 2014-06-04
==================

 * bump analytics.js-integrations to 0.9.6

1.5.8 / 2014-06-04
==================

 * bump analytics.js-integrations to 0.9.5

1.5.6 / 2014-06-02
==================

 * bump analytics.js-integrations to 0.9.3

1.5.5 / 2014-06-02
==================

 * bump analytics.js-integrations to 0.9.2

1.5.4 / 2014-05-30
==================

 * upgrade integrations to 0.9.1

1.5.3 / 2014-05-29
==================

 * upgrade integrations to 0.9.0

1.5.1 / 2014-05-20
==================

 * update analytics.js-integrations dep for reverting KISSmetrics fixes

1.5.0 / 2014-05-19
==================

 * updating analytics.js-integrations to 0.8.0 for KISSmetrics fixes

1.4.0 / 2014-05-17
==================

 * upgrade integrations to 0.7.0
 * upgrade facade to 0.3.10

1.3.31 / 2014-05-17
==================

 * handle dev envs correctly, closes #359

1.3.30 / 2014-05-07
==================

 * upgrade integrations to 0.6.1 for google analytics custom dimensions and metrics

1.3.28 / 2014-04-29
==================

 * upgrade integrations to 0.5.10 for navilytics fix and mixpanel fix
 * component: upgrade to 0.19.6 and add githubusercontent to remotes

1.3.26 / 2014-04-17
==================

 * upgrade integrations to 0.5.8

1.3.25 / 2014-04-16
==================

 * upgrade integrations to 0.5.6

1.3.24 / 2014-04-15
==================

 * move analytics.js-integration to dev deps

1.3.23 / 2014-04-14
==================

 * upgrade integrations to 0.5.5
 * update querystring to 1.3.0

1.3.22 / 2014-04-11
==================

 * upgrade integrations to 0.5.4

1.3.21 / 2014-04-10
==================

 * add "invoke" event

1.3.20 / 2014-04-07
==================

 * upgrade integrations to 0.5.3

1.3.19 / 2014-04-05
==================

 * upgrade querystring to 1.2.0

1.3.18 / 2014-04-05
==================

 * upgrade integrations to 0.5.1

1.3.17 / 2014-04-04
==================

 * upgrade integrations to 0.5.0
 * fix: add .search to .url when url is pulled from canonical tag
 * tests: upgrade gravy to 0.2.0

1.3.16 / 2014-04-01
==================

 * upgrade integrations to 0.4.14

1.3.15 / 2014-03-26
==================

 * upgrade integrations to 0.4.13

1.3.14 / 2014-03-26
==================

 * upgrade integrations to 0.4.12

1.3.13 / 2014-03-25
==================

 * upgrade integrations to 0.4.11

1.3.12 / 2014-03-19
==================

 * upgrade integrations to 0.4.10

1.3.11 / 2014-03-14
===================

 * upgrade integrations to 0.4.9

1.3.10 / 2014-03-14
===================

 * upgrade integrations to 0.4.8

1.3.9 / 2014-03-14
==================

 * upgrade integrations to 0.4.7

1.3.8 / 2014-03-13
==================

 * upgrade integrations to 0.4.6

1.3.7 / 2014-03-06
==================

 * upgrade integrations to 0.4.5
 * upgrade facade to 0.2.11

1.3.6 / 2014-03-05
==================

 * upgrade integrations to 0.4.4

1.3.4 / 2014-02-26
==================

 * update integrations to 0.4.2

1.3.3 / 2014-02-18
==================

 * upgrade analytics.js-integrations to 0.4.1
 * dont reset ids and traits

1.3.2 / 2014-02-07
==================

 * upgrade analytics.js-integrations to 0.4.0
 * upgrade analytics.js-integration to 0.1.7
 * upgrade facade to 0.2.7
 * fix page url default to check canonical and remove hash

1.3.1 / 2014-01-30
==================

 * upgrade isodate-traverse to `0.3.0`
 * upgrade facade to `0.2.4`
 * upgrade analytics.js-integrations to `0.3.10`

1.3.0 / 2014-01-23
==================

 * update analytics.js-integrations to 0.3.9

1.2.9 / 2014-01-18
==================

* update `analytics.js-integrations` to `0.3.8`
* expose `require()`

1.2.8 / 2014-01-15
==================

* update `analytics.js-integrations` to `0.3.7`
* upgrade `facade` to `0.2.3`

1.2.7 / 2014-01-10
==================

 * update `analytics.js-integrations` to `0.3.6`

1.2.6 - January 3, 2014
-----------------------
* upgrade `component(1)` for json support

1.2.5 - January 3, 2014
-----------------------
* upgrade `analytics.js-integrations` to `0.3.5`
* upgrade `facade` to `0.2.1`

1.2.4 - January 2, 2014
-------------------------
* upgrade `analytics.js-integrations` to `0.3.4`

1.2.3 - December 18, 2013
-------------------------
* fix `facade` dependency

1.2.2 - December 18, 2013
-------------------------
* upgrade `analytics.js-integrations` to `0.3.2`

1.2.1 - December 16, 2013
-------------------------
* add #push, fixes #253

1.2.0 - December 13, 2013
-------------------------
* add [`facade`](https://github.com/segmentio/facade)

1.1.9 - December 11, 2013
-------------------------
* upgrade `analytics.js-integrations` to `0.2.16`
* add `search` to page property defaults

1.1.8 - December 11, 2013
------------------------
* upgrade `analytics.js-integrations` to `0.2.15`
* add [WebEngage](http://webengage.com)
* heap: fallback to user id as handle

1.1.7 - December 4, 2013
------------------------
* upgrade `analytics.js-integrations` to `0.2.13`

1.1.6 - December 2, 2013
------------------------
* update `analytics.js-integrations` to `0.2.12`
* add `entity`
* change `user` to inherit from `entity`
* change `group` to inherit from `entity`

1.1.5 - November 26, 2013
-------------------------
* update `analytics.js-integration` to `0.1.5`
* update `analytics.js-integrations` to `0.2.11`

1.1.4 - November 25, 2013
-------------------------
* fix `page` method properties overload

1.1.3 - November 21, 2013
-------------------------
* update `analytics.js-integrations` to `0.2.10`

1.1.2 - November 21, 2013
-------------------------
* update `analytics.js-integrations` to `0.2.9`

1.1.1 - November 20, 2013
-------------------------
* update `analytics.js-integrations` to `0.2.8`

1.1.0 - November 20, 2013
-------------------------
* add `name` and `category` defaults to `page` method calls
* update `analytics.js-integrations` to `0.2.7`

1.0.9 - November 15, 2013
-------------------------
* update `analytics.js-integrations` to `0.2.6`
* update dependencies

1.0.8 - November 14, 2013
-------------------------
* update `analytics.js-integrations` to `0.2.5`

1.0.7 - November 13, 2013
------------------------
* update `analytics.js-integrations` to `0.2.4`

1.0.6 - November 12, 2013
-------------------------
* update `analytics.js-integrations` to `0.2.3`
* update `analytics.js-integration` to `0.1.4`

1.0.5 - November 12, 2013
-------------------------
* update `analytics.js-integrations` to `0.2.2`
* fix `properties` overload for `page` method

1.0.4 - November 12, 2013
-------------------------
* update `analytics.js-integrations` to `0.2.1`

1.0.3 - November 11, 2013
-------------------------
* update `analytics.js-integrations` to `0.2.0`

1.0.2 - November 11, 2013
-------------------------
* rename the page methods `section` argument to `category`
* update `analytics.js-integration`
* update `analytics.js-integrations`

1.0.1 - November 11, 2013
-------------------------
* change `page` to take a `section`
* update `analytics.js-integration`
* update `analytics.js-integrations`

1.0.0 - November 10, 2013
-------------------------
* change `pageview` method to `page`
* add call to `page` as mandatory to initialize some analytics tools
* remove ability to `initialize` by `key`
* add checking for an integration already being loaded before loading
* add `#use` method for plugins
* add event emitter to `analytics`
* move integrations to [`analytics.js-integrations`](https://github.com/segmentio/analytics.js-integrations)
* add debugging to all integrations
* move integration factory to [`analytics.js-integration`](https://github.com/segmentio/analytics.js-integration)
* Amplitude: rename `pageview` option to `trackAllPages`
* Amplitude: add `trackNamedPages` option
* Google Analytics: add `trackNamedPages` option
* Google Analytics: remove `initialPageview` option
* Keen IO: rename `pageview` option to `trackAllPages`
* Keen IO: add `trackNamedPages` option
* Keen IO: remove `initialPageview` option
* Lytics: remove `initialPageview` option
* Mixpanel: rename `pageview` option to `trackAllPages`
* Mixpanel: add `trackNamedPages` option
* Mixpanel: remove `initialPageview` option
* Olark: rename `pageview` option  to `page`
* Tapstream: remove `initialPageview` option
* Tapstream: add `trackAllPages` option
* Tapstream: add `trackNamedPages` option
* Trak.io: remove `pageview` option
* Trak.io: remove `initialPageview` option
* Trak.io: add `trackNamedPages` option
* Woopra: remove `initialPageview` option

0.18.4 - October 29, 2013
-------------------------
* adding convert-date 0.1.0 support

0.18.3 - October 29, 2013
-------------------------
* hubspot: adding fix for date traits/properties (calvinfo)

0.18.2 - October 28, 2013
-------------------------
* upgrade visionmedia/debug to most recent version, fixes security warnings when cookies are disabled.

0.18.1 - October 28, 2013
-------------------------
* add [Evergage](http://evergage.com), by [@glajchs](https://github.com/glajchs)

0.18.0 - October 24, 2013
-------------------------
* add event emitter
* add `initialize`, `ready`, `identify`, `alias`, `pageview`, `track`, and `group` events and tests
* fix date equality tests

0.17.9 - October 24, 2013
-------------------------
* Google Analytics: fix ip anonymization should come after `create`
* Google Analytics: fix domain to default to `"none"`

0.17.8 - October 14, 2013
-------------------------
* Customer.io: added preliminary `group` support

0.17.7 - October 10, 2013
-------------------------
* propagating traverse isodate fix

0.17.6 - October 7, 2013
------------------------
* added [Yandex Metrica](http://metrika.yandex.com), by [@yury-egorenkov](https://github.com/yury-egorenkov)

0.17.5 - October 2, 2013
------------------------
* fixed bug in `_invoke` not cloning arguments

0.17.4 - September 30, 2013
---------------------------
* added conversion of ISO strings to dates for `track` calls

0.17.3 - September 30, 2013
---------------------------
* fixed bug in key-only initialization

0.17.2 - September 30, 2013
---------------------------
* UserVoice: added `classicMode` option

0.17.1 - September 30, 2013
---------------------------
* UserVoice: fixed bug loading trigger with new widget

0.17.0 - September 30, 2013
---------------------------
* added `debug` method, by [@yields](https://github.com/yields)

0.16.0 - September 27, 2013
---------------------------
* UserVoice: updated integration to handle the new widget

0.15.2 - September 26, 2013
---------------------------
* added Awesomatic, by [@robv](https://github.com/robv)

0.15.1 - September 24, 2013
---------------------------
* fixed bug in `ready` causing it to never fire with faulty settings
* fixed all `ready()` calls to always be async
* cleared ready state after all analytics core `initialize` tests

0.15.0 - September 18, 2013
---------------------------
* Crazy Egg: renamed from `CrazyEgg`
* Google Analytics: changed `universalClient` option to `classic`
* Google Analytics: changed `classic` default to `false`
* Keen IO: changed pageview options defaults to `false`
* LeadLander: changed `llactid` option to human-readable `accountId`* Intercom: make `#IntercomDefaultWidget` the default activator

0.14.3 - September 18, 2013
---------------------------
* exposed `createIntegration` and `addIntegration`

0.14.2 - September 17, 2013
---------------------------
* added [Spinnakr](http://spinnakr.com)

0.14.1 - September 17, 2013
---------------------------
* removed old `Provider` for an `integration` factory

0.14.0 - September 16, 2013
---------------------------
* exposed `group` via the `#group` method
* exposed `user` via the `#user` method
* started caching `group` in cookie and local storage like `user`
* changed `user` and `group` info to always be queried from storage
* bound all `analytics` methods as a singleton
* added `identify(traits, options)` override
* added `timeout` setter method

0.13.2 - September 16, 2013
---------------------------
* added [Rollbar](https://rollbar.com/), by [@coryvirok](https://github.com/coryvirok)

0.13.1 - September 12, 2013
---------------------------
* Olark: added tests for empty emails, names and phone numbers

0.13.0 - September 11, 2013
---------------------------
* converted all integrations and their tests to a cleaner format
* renamed all instances of "provider" to "integration"
* built integration list from their own `name` to avoid bugs
* changed `_providers` array to an `_integrations` map

0.12.2 - September 5, 2013
--------------------------
* added [awe.sm](http://awe.sm)

0.12.1 - September 5, 2013
--------------------------
* UserVoice: fix bug where some installations wouldn't show the tab

0.12.0 - September 4, 2013
--------------------------
* Clicky: fixed custom tracking, added `pageview`

0.11.16 - September 3, 2013
---------------------------
* updated `segmentio/new-date` for old browser support
* Woopra: fixed default pageview properties
* Intercom: cleaned up identify logic and tests

0.11.15 - September 2, 2013
---------------------------
* pinned all dependencies
* added [Inspectlet](https://www.inspectlet.com)
* fixed storage options tests
* AdRoll: added custom data tracking

0.11.14 - August 30, 2013
-------------------------
* bumped version of [`ianstormtaylor/is`](https://github.com/ianstormtaylor/is) for bugfix

0.11.13 - August 29, 2013
-------------------------
* Spinnakr: added global variable for site id
* LeadLander: switched to non `document.write` version
* Customer.io: convert date objects to seconds
* fixed `is.function` bug in old browsers

0.11.12 - August 27, 2013
-------------------------
* cleaned up core
* fixed breaking tests
* removed Bitdeli, by @jtuulos
* updated Woopra to use new tracker, by @billyvg
* added trak.io, by @msaspence
* added `createIntegration` interim method
* added more Lytics options, by @slindberg and @araddon
* added trait alias to trak.io
* added MouseStats, by @Koushan
* added Tapstream, by @adambard
* allow Mixpanel to name users by `username`
* allow GoSquared to name users by `email` or `username`
* make Google Analytics ignored referrers an array
* update Errorception cdn

0.11.11 - August 9, 2013
------------------------
* Added LeadLander

0.11.10 - July 12, 2013
-----------------------
* Added cookieName to Mixpanel options - 0a53afd

0.11.9 - June 11, 2013
----------------------
* Added [Visual Website Optimizer](http://visualwebsiteoptimizer.com/)

0.11.8 - June 10, 2013
----------------------
* Intercom: added `group` support

0.11.7 - June 7, 2013
---------------------
* Fix for cookie domains, now sets to subdomain friendly by default.
* Renaming bindAll -> bind-all

0.11.6 - June 6, 2013
---------------------
* Added `group` support to Preact by [@azcoov](https://github.com/azcoov)
* Fixed `created` bug with userfox
* Changed to new Vero CDN URL
* Fixed bug when initializing unknown providers
* Added `options` object to `pageview` by [@debangpaliwal](https://github.com/devangpaliwal)

0.11.5 - June 3, 2013
---------------------
* Adding segmentio/json temporarily, fixing json-fallback

0.11.4 - May 31, 2013
---------------------
* Updated Intercom's library URL

0.11.3 - May 31, 2013
---------------------
* Added trailing comma fix

0.11.2 - May 30, 2013
---------------------
* Added fix for UserVoice displaying `'null'`
* Added `make clean` before running components (fixes json fallback)

0.11.1 - May 29, 2013
---------------------
* Fixed bug with Google Analytics not tracking integer `value`s

0.11.0 - May 28, 2013
---------------------
* Switched from cookie-ing to localStorage

0.10.6 - May 23, 2013
---------------------
* Moved trait parsing logic to the global level
* Added [Improvely](http://www.improvely.com/)
* Added [Get Satisfaction](https://getsatisfaction.com/)
* Added a `$phone` alias for Mixpanel
* Added the ability to pass a function for the `event` to `trackLink` and `trackForm`

0.10.5 - May 22, 2013
---------------------
* Added [Amplitude](https://amplitude.com/) support
* Fixed improperly parsed cookies

0.10.4 - May 17, 2013
---------------------
* Fixed bug with Google Analytics being ready to soon

0.10.3 - May 15, 2013
---------------------
* Added [Optimizely](https://www.optimizely.com)

0.10.2 - May 14, 2013
---------------------
* Fixed handling of `increments` and `userHash` from `options.Intercom`

0.10.1 - May 14, 2013
---------------------
* Added `identify` to SnapEngage integration

0.10.0 - May 9, 2013
--------------------
* Added `group` method

0.9.18 - May 9, 2013
--------------------
* Added [Preact](http://www.preact.io/) support by [@azcoov](https://github.com/azcoov)

0.9.17 - May 1, 2013
--------------------
* Updated Keen to version 2.1.0

0.9.16 - April 30, 2013
-----------------------
* Fixed bug affecting Pingdom users

0.9.15 - April 30, 2013
-----------------------
* Added identify to UserVoice

0.9.14 - April 29, 2013
-----------------------
* Fixing userfox integration to accept all traits not just signup_date

0.9.13 - April 29, 2013
-----------------------
* Fixing ordering of ignore referrer option in Google Analytics

0.9.12 - April 27, 2013
-----------------------
* Adding support for [userfox](https://www.userfox.com)

0.9.11 - April 26, 2013
-----------------------
* Adding new ignoreReferrer option to Google Analytics provider
* Adding new showFeedbackTab option to BugHerd provider
* Updating UserVoice provider to work with their new snippet(s)
* Fixing Errorception window.onerror binding to be friendlier

0.9.10 - April 17, 2013
-----------------------
* Adding url and title to mixpanel pageviews
* Addiung url and title to keen pageviews

0.9.9 - April 17, 2013
----------------------
* Fixed GoSquared relying on `document.body

0.9.8 - April 16, 2013
----------------------
* Adding support for Pingdom RUM
* Adding support for AdRoll

0.9.7 - April 16, 2013
----------------------
* Fixing LiveChat test
* Updating mixpanel snippet to wait for ready until script loads
* Adding full traits pulled in from identify.

0.9.6 - April 10, 2013
----------------------
* Renaming Provider.options to Provider.defaults
* Adding universal analytics support to Google Analytics

0.9.5 - April 10, 2013
----------------------
* Adding support for new Olark Javascript API functions, see #121

0.9.4 - April 4, 2013
---------------------
* Fixing Uservoice integration
* Fixing ready tests.
* Adding lytics integration by  [@araddon](https://github.com/araddon)
* Adding bower support by  [@jede](https://github.com/jede)

0.9.3 - April 2, 2013
---------------------
* Olark provider now only notifies the operator of track and pageview when the chat box is expanded.

0.9.2 - March 28, 2013
----------------------
* Qualaroo provider now prefers to identify with traits.email over a non-email userId --- makes the survey responses human readable.

0.9.1 - March 28, 2013
----------------------
* Woopra no longer tracks after each identify so that duplicate page views aren't generated.

0.9.0 - March 27, 2013
----------------------
* Changed default Keen IO settings to record all pageviews by default
* Removed Keen IO API Key option since that is no longer used for data "writes" to their API
* Renamed Keen IO projectId to projectToken to match their docs

0.8.13 - March 25, 2013
-----------------------
* Added ability to pass variables into `intercomSettings` via `context.intercom`

0.8.12 - March 25, 2013
-----------------------
* Added [Heap](https://heapanalytics.com)

0.8.11 - March 24, 2013
-----------------------
* Removed [Storyberg](http://storyberg.com/2013/03/18/the-end.html), best of luck guys

0.8.10 - March 14, 2013
------------------
* Added fix for conversion of `company`'s `created` date
* Added extra tests for `trackForm`
* Fixing issue with ClickTale https bug

0.8.9 - March 13, 2013
----------------------
* Migrated to new Intercom Javascript API
* Removed un-used Intercom traits
* Fix bug in `trackForm` when using jQuery

0.8.8 - March 12, 2013
----------------------
* Added `userId` to Errorception metadata
* Made date parsing more lenient (ms & sec) for trait.created

0.8.7 - March 7, 2013
---------------------
* Added [Qualaroo](https://qualaroo.com/)
* Fixed bug with Chartbeat and page load times

0.8.6 - March 7, 2013
---------------------
* Fixed bug in `trackLink` reported by [@quirkyjack](https://github.com/quirkyjack)
* Fixed bug in ClickTale where it didn't create the ClickTaleDiv

0.8.5 - March 7, 2013
---------------------
* Added [Storyberg](http://storyberg.com/) by [@kevinicus](https://github.com/kevinicus)
* Added [BugHerd](http://bugherd.com)
* Added [ClickTale](http://clicktale.com)
* Cleaned up extraneous `require`'s in many providers

0.8.4 - March 5, 2013
---------------------
* Added support for strings for the `created` trait
* Added `load-date` for getting the page's load time

0.8.3 - March 4, 2013
---------------------
* Added [Sentry](https://getsentry.com)
* Added initial pageview support to more providers
* Allowed HubSpot to recognize email `userId`
* Added support for DoubleClick [via Google Analytics](http://support.google.com/analytics/bin/answer.py?hl-en&answer-2444872)

0.8.2 - March 4, 2013
---------------------
* Fixed bug in FoxMetrics provider
* Added queue for providers which don't support ready immediately.

0.8.1 - March 3, 2013
---------------------
* Fixed bug in `trackForm` when submitted via jQuery

0.8.0 - March 1, 2013
---------------------
* Added cookie-ing to keep identity and traits across page loads
* Added `identify` support for Clicky
* Added `identify` support for GoSquared
* Added `identify` support for Woopra
* Updated tracking for Usercycle

0.7.1 - February 26, 2013
-------------------------
* Added Intercom companies by [@adrianrego](https://github.com/adrianrego)
* Added Intercom setting for use_counter
* Fixed Intercom traits passed without a created field

0.7.0 - February 25, 2013
-------------------------
* Switched over to [Component](http://component.io/)

0.6.0 - February 7, 2013
------------------------
* Added `ready` method for binding to when analytics are initialized
* Added [UserVoice](https://www.uservoice.com)
* Added [Perfect Audience](https://www.perfectaudience.com/)
* Added [LiveChat](http://livechatinc.com)
* Fixed Intercom to allow multiple `identify` calls

0.5.1 - February 4, 2013
------------------------
* Merged in fix for Keen IO's branding
* Added fix to `utils.parseUrl()` field `pathname` in IE

0.5.0 - February 1, 2013
------------------------
* Added an `alias` method for merging two user's by ID

0.4.10 - January 30, 2013
-------------------------
* Fixed multiple elements on `trackLink` and `trackForm`
* Fixed CrazyEgg `apiKey` to `accountNumber`
* Fixed Keen to Keen.io


0.4.9 - January 29, 2013
------------------------
* Fixed `alias` and `extend` breaking on non-objects

0.4.8 - January 29, 2013
------------------------
* Fixed `trackForm` timeout by [@Plasma](https://github.com/Plasma)

0.4.7 - January 29, 2013
------------------------
* Added support for Mixpanel's [revenue](https://mixpanel.com/docs/people-analytics/javascript#track_charge) feature
* Added support for KISSmetrics' `"Billing Amount"` property for revenue
* Added support for `revenue` being passed to Google Analytics' `value` property

0.4.6 - January 28, 2013
------------------------
* Added automatic canonical URL support in Google Analytics

0.4.5 - January 25, 2013
------------------------
* Added Intercom widget setting
* Fixed Chartbeat from requiring `body` element to exist

0.4.4 - January 21, 2013
------------------------
* Added [Bitdeli](https://bitdeli.com/) by [@jtuulos](https://github.com/jtuulos)
* Added Mixpanel `$first_name` and `$last_name` aliases by [@dwradcliffe](https://github.com/dwradcliffe)
* Fixed Mixpanel `$last_seen` alias
* Added `parseUrl` util
* Moved GoSquared queue to snippet

0.4.3 - January 20, 2013
------------------------
* Added support for Errorception [user metadata](http://blog.errorception.com/2012/11/capture-custom-data-with-your-errors.html)

0.4.2 - January 18, 2013
------------------------
* Added option to use a properties function in `trackLink` and `trackForm` methods

0.4.1 - January 18, 2013
------------------------
* Added [Keen.io](http://keen.io/) by [@dkador](https://github.com/dkador)
* Added [Foxmetrics](http://foxmetrics.com/) by [@rawsoft](https://github.com/rawsoft)
* Updated Google Analytics to include noninteraction and value added by [@rantav](https://github.com/rantav)
* Moved to expect.js from chai for cross-broser support

0.4.0 - January 18, 2013
------------------------
* Renamed `trackClick` to `trackLink`
* Renamed `trackSubmit` to `trackForm`

0.3.8 - January 18, 2013
------------------------
* Fixed Clicky loading slowly

0.3.7 - January 17, 2013
------------------------
* Added [HitTail](http://hittail.com)
* Added [USERcycle](http://usercycle.com)
* Fixed Travis testing

0.3.6 - January 14, 2013
------------------------
* Added [SnapEngage](http://snapengage.com)

0.3.5 - January 14, 2013
------------------------
* Added `trackClick` and `trackForm` helpers

0.3.4 - January 13, 2013
------------------------
* Upgraded to Mixpanel 2.2 by [@loganfuller](https://github.com/loganfuller)

0.3.3 - January 11, 2013
------------------------
* Added [comScore Direct](http://direct.comscore.com)

0.3.2 - January 11, 2013
------------------------
* Added [Quantcast](http://quantcast.com)
* Fixed breaking issue on Clicky
* Updated Makefile for new providers


0.3.1 - January 11, 2013
------------------------
* Added `label` and `category` support to Google Analytics

0.3.0 - January 9, 2013
-----------------------
* Added [Gauges](http://get.gaug.es/) by [@bdougherty](https://github.com/bdougherty)
* Added [Vero](http://www.getvero.com/)
* Added optional `url` argument to `pageview` method

0.2.5 - January 8, 2013
-----------------------
* Added [Errorception](http://errorception.com/)
* Added [Clicky](http://clicky.com/)
* Fixed IE 7 bug reported by [@yefremov](https://github.com/yefremov)

0.2.4 - January 3, 2013
-----------------------
* Fixed GoSquared trailing comma by [@cmer](https://github.com/cmer)

0.2.3 - January 2, 2013
-----------------------
* Added domain field to GA by [@starrhorne](https://github.com/starrhorne)
* Removed phantom install to get travis working
* Added window._gaq fix in initialize

0.2.2 - December 19, 2012
-------------------------
* Added link query tag support for `ajs_uid` and `ajs_event`
* Added docco, uglify, and phantom to `devDependencies` by [@peleteiro](https://github.com/peleteiro)

0.2.1 - December 18, 2012
-------------------------
* Added the `pageview` method for tracking virtual pageviews
* Added Travis-CI
* Fixed window level objects in customerio and gosquared
* Added for Intercom's "secure" mode by [@buger](https://github.com/buger)
* Removed root references

0.2.0 - December 16, 2012
-------------------------
* Separated providers into separate files for easier maintenance
* Changed special `createdAt` trait to `created` for cleanliness
* Moved `utils` directly onto the analytics object
* Added `extend` and `alias` utils
* Added `settings` defaults for all providers

0.1.2 - December 14, 2012
-------------------------
* Fixed bug with HubSpot calls pre-script load
* Upgraded sinon-chai to use [callWithMatch version](https://github.com/obmarg/sinon-chai/blob/f7aa7eccd6c0c18a3e1fc524a246a50c1a29c916/lib/sinon-chai.js)
* Added [Klaviyo](http://www.klaviyo.com/) by [@bialecki](https://github.com/bialecki)
* Added [HubSpot](http://www.hubspot.com/) by [@jessbrandi](https://github.com/jessbrandi)
* Added [GoSquared](https://www.gosquared.com/) by [@simontabor](https://github.com/simontabor)

0.1.1 - November 25, 2012
-------------------------
* Added "Enhanced Link Attribution" for Google Analytics by [@nscott](https://github.com/nscott)
* Added "Site Speed Sample Rate" for Google Analytics by [@nscott](https://github.com/nscott)

0.1.0 - November 11, 2012
-------------------------
* Added [Olark](http://www.olark.com/)
* Added terse `initialize` syntax
* Added tests for all providers
* Added README
