analytics.js
============
**Every project needs analytics.** The more you know about how your system is being used, the better your product decisions will be. In the end your users will benefit.

But having analytics shouldn't mean your tying yourself to a single third-party analytics service and littering your codebase third-party-specific calls. Changing or adding new providers should be a snap. That's where **analytics.js** comes in. The APIs for most analytics services track the same sorts of metrics, so it's not hard to build an abstraction layer that fits most use cases. And that's what we did! We even use **analytics.js** in [Segment.io](https://segment.io).

The API is dead simple. You won't want to go back to using some of those dated third-party APIs!



## The API
Our goal for the API was to iron out the kinks that crop up in lots of third-party analytics services API's. Keep things simple!  With analytics you record two things: users and their actions.

### Initialize
When you're ready to start using **analytics.js**, you make a call to initialize with the analytics providers you want to enable and the settings each one needs. That looks like this:

```javascript
analytics.initialize({
    'Google Analytics' : {
        apiKey : 'UA-XXXXXX-XX'
    },
    'Segment.io' : {
        apiKey : 'mkS9qdwk12d7'
    }
});
```

Did we mention this means you never need to mess with analytics snippets again? Bonus!


### Identify
Identify is how you tie a user to their actions. You **identify** your user with the `userId` you recognize them by, which is usually an email. The API looks like this:

```javascript
analytics.identify(userId, traits);
```

+ `userId` is the ID you refer to your user by.
+ `traits` is an _optional_ dictionary of things you know about the user. Things like: `Subscription Plan`, `Friend Count`, `Age`, etc.

```javascript
analytics.identify('achilles@segment.io', {
    subscriptionPlan : 'Gold',
    friendCount      : 29
});
```

We usually recommend using a backend template to inject an identify with the `userId` straight into the footer of every page of your application. That way no matter what page the user lands on, the call is made.


### Track
Track is how you record events your users trigger. Whenever your using does something you want to record, **track** that event. The API looks like this:

```javascript
analytics.track(event, properties);
```

+ `event` is the name of the event.
+ `properties` is an _optional_ dictionary of properties for the event. If the event was `Added to Shopping Cart`, it might have properties like `Price`, `Product Category`, etc.

```javascript
analytics.track('Complete Purchase', {
    price          : 40.20,
    shippingMethod : '2-day'
});
```


## Using analytics.js

1. Grab the latest version of **analytics.js** from this repo and add it to your project.

2. Open up **analytics.js**, scroll to the bottom, and choose the providers you want to keep (or add your own).

3. Initialize **analytics.js**.

4. Add an **identify** and some **track** calls to the things you want to record.

5. Spend all day swapping your analytics providers in and out just because you can!


## Questions

### Where should I put the identify call?
We usually recommend using a backend template to inject an identify with the `userId` straight into the footer of every page of your application. That way no matter what page the user lands on, the call is made.

### What traits should I record?
The single most important trait to record is something like `Membership Level` or `Subscription Type` or however you break your users into different tiers. That way, you can focus on getting people into the higher tiers.

Other things you might want to **identify** are things like `Friend Count`, `Company`, `Business Type`, `Employee Count`, etc.

### What events should I track?
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

### Google Analytics doesn't have traits! ... Intercom doesn't have events!
That's all right. If a provider doesn't handle a certain type of call, nothing will break. So you don't have to worry about anything.


## Contributing
We love contributions! If you have a provider you'd like to add, feel free to submit a pull request. You can check out the providers that we've already written for guidance. (Please make sure to add tests!)



