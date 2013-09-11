
describe('Gauges', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  siteId: 'x'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Gauges: settings });
  this.integration = analytics._integrations.Gauges;
  this.options = this.integration.options;
  var stub = window._gauges.push;
  when(function () { return window._gauges.push != stub; }, done);
});

describe('#name', function () {
  it('Gauges', function () {
    assert(this.integration.name == 'Gauges');
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

  it('should store options', function () {
    assert(this.options.siteId == settings.siteId);
  });
});

describe('#pageview', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._gauges, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send a pageview', function () {
    analytics.pageview();
    assert(this.stub.calledWith(['track']));
  });
});

});