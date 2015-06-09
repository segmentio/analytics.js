# Analytics.js [![Build Status][ci-badge]][ci-link]

The hassle-free way to integrate analytics into any web application. 

Analytics.js is the open-source library that powers [Segment](https://segment.io). Segment is a hosted solution that gives you an interface by which to edit all of your settings, instead of having to write any code. It also extends the same functionality of Analytics.js to your [mobile apps](https://segment.io/libraries) and your [servers](https://segment.io/libraries).

## Documentation

First read the [Analytics.js QuickStart](https://segment.io/docs/tutorials/quickstart-analytics.js). For more detail check out the [Analytics.js Library Reference](https://segment.io/docs/libraries/analytics.js).

## Integrations

Looking to add support for a new integration, or modify an existing one? Take a look at the [segment-integrations](https://github.com/segment-integrations) organization, where all of the integration-specific code is stored. We love pull requests!

## Development

To get started with development, make sure you are running node `0.12`, clone the repository and then inside of it run:

```bash
$ make
```

That will build the `analytics.js` file, downloading all of the dependencies required to build it automatically. Then, edit as you please, and when you are ready to test run:

```bash
$ make test
```

That will build the latest version of `analytics.js`, lint all of the Javascript code, and run the specific tests automatically.

If you'd prefer to use the browser's developer tools, you can use:

```bash
$ make test-browser
```

Once your tests pass, you're ready to file a pull request!

## License

Copyright &copy; 2014 Segment &lt;friends@segment.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[ci-link]: https://travis-ci.org/segmentio/analytics.js
[ci-badge]: https://travis-ci.org/segmentio/analytics.js.png?branch=master
