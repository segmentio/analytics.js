/**
 * Mocha cloud runner, adapted from visionmedia/mocha-cloud/client.js
 */
(function (global) {

  var mochaCloud = function (runner) {
    var failed = [];

    runner.on('fail', function(test, err){
      failed.push({
        title: test.title,
        fullTitle: test.fullTitle(),
        error: {
          message: err.message,
          stack: err.stack
        }
      });
    });

    runner.on('end', function(){
      runner.stats.failed = failed;
      global.mochaResults = runner.stats;
    });
  };

  global.mochaCloud = mochaCloud;

})(window);
