
describe('Drip', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  account: '9999999'
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

  it('should store account', function () {
    assert(this.options.account === settings.account);
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

  it('should send event as the action', function () {
    analytics.track('Test');
    assert(this.stub.calledWith(['track', { action: 'Test' }]));
  });

  it('should convert revenue to cents and alias to "value"', function () {
    analytics.track('Test', { revenue: 9.99 });
    assert(this.stub.calledWith(['track', { action: 'Test', value: 999 }]));
  });
});

});