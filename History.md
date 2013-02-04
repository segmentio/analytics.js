0.5.1 / 2013-2-4
=================

* Merging in fix for Keen IO's branding

0.5.0 / 2013-2-1
=================

* Added an `alias` method for merging two user's by ID

0.4.10 / 2013-1-30
=================

* Fix for multiple elements on `trackLink` and `trackForm`
* Fix for CrazyEgg `apiKey` to `accountNumber`
* Fix for Keen to Keen.io


0.4.9 / 2013-1-29
=================

* Fix for `alias` and `extend` breaking on non-objects

0.4.8 / 2013-1-29
=================

* Fix for `trackForm` timeout by [@Plasma](https://github.com/Plasma)

0.4.7 / 2013-1-29
=================

* Added support for Mixpanel's [revenue](https://mixpanel.com/docs/people-analytics/javascript#track_charge) feature
* Added support for KISSmetrics' `"Billing Amount"` property for revenue
* Added support for `revenue` being passed to Google Analytics' `value` property

0.4.6 / 2013-1-28
=================

* Automatically handle canonical URLs in Google Analytics

0.4.5 / 2013-1-25
=================

* Add Intercom widget setting
* Fix for Chartbeat required `body` element to exist

0.4.4 / 2013-1-21
=================

* [Bitdeli] support added by [@jtuulos](https://github.com/jtuulos)
* Mixpanel `$first_name` and `$last_name` aliases added by [@dwradcliffe](https://github.com/dwradcliffe)
* Fixed Mixpanel `$last_seen` alias
* Added `parseUrl` util
* Moving gosquared queue to snippet

0.4.3 / 2013-1-20
=================

* Added support for Errorception user metadata

0.4.2 / 2013-1-18
=================

* Added option to use a properties function in `trackLink` and `trackForm` methods

0.4.1 / 2013-1-18
=================

* [Keen.io](http://keen.io/) added by [@dkador](https://github.com/dkador)
* [Foxmetrics](http://foxmetrics.com/) added by [@rawsoft](https://github.com/rawsoft)
* Updated Google Analytics to include noninteraction and value added by [@rantav](https://github.com/rantav)
* Moving over to expect.js from chai for cross-broser support.

0.4.0 / 2013-1-18
=================

* Rename `trackClick` to `trackLink`
* Rename `trackSubmit` to `trackForm`

0.3.8 / 2013-1-18
=================

* Fix for Clicky loading slowly

0.3.7 / 2013-1-17
=================

* [HitTail](http://hittail.com) support added
* [USERcycle](http://usercycle.com) support added
* Travis testing fixed

0.3.6 / 2013-1-14
=================

* [SnapEngage](http://snapengage.com) support added

0.3.5 / 2013-1-14
=================

* Added `trackClick` and `trackForm` helpers

0.3.4 / 2013-1-13
=================

* Upgrade to Mixpanel 2.2 by [@loganfuller](https://github.com/loganfuller)

0.3.3 / 2013-1-11
=================

* [comScore Direct](http://direct.comscore.com) support added

0.3.2 / 2013-1-11
=================

* [Quantcast](http://quantcast.com) support added
* Fixed breaking issue on Clicky
* Updated Makefile for new providers


0.3.1 / 2013-1-11
=================

* Added `label` and `category` support to Google Analytics

0.3.0 / 2013-1-9
================

* [Gauges](http://get.gaug.es/) support added by [@bdougherty](https://github.com/bdougherty)
* [Vero](http://www.getvero.com/) support added
* Added optional `url` argument to `pageview` method

0.2.5 / 2013-1-8
================

* [Errorception](http://errorception.com/) support added
* [Clicky](http://clicky.com/) support added
* IE 7 fix reported by [@yefremov](https://github.com/yefremov)

0.2.4 / 2013-1-3
================

* GoSquared trailing comma fix by [@cmer](https://github.com/cmer)

0.2.3 / 2013-1-2
================

* Added domain field to GA by [@starrhorne](https://github.com/starrhorne)
* Removing phantom install to get travis working
* Adding window._gaq fix in initialize.

0.2.2 / 2012-12-19
==================

* Added link query tag support for `ajs_uid` and `ajs_event`
* Added docco, uglify, and phantom to devDependencies by [@peleteiro](https://github.com/peleteiro)

0.2.1 / 2012-12-18
==================

* Added the `pageview` method for tracking virtual pageviews
* Added Travis-CI
* Fixed window level objects in customerio and gosquared
* Support added for Intercom's "secure" mode by [@buger](https://github.com/buger)
* Removed root references


0.2.0 / 2012-12-16
==================

* Separated providers into separate files for easier maintenance
* Changed special `createdAt` trait to `created` for cleanliness
* Moved `utils` directly onto the analytics object
* Added `extend` and `alias` utils
* Added `settings` defaults for all providers


0.1.2 / 2012-12-14
==================

* Fixed bug with HubSpot calls pre-script load
* Upgraded sinon-chai to use [callWithMatch version](https://github.com/obmarg/sinon-chai/blob/f7aa7eccd6c0c18a3e1fc524a246a50c1a29c916/lib/sinon-chai.js)
* [Klaviyo](http://www.klaviyo.com/) support added by [@bialecki](https://github.com/bialecki)
* [HubSpot](http://www.hubspot.com/) support added by [@jessbrandi](https://github.com/jessbrandi)
* [GoSquared](https://www.gosquared.com/) support added by [@simontabor](https://github.com/simontabor)


0.1.1 / 2012-10-25
==================

* Enhanced Link Attribution added for Google Analytics by [@nscott](https://github.com/nscott)
* Site Speed Sample Rate added for Google Analytics by [@nscott](https://github.com/nscott)


0.1.0 / 2012-10-11 
==================

* [Olark](http://www.olark.com/) support added
* Added terse `initialize` syntax
* Added tests for all providers
* Added README

