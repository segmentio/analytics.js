
describe('Spinnakr', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  siteId: 'x'
};

before(function (done) {
  // needed for spinnakr's script to set a global we can read
  window._spinnakr_development = true;

  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Spinnakr: settings });
  this.integration = analytics._integrations.Spinnakr;
  this.options = this.integration.options;
  when(function () { return window._spinnakr; }, done);
});

after(function () {
  delete window._spinnakr_development;
});

describe('#name', function () {
  it('Spinnakr', function () {
    assert(this.integration.name == 'Spinnakr');
  });
});

describe('#key', function () {
  it('siteId', function () {
    assert(this.integration.key == 'siteId');
  });
});

describe('#defaults', function () {
  it('siteId', function () {
    assert(this.integration.defaults.siteId === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    assert(this.options.siteId == settings.siteId);
  });
});

});