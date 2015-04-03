
[![Build Status](https://travis-ci.org/segmentio/analytics.js.png?branch=master)](https://travis-ci.org/segmentio/analytics.js)

# Analytics.js 

The hassle-free way to integrate analytics into any web application. 

Analytics.js is the open-source library that powers [Segment](https://segment.io). Segment is a hosted solution that gives you an interface by which to edit all of your settings, instead of having to write any code. It also extends the same functionality of Analytics.js to your [mobile apps](https://segment.io/libraries) and your [servers](https://segment.io/libraries).

## Quick Start

Change (where it says `CHANGE` in comments) and put this code on your pages:

```js
(function () {
    var analytics = window.analytics = window.analytics || [];

    if (analytics.invoked) {
        if (window.console && console.error) {
            console.error('Segment snippet included twice.');
        }
        return;
    }
    analytics.invoked = true;

    analytics.methods = [
        'trackSubmit',
        'trackClick',
        'trackLink',
        'trackForm',
        'pageview',
        'identify',
        'initialize',
        'group',
        'track',
        'ready',
        'alias',
        'page',
        'once',
        'off',
        'on'
    ];
    analytics.factory = function (method) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(method);
            analytics.push(args);
            return analytics;
        };
    };

    if (!(typeof analytics.init === 'function')) {
        for (var i = 0; i < analytics.methods.length; i++) {
            var key = analytics.methods[i];
            analytics[key] = analytics.factory(key);
        }
    }

    analytics.load = function (path) {

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = path;

        var first = document.getElementsByTagName('script')[0];
        first.parentNode.insertBefore(script, first);
    };

    analytics.SNIPPET_VERSION = '3.0.1';
    analytics.load('http://example.net/analytics.js'); // CHANGE this URL
    analytics.initialize({ // CHANGE this configuration
        'Google Analytics': {
            trackingId: 'UA-XXXX-1'
        }
    });
    analytics.page();
})();
```

## Documentation

First read the [Analytics.js QuickStart](https://segment.io/docs/tutorials/quickstart-analytics.js). For more detail check out the [Analytics.js Library Reference](https://segment.io/docs/libraries/analytics.js).


## Integrations

Looking to add support for a new integration? Take a look at the [analytics.js-integrations](https://github.com/segmentio/analytics.js-integrations) repository, where all of the integration-specific code is stored. We love pull requests!

## Custom builds

It is possible to build your own version of `analytics.js` file with only integrations you use in your project.
To do so, rename `integrations.json.skel` to `integrations.json` and update it with [tracking services](https://github.com/segmentio/analytics.js-integrations/tree/master/lib) you plan to utilize.
Run `make` command to generate new `analytics.js` file.

## Development

If you're looking to work on integrations-specific logic, take a look at [`analytics.js-integrations`](https://github.com/segmentio/analytics.js-integrations). 

To get started with development make sure you are running node `0.11`, clone the repository and then inside of it run:

    $ make

That will build the `analytics.js` file, downloading all of the dependencies required to build it automatically. Then, edit as you please, and when you are ready to test run:

    $ make test

That will build the latest version of `analytics.js`, lint all of the Javascript code, and run the specific tests automatically.

If you'd prefer to use the browser's developer tools, you can use:

    $ make test-browser

Once your tests pass, you are ready to pull request!


## License

Copyright &copy; 2014 Segment &lt;friends@segment.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
