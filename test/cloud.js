
var _          = require('underscore')
  , Cloud      = require('mocha-cloud')
  , cloud      = new Cloud('Analytics.js', process.env.SAUCE_USERNAME,
                      process.env.SAUCE_ACCESS_KEY);

cloud.browser('internet explorer', '10', 'Windows 2012');
cloud.url('http://segmentio.github.com/analytics.js/test/providers.html');


cloud.on('end', function (browser, res) {
});

cloud.start(function (err, res) {

  if (!err) {
    _.each(res, function (result) {

      console.log(result.failures);
      _.each(result.failed, console.log);
    });
  }
});

