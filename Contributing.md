# Contributing

We're huge fans of open-source, and absolutely we love getting good contributions to **analytics.js**! These docs will tell you everything you need to know about how to add your own integration to the library with a pull request, so we can merge it in for everyone else to use.


## Getting Setup

To start, we'll get you set up with our development environment. All of our development scripts and helpers are written in [node.js](http://nodejs.org), so you'll want to install that first by going to [nodejs.org](http://nodejs.org). If you have homebrew, you can:

    $ brew install node

Then after forking **analytics.js** just `cd` into the folder and run `make`:

    $ cd analytics.js
    $ make
    
That will install all of our [npm](http://npmjs.org) and [component](http://component.io) dependencies and compile the latest version of the development build to test against. You can now add your changes to the library, and run `make test` to make sure everything is passing still.

The commands you'll want to know for development are:

    $ make               # re-compiles the development build of analytics.js for testing
    $ make test          # runs all of the tests in your terminal
    $ make test-browser  # runs all of the tests in your browser, for nicer debugging


## Adding an Integration

We've written **analytics.js** to be very modular, so that adding new integrations is incredibly easy. The basic idea is that the `analytics` singleton has a list of `Integration` constructors, all keyed by name. For example:

```js
analytics.Integrations;

// {
//    'Google Analytics': [function],
//    'Mixpanel': [function],
//    'Customer.io': [function],
//    ...
// }
```

Each integration inherits from our `/lib/integration` constructor. And when you call `analytics.initialize`, it will create a new instance of all of the integrations you give it settings for. To add a new integration, all you need to do is create the new constructor function, and add it to the integrations map. To do that, we've got a couple helper methods.

Inside your integration file, just require the `integration` factory:

```js
var createIntegration = require('integration');
```

And then you can make your own integration constructor by passing it a `name`:

```js
var createIntegration = require('integration');


/**
 * Create a new integration named `"My Integration"`.
 */

var MyIntegration = integration('My Integration');
```

Once you have the prototype created, you just need to add any of the methods you can to add support for to the `prototype`. For example, an integration that implements `initialize` and `identify` would look like this:

```js
var MyIntegration = integration('My Integration');


/**
 * Initialize.
 * 
 * @param {Object} options
 * @param {Function} ready
 */

MyIntegration.prototype.initialize = function (options, ready) {
  // do stuff with `options` and call `ready`
};


/**
 * Identify.
 * 
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

MyIntegration.prototype.identify = function (id, traits, options) {
  // do stuff with `id` or `traits`
};
```

To get a good idea of how adding an integration works, check out some of our [existing](https://github.com/segmentio/analytics.js/tree/master/lib/providers/customerio.js) [integration](https://github.com/segmentio/analytics.js/tree/master/lib/providers/kissmetrics.js) [files](https://github.com/segmentio/analytics.js/tree/master/lib/providers/mixpanel.js).

_Note: if you wanted to add your own private integration, you'd do exactly the same thing, just inside your own codebase!_


## Writing Tests

Every contribution you make to **analytics.js** should be accompanied by matching tests. If you look inside of our `/test` folder, you'll see we're pretty serious about this. That's because:

2. **analytics.js** runs on tons of different types of browsers, operating systems, etc. and we want to make sure it runs well everywhere.
3. It lets us add new features much, much more quickly.
1. We aren't insane.

When adding your own integration, the easiest way to figure out what major things to test is to look at everything you've added to the integration `prototype`. You'll want to write testing groups for `#initialize`, `#identify`, `#track`, etc. And each group should test all of the expected functionality.

The most important thing to writing clean, easy-to-manage integrations is to **keep them small** and **clean up after each test**, so that the environment is never polluted by an individual test. For example, in the [`/test/providers/customerio.js`](https://github.com/segmentio/analytics.js/tree/master/test/providers/customerio.js) `#identify` tests you'll notice that we use the `beforeEach` and `afterEach` to make sure that user and spy state is cleared before and after each test. That way no individual test failing means all of the rest of the tests fail too. (Avoid domino situations!)

_Note: the one exception to clearing testing state is that our integrations all interact with the page by adding global variables, event listeners, etc. and we don't clean those up. That's partly because it's hard as hell to clean all that stuff up, but also because we want them to all work together anyways. If something really is failing there, we'll want to know about it._

If you run into any questions, check out a few of our [existing](https://github.com/segmentio/analytics.js/tree/master/test/providers/customerio.js) [test](https://github.com/segmentio/analytics.js/tree/master/test/providers/kissmetrics.js) [files](https://github.com/segmentio/analytics.js/tree/master/test/providers/mixpanel.js) to see how we've done it.


## Contributing Checklist

To help make contributing easy, here's all the things you need to remember:

- Add your integration file to `/lib/integrations`.
- Create a new Integration constructor with the `integration` factory component.
- Add your integration's `defaults` options to the `prototype`.
- Add an `initialize` method to your integration's `prototype`.
- Add methods you want to support to the `prototype`. (`identify`, `track`, `pageview`, etc.)
- Write tests for all of your integration's logic.
- Run the tests and get everything passing.
- **Don't commit a built version of the code, bump the version number, or edit the history!**
- Commit your changes with a nice commit message.
- Submit your pull request.
- Add a vector logo to the pull request comments if you want it merged into [Segment.io](https://segment.io) too!
