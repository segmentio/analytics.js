# Analytics.js

Analytics.js makes it easy to collect customer data and send it to many different tools using a single, unified API.

Analytics.js is open source and is one of the libraries that powers [Segment](https://segment.com), the managed, hassle-free way to collect customer data in the browser and beyond.

For our mobile and server-side data collection libraries, check out our [catalog](https://segment.com/catalog/) or our [libraries page](https://segment.com/docs/sources/).

<div align="center">
  <img src="https://user-images.githubusercontent.com/16131737/53617064-61017a80-3b9a-11e9-9bfb-f5163aa85a7c.png"/>
  <p><b><i>You can't fix what you can't measure</i></b></p>
</div>

Analytics helps you measure your users, product, and business. It unlocks insights into your app's funnel, core business metrics, and whether you have product-market fit.

## How to get started

1. **Collect analytics data** from your app(s). Get started through Segment with our [Analytics.js Quickstart](https://segment.com/docs/sources/website/analytics.js/quickstart/).
    - The top 200 Segment companies collect data from 5+ source types (web, mobile, server, CRM, etc.).
2. **Send the data to analytics tools** (for example, Google Analytics, Amplitude, Mixpanel).
    - Over 250+ Segment companies send data to eight categories of destinations such as analytics tools, warehouses, email marketing and remarketing systems, session recording, and more.
3. **Explore your data** by creating metrics (for example, new signups, retention cohorts, and revenue generation).
    - The best Segment companies use retention cohorts to measure product market fit. Netflix has 70% paid retention after 12 months, 30% after 7 years.

[Segment](https://segment.com) collects analytics data and allows you to send it to more than 250 apps (such as Google Analytics, Mixpanel, Optimizely, Facebook Ads, Slack, Sentry) just by flipping a switch. You only need one Segment code snippet, and you can turn integrations on and off at will, with no additional code. [Sign up with Segment today](https://app.segment.com/signup).

### Why?

1. **Power all your analytics apps with the same data**. Instead of writing code to integrate all of your tools individually, send data to Segment, once.

2. **Install tracking for the last time**. We're the last integration you'll ever need to write. You only need to instrument Segment once. Reduce all of your tracking code and advertising tags into a single set of API calls.

3. **Send data from anywhere**. Send Segment data from any device, and we'll transform and send it on to any tool.

4. **Query your data in SQL**. Slice, dice, and analyze your data in detail with Segment SQL. We'll transform and load your customer behavioral data directly from your apps into Amazon Redshift, Google BigQuery, or Postgres. Save weeks of engineering time by not having to invent your own data warehouse and ETL pipeline.

    For example, you can capture data on any app:
    ```js
    analytics.track('Order Completed', { price: 99.84 })
    ```
    Then, query the resulting data in SQL:
    ```sql
    select * from app.order_completed
    order by price desc
    ```

### 🚀 Startup Program

<div align="center">
  <a href="https://segment.com/startups"><img src="https://user-images.githubusercontent.com/16131737/53128952-08d3d400-351b-11e9-9730-7da35adda781.png" /></a>
</div>

If you are part of a new startup  (&lt;$5M raised, &lt;2 years since founding), we just launched a new startup program for you. You can get a Segment Team plan  (up to <b>$25,000 value</b> in Segment credits) for free up to 2 years — <a href="https://segment.com/startups/">apply here</a>!

## Documentation

First, read the [Analytics.js QuickStart](https://segment.com/docs/sources/website/analytics.js/quickstart/), which contains installation instructions and a brief overview of what Analytics.js does and how it works.

For more detail on the Analytics.js API, check out the [Analytics.js Library Reference](https://segment.com/docs/sources/website/analytics.js/).

## Analytics.js for Platforms

Analytics.js for Platforms is a version of analytics.js built specifically for website creation and e-commerce platforms to give their customers one-click enablement of Google Analytics, Facebook Pixel, Google Adwords, and Segment. For more information, you can check out the [docs for Analytics.js for Platforms](https://segment.com/docs/guides/partners/analyticsjs-for-platforms/). Segment hosts this version of the library for free use on its CDN.

## Using this Repo

This repository houses a pre-built, open-source version of analytics.js. If you'd like to use Analytics.js outside of Segment but don't need to customize your build, pre-built [unminified][] or [minified][] versions of analytics.js found in the root of this repository. Once you've done that, you'll want to mimic the Segment snippet on your website by stubbing out its methods on the `window` and downloading your built version of the script asynchronously. For an example of doing that and initializing your integrations with options, [see here](https://gist.github.com/cyberwombat/11008970).

If you're looking to produce a custom build of Analytics.js with just the plugins you need, see [the wiki page for building a custom distribution][].

## Contributing to Analytics.js and its Ecosystem of Integration Plugins

The core logic of analytics.js is broken out into individual repositories:

- To report an issue with analytics.js itself, head over to [analytics.js-core][], where the core analytics.js logic is maintained.
- To report an issue with an integration plugin. head over to the [analytics.js-integrations][] organization, where we keep each integration plugin in its own repository.
- **To build a custom integration plugin for analytics.js, check out the [wiki][]. To distribute your plugin as a component of an integration in our [catalog][], check out our [partner docs].**

If you're not sure where to open an issue, feel free to open an issue against this repository or [contact us](https://segment.com/contact) and we'll help point you in the right direction.

[analytics.js]: https://github.com/segmentio/analytics.js
[unminified]: https://github.com/segmentio/analytics.js/blob/master/analytics.js
[minified]: https://github.com/segmentio/analytics.js/blob/master/analytics.min.js
[analytics.js quickstart]: https://segment.com/docs/sources/website/analytics.js/quickstart/

## License

Released under the [MIT license](License.md).

[analytics.js library reference]: https://segment.com/docs/libraries/analytics.js
[analytics.js quickstart]: https://segment.com/docs/sources/website/analytics.js/quickstart/
[analytics.js-core]: https://github.com/segmentio/analytics.js-core
[analytics.js-integrations]: https://github.com/segment-integrations?q=analytics.js-integration
[ci-badge]: https://travis-ci.org/segmentio/analytics.js.png?branch=master
[ci-link]: https://travis-ci.org/segmentio/analytics.js
[integrations]: https://segment.com/integrations
[libraries]: https://segment.com/libraries
[nodejs.org]: https://nodejs.org/
[spec]: https://segment.com/docs/spec/
[catalog]: https://segment.com/catalog
[partner docs]: https://segment.com/docs/partners
[wiki]: https://github.com/segmentio/analytics.js/wiki/Writing-Integrations
[the wiki page for building a custom distribution]: https://github.com/segmentio/analytics.js/wiki/Building-A-Custom-Distribution
