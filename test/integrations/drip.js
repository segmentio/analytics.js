
describe('Drip', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  account: '9999999',
  events: { 
    'Test': '1234'
  }
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ 'Drip': settings });
  this.integration = analytics._integrations['Drip'];
  this.options = this.integration.options;
  when(function () { return window.dc; }, done);
});

describe('#name', function () {
  it('Drip', function () {
    assert(this.integration.name == 'Drip');
  });
});

describe('#key', function () {
  it('account', function () {
    assert(this.integration.key == 'account');
  });
});

describe('#defaults', function () {
  it('account', function () {
    assert(this.integration.defaults.account === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store account and events', function () {
    assert(this.options.account === settings.account);
    assert(equal(this.options.events, settings.events));
  });

  it('should pass account to Drip', function () {
    assert(window._dcs.account === settings.account);
  });
});


describe('#track', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._dcq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should not track the event is not in the goal map', function () {
    analytics.track('Not In Goal Map');
    assert(this.stub.neverCalledWith(sinon.match.any));
  });

  it('should track if the event is in the goal map', function () {
    analytics.track('Test');
    assert(this.stub.calledWith(['trackConversion', { id: '1234' }]));
  });

  it('should convert revenue to cents and alias to "value"', function () {
    analytics.track('Test', { revenue: 9.99 });
    assert(this.stub.calledWith(['trackConversion', { id: '1234', value: 999 }]));
  });
});

});