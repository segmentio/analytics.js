require('jsdom-global/register');

var assert = require('assert');
var analytics = require('..');

describe('analytics.js', function() {
  it('has a version', function() {
    assert.equal(typeof analytics.VERSION, "string");
  });

  it('has integrations', function() {
    assert.equal(typeof analytics.Integrations, "object");
  });
});
