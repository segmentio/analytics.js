
var Cloud = require('mocha-cloud')
  , cloud = new Cloud('Analytics.js', process.env.SAUCE_USERNAME,
                      process.env.SAUCE_ACCESS_KEY);

cloud.browser('chrome', '22', 'Mac 10.8');
cloud.url('http://localhost:8000/test/providers.html');

cloud.on('init', function (browser) {
  console.log(browser);
});

cloud.on('end', function (browser, res) {
  console.log(res);
});

cloud.start();