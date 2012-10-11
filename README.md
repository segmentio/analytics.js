
analytics.js
============
**Every project needs analytics.** The more you know about how your system is being used, the better your product decisions will be. In the end your users will benefit.

But having analytics shouldn't mean your tying yourself to a single third-party analytics service and littering your codebase third-party-specific calls. Changing or adding new providers should be a snap. That's where **analytics.js** comes in. The APIs for most analytics services track the same sorts of metrics, so it's not hard to build an abstraction layer that fits most use cases. And that's what we did! We even use **analytics.js** on [Segment.io](https://segment.io).

The API is dead simple. You won't want to go back to using some of those unfriendly third-party APIs!



## The API
Our goal for the API was to iron out the kinks that crop up in lots of third-party analytics services API's. Keep things clean!

### initialize()
When you're ready to start using **analytics.js**, you make a call to initialize with the analytics providers you want to enable and the settings each one needs. That looks like this:

```javascript
analytics.identify(userId, [traits]);
```

+ `providers` _object_ - a list of analytics providers to enable.

```javascript
analytics.initialize({
    'Google Analytics' : {
        apiKey : 'UA-XXXXXX-XX'
    },
    'Segment.io' : {
        apiKey : 'XXXXXXXXXXX'
    },
    'KISSmetrics' : {
        apiKey : 'XXXXXXXXXXX'
    },
    'Mixpanel' : {
        apiKey : 'XXXXXXXXXXX',
        people : true
    }
});
```

Every analytics provider takes an `apiKey` for your project. The other settings are provider-specific. Check out the [provider-specific](#provider-specific-settings) reference for details. 

For an even terser syntax, if you're only passing an `apiKey` you can pass a string instead of an object:

```javascript
analytics.initialize({
    'Google Analytics' : 'UA-XXXXXX-XX',
    'Segment.io'       : 'XXXXXXXXXX',
    'KISSmetrics'      : 'XXXXXXXXXX'
});
```

Did we mention this means you never need to mess with analytics snippets again? Bonus!


### identify()
Identify is how you tie a user to their actions. You **identify** your user with the `userId` you recognize them by, which is usually an email. The API looks like this:

```javascript
analytics.identify(userId, [traits]);
```

+ `userId` _string_ - is the ID you refer to your user by.
+ `traits` _object, optional_ - is an _optional_ dictionary of things you know about the user. Things like: **Subscription Plan**, **Friend Count**, **Age**, etc.

```javascript
analytics.identify('achilles@segment.io', {
    'Subscription Plan' : 'Gold',
    'Friend Count'      : 29
});
```

We usually recommend using a backend template to inject an identify with the `userId` straight into the footer of every page of your application. That way no matter what page the user lands on, the call is made.


### track()
Track is how you record events your users trigger. Whenever your using does something you want to record, **track** that event. The API looks like this:

```javascript
analytics.track(event, [properties]);
```

+ `event` _string_ - is the name of the event.
+ `properties` _object, optional_ - is an _optional_ dictionary of properties for the event. If the event was **Added to Shopping Cart**, it might have properties like **Price**, **Product Category**, etc.

```javascript
analytics.track('Purchased an Item', {
    'Price'    : 40.20,
    'Shipping' : '2-day'
});
```


## How to use analytics.js

1. Grab the latest version of **analytics.js** from this repo and add it to your project.

1. Initialize **analytics.js**.

1. Add an **analytics.identify()** call to tag your user and some **analytics.track()** calls for the events you want to record.

1. Spend all day swapping your analytics providers in and out just because you can! Woo!


## Questions

#### Where should I put the identify call?
We usually recommend using a backend template to inject an identify with the `userId` straight into the footer of every page of your application. That way no matter what page the user lands on, the call is made.

#### What traits should I record?
The single most important trait to record is something like **Membership Level** or **Subscription Type** or however you break your users into different tiers. That way, you can focus on getting people into the higher tiers.

Other things you might want to **identify** are things like **Friend Count**, **Company**, **Business Type**, **Employee Count**, etc.

#### What events should I track?
The best way to figure out what events to track is to ask your to questions: "what do I want my users to do more of?" and "what do i want my users to do less of?". For example:

+ Completed Purchase
+ Upgraded Plan
+ Shared on Facebook
+ Watched a Video
+ Invited a Friend

or

+ Cancelled their Account
+ Unsuscribed
+ Downgraded Plan
+ Left Negative Review

#### Google Analytics doesn't have traits! ... Intercom doesn't have events!
That's all right. If a provider doesn't handle a certain method, you can still call it and nothing will break. You don't have to worry about anything.


## Contributing
We love contributions! If you have a provider you'd like to add, feel free to submit a pull request. Providers are community maintained! You can check out the providers that we've already written for guidance. (Make sure to add tests!)


## Provider-specific Settings

Every provider takes an `apiKey` for your project. Other providers might take custom settings.

### Google Analtyics

* `apiKey` - your project's API key.

### Segment.io

* `apiKey` - your environment's API key.

_All settings are passed directly to the second argument of Segment.io's `initialize` method._

### KISSmetrics

* `apiKey` - your project's API key.

### Mixpanel

* `apiKey` - your project's API key.

* `people` - a _boolean_ of whether you want to use Mixpanel's "People" feature. Only set this to `true` if you do, or you might get charged for it. Defaults to `false`.

_All settings are passed directly to the second argument of Mixpanel's `init` method._

### Intercom

* `apiKey` - your project's "app_id".

### Olark
No, Olark isn't an analytics provider. But if you have it installed, whenever you call `identify` the Olark chat will update the visitors name, so that you know who you're talking to!

* `apiKey` - your "Site-ID".

* `track` - whether to log every track call in the operator's Olark chat. This can be useful to know what your users are doing as you're chatting with them, but it can also be overwhelming. Defaults to `false`.
