
describe('Tapstream', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  accountName: 'tapstreamTestAccount'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Tapstream: settings });
  when(function () { return window._tsq._api; }, done);
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    var options = analytics._providers[0].options;
    assert(options.accountName == settings.accountName);
    assert(options.initialPageview);
  });

  it('should pass options to Tapstream', function () {
    assert(window._tsq._api.accountName == settings.accountName);
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._tsq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an event as a slug', function () {
    analytics.track('Event');
    assert(this.stub.calledWith(['fireHit', 'event', []]));
  });
});

describe('#pageview', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._tsq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send a "Loaded a Page" event', function () {
    analytics.pageview();
    assert(this.stub.calledWith(['fireHit', 'loaded-a-page', [undefined]]));
  });

  it('should send a url', function () {
    analytics.pageview('url');
    assert(this.stub.calledWith(['fireHit', 'loaded-a-page', ['url']]));
  });
});

});