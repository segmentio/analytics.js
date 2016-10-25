/* eslint-env node */
'use strict';

module.exports = function(config) {
  config.set({
    files: [
      'test/**/*.test.js'
    ],

    browsers: ['PhantomJS'],

    frameworks: ['browserify', 'mocha'],

    reporters: ['progress', 'spec', 'coverage'],

    preprocessors: {
      'test/**/*.js': 'browserify'
    },

    client: {
      captureConsole: true,
      mocha: {
        grep: process.env.GREP,
        reporter: 'html',
        timeout: 80000
      }
    },

    browserify: {
      debug: true,
      transform: [
        [
          'browserify-istanbul',
          {
            instrumenterConfig: {
              embedSource: true
            }
          }
        ]
      ]
    },

    coverageReporter: {
      reporters: [
        { type: 'text' },
        { type: 'html' },
        { type: 'json' }
      ]
    },

    singleRun: true
  });
};
