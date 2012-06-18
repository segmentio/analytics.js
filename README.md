analytics.js
============

A reusable analytics pattern to abstract your analytics providers from
your web application.

## Philosophy

We believe every application should have analytics in-grained into it. The
more data you have about your system and how its being used, the more
prepared you'll be to make product and marketing decisions. Your users will benefit.

A common misconception is that having analytics means tying yourself to a third
party analytics service. This is not true, and only becomes the case when
an analytic providers API is so complicated that you have to write special
logic to support them.

Luckily, there are many analytics services that fit the abstraction we define
in analytics.js, and we welcome implementations of any other providers that fit.

## The API

We tried to keep the abstract API to be as simple as possible.
You 1) recognize visitors, 2) track their actions.

### Identify

```javascript

analytics.track(event, properties);

```

You recognize a visitor on your site. You associate the visitor with specific
traits unique to them.

```javascript

analytics.identify('visitor@gmail.com', {
    'Subscription Plan'   : 'Free',
    'age'                 : 26
});


```

## Track

```javascript

analytics.track(event, properties);

```

A visitor performs an action on your site. You associate specific event properties
with that particular event. It's best to keep the event names as human readable
names, such as Bob "shared on facebook".

```javascript

analytics.track('Played a Song', {
    'Title'       : 'Eleanor Rigby',
    'Artist'      : 'Beatles',
    'Playlist'    : 'Popular'
});


analytics.track('Bought a t-shirt', {
    'Product Title'  : 'Dinosaur Attack',
    'Size'           : 'Medium',
    'revenue'        : 15.99
});

```

## How to Use

### Add analytics.js to your web app

Analytics.js is more of a pattern than a library, but feel free to drop
analytics.js into your web application. You can then use the global
window.analytics object in your web application to identify and track.

### Choose your providers

Simply copy the providers you want from the providers/ folder into your version
of analytics.js. Make sure you add your application specific settings to each provider,
such as apiKey.

Also, add the provider implementation to the list of enabled providers on the bottom
of analytics.js:

```javascript

    var analytics = {

        /**
         * Determines whether analytics is enabled in this session
         * @type {Boolean}
         */
        enabled: true,

        //
        // ADD PROVIDERS HERE
        //

        providers: [

            GOOGLE_ANALYTICS,
            SEGMENT_IO,
            KISSMETRICS,
            MIXPANEL,
            INTERCOM_IO

        ]
    };

```


### Add identifies and tracks in your app code

After you determine what traits and actions you want to track, add identify
statements where you have access to the visitor object. Then, add
track statement whenever the visitor performs actions that are important to you.

If applicable, we recommend tracking actions such as:

* Visitor logging in
* Visitor buying something
* Visitor cancelling a plan
* Visitor unsubscribing
* Visitor upgrading a plan
* VIsitor sharing on social service

as well as any actions that show whether a visitor is engaged versus not. If you're
YouTube this would be "watched video", or if you're Amazon, it would be "bought an item".



## Dealing with Provider Inconsistencies

Google Analytics and Segment.io both track page loads automatically, while
Mixpanel does not. Intercom.io only does identifies, etc.

You'll want to make sure that you understand what each provider does to make
sure you have all your bases covered.



## Implementing New Providers

Implementing new providers is fairly painless. Check the files in the providers/
folder for examples, and send us a pull request once you're done.



