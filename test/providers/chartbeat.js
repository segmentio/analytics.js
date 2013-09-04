
describe('Chartbeat', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  uid: 'x',
  domain: 'example.com'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Chartbeat: settings });
  this.integration = analytics._integrations.Chartbeat;
  this.options = this.integration.options;
  when(function () { return window.pSUPERFLY; }, done);
});

describe('#defaults', function () {
  it('domain', function () {
    assert(this.integration.defaults.domain === '');
  });

  it('uid', function () {
    assert(this.integration.defaults.uid === null);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.domain == settings.domain);
    assert(this.options.uid == settings.uid);
  });
});

describe('#pageview', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window.pSUPERFLY, 'virtualPage');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send default url', function () {
    analytics.pageview();
    assert(this.spy.calledWith(window.location.pathname));
  });

  it('should send a url', function () {
    analytics.pageview('/path');
    assert(this.spy.calledWith('/path'));
  });
});

});