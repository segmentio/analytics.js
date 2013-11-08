
describe('LuckyOrange', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  site_id: '12345'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ LuckyOrange: settings });
  this.integration = analytics._integrations.LuckyOrange;
  this.options = this.integration.options;
  when(function () { return window._loq; }, done);
});

describe('#name', function () {
  it('LuckyOrange', function () {
    assert(this.integration.name == 'LuckyOrange');
  });
});

describe('#key', function () {
  it('site_id', function () {
    assert(this.integration.key == 'site_id');
  });
});

describe('#defaults', function () {
  it('site_id', function () {
    assert(this.integration.defaults.site_id === 0);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    expect(this.options.site_id == settings.site_id);
  });
});

});